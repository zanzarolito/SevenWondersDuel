const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configuration Socket.IO avec options pour Render.com
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Servir les fichiers statiques
app.use(express.static('public'));

// Route de santé pour Render.com
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Gestion des rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Nouveau joueur connecté:', socket.id);

  // Créer une room
  socket.on('createRoom', (playerName) => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      id: roomId,
      players: [{ id: socket.id, name: playerName, playerNumber: 1 }],
      gameState: null,
      status: 'waiting'
    });
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerNumber: 1 });
    console.log(`Room ${roomId} créée par ${playerName}`);
  });

  // Rejoindre une room
  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room introuvable');
      return;
    }
    if (!room.players || room.players.length >= 2) {
      socket.emit('error', 'Room complète');
      return;
    }
    if (room.status !== 'waiting') {
      socket.emit('error', 'Partie déjà en cours');
      return;
    }

    room.players.push({ id: socket.id, name: playerName, playerNumber: 2 });
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, playerNumber: 2 });
    
    // Notifier les deux joueurs
    io.to(roomId).emit('playerJoined', {
      players: room.players.map(p => ({ name: p.name, playerNumber: p.playerNumber }))
    });
    
    console.log(`${playerName} a rejoint la room ${roomId}`);
  });

  // Démarrer la partie
  socket.on('startGame', (roomId) => {
    console.log('Tentative de démarrage de la partie:', roomId);
    
    const room = rooms.get(roomId);
    if (!room) {
      console.error('Room introuvable:', roomId);
      socket.emit('error', 'Room introuvable');
      return;
    }
    if (!room.players || room.players.length !== 2) {
      console.error('Nombre de joueurs incorrect:', room.players?.length);
      socket.emit('error', 'Impossible de démarrer la partie');
      return;
    }
    
    room.status = 'playing';
    
    try {
      // Initialiser l'état du jeu côté serveur
      const gameState = initializeGameState();
      
      if (!gameState) {
        throw new Error('initializeGameState a retourné undefined');
      }
      
      room.gameState = gameState;
      
      console.log('État du jeu initialisé, envoi aux joueurs...');
      
      // Envoyer l'état initial aux deux joueurs
      io.to(roomId).emit('gameStarted', { gameState });
      
      console.log(`Partie démarrée dans la room ${roomId}`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du jeu:', error);
      socket.emit('error', 'Erreur lors du démarrage de la partie');
    }
  });

  // Re-rejoindre une room après navigation vers game.html (nouveau socket)
  socket.on('rejoinRoom', ({ roomId, playerNumber }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.warn(`rejoinRoom: room ${roomId} introuvable pour joueur ${playerNumber}`);
      return;
    }
    socket.join(roomId);
    // Mettre à jour le socket ID du joueur et marquer comme socket game.html
    const player = room.players.find(p => p.playerNumber === playerNumber);
    if (player) {
      player.id = socket.id;
      player.inGameSocket = true;
    }
    console.log(`Joueur ${playerNumber} a rejoint la room ${roomId} depuis game.html (socket: ${socket.id})`);
  });

  // Synchroniser l'état du jeu
  socket.on('gameStateUpdate', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.gameState = gameState;
    socket.to(roomId).emit('gameStateSync', gameState);
  });

  // Actions de jeu
  socket.on('playerAction', ({ roomId, action, data }) => {
    socket.to(roomId).emit('opponentAction', { action, data });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Joueur déconnecté:', socket.id);

    // Trouver et nettoyer la room
    for (const [roomId, room] of rooms.entries()) {
      if (!room || !room.players) continue;

      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        const inGameSocket = room.players[playerIndex].inGameSocket;

        if (room.status === 'playing') {
          // Partie en cours : ne jamais supprimer la room.
          // Les deux joueurs naviguent de index.html vers game.html,
          // ce qui provoque deux déconnexions successives. La room doit
          // survivre pour que rejoinRoom puisse fonctionner depuis game.html.
          room.players[playerIndex].id = null;

          if (inGameSocket) {
            // Vrai déconnexion depuis game.html → prévenir l'adversaire
            socket.to(roomId).emit('playerDisconnected', { playerName });
            console.log(`Joueur ${playerName} déconnecté de la partie ${roomId}`);
          } else {
            // Transition index.html → game.html, déconnexion temporaire
            console.log(`Joueur ${playerName} navigue vers game.html (room ${roomId})`);
          }
        } else {
          // Lobby (status='waiting') : supprimer la room
          socket.to(roomId).emit('playerDisconnected', { playerName });
          rooms.delete(roomId);
          console.log(`Room ${roomId} supprimée (lobby)`);
        }
        break;
      }
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const ALL_PROGRESS_TOKENS = [
  { id:'agriculture',   name:'Agriculture',   icon:'🌾', effect:'Prendre 6 pièces. +4 PV fin de partie.' },
  { id:'architecture',  name:'Architecture',  icon:'🏛', effect:'Prochaines Merveilles coûtent 2 ressources de moins.' },
  { id:'economie',      name:'Économie',      icon:'💹', effect:"Récupérer les pièces que l'adversaire paie pour acheter des ressources." },
  { id:'loi',           name:'Loi',           icon:'⚖',  effect:'Apporte 1 symbole scientifique.' },
  { id:'maconnerie',    name:'Maçonnerie',    icon:'🧱', effect:'Prochains bâtiments civils (bleus) coûtent 2 ressources de moins.' },
  { id:'mathematiques', name:'Mathématiques', icon:'📐', effect:'+3 PV par jeton Progrès en possession (ce jeton compris).' },
  { id:'philosophie',   name:'Philosophie',   icon:'📜', effect:'+7 PV en fin de partie.' },
  { id:'strategie',     name:'Stratégie',     icon:'♟',  effect:'Prochains bâtiments militaires ont +1 bouclier supplémentaire.' },
  { id:'theologie',     name:'Théologie',     icon:'✝',  effect:'Prochaines Merveilles ont l\'effet Rejouer.' },
  { id:'urbanisme',     name:'Urbanisme',     icon:'🏙', effect:'+6 pièces maintenant. Chaque construction gratuite par chaînage rapporte +4 pièces.' },
];

// Initialiser l'état du jeu (même logique que côté client)
function initializeGameState() {
  // Mélanger les merveilles
  const allWonders = [
    { id:'circus_maximus',    name:'Circus Maximus',       cost:{stone:2,wood:1,glass:1},          effects:[{type:'destroy_card',color:'gray'},{type:'shields',amount:1},{type:'vp',amount:3}],                         desc:'Détruire 1 carte grise adverse. +1 bouclier. +3 PV.' },
    { id:'colosse',           name:'Colosse',              cost:{clay:3,glass:1},                  effects:[{type:'shields',amount:2},{type:'vp',amount:3}],                                                             desc:'+2 boucliers. +3 PV.' },
    { id:'grand_phare',       name:'Grand Phare',          cost:{clay:1,stone:1,papyrus:2},        effects:[{type:'produce_choice',res:['stone','clay','wood']},{type:'vp',amount:4}],                                   desc:'Produit Pierre/Argile/Bois au choix. +4 PV.' },
    { id:'jardins_suspendus', name:'Jardins Suspendus',    cost:{clay:2,glass:1,papyrus:1},        effects:[{type:'coins',amount:6},{type:'replay'},{type:'vp',amount:3}],                                               desc:'+6 pièces. Rejouer. +3 PV.' },
    { id:'grande_bibliotheque',name:'Grande Bibliothèque', cost:{wood:3,glass:1,papyrus:1},        effects:[{type:'choose_progress'},{type:'vp',amount:4}],                                                              desc:'Choisir 1 jeton Progrès parmi 3 écartés. +4 PV.' },
    { id:'mausolee',          name:'Mausolée',             cost:{clay:2,glass:2,papyrus:1},        effects:[{type:'build_discard'},{type:'vp',amount:2}],                                                                desc:'Construire gratuitement une carte de la défausse. +2 PV.' },
    { id:'piree',             name:'Pirée',                cost:{wood:2,stone:1,clay:1},           effects:[{type:'produce_choice',res:['glass','papyrus']},{type:'replay'},{type:'vp',amount:2}],                       desc:'Produit Verre/Papyrus au choix. Rejouer. +2 PV.' },
    { id:'pyramides',         name:'Pyramides',            cost:{stone:3,papyrus:1},               effects:[{type:'vp',amount:9}],                                                                                       desc:'+9 PV.' },
    { id:'sphinx',            name:'Sphinx',               cost:{clay:1,stone:1,glass:2},          effects:[{type:'replay'},{type:'vp',amount:6}],                                                                       desc:'Rejouer. +6 PV.' },
    { id:'statue_de_zeus',    name:'Statue de Zeus',       cost:{clay:1,wood:1,papyrus:2,stone:1}, effects:[{type:'destroy_card',color:'brown'},{type:'shields',amount:1},{type:'vp',amount:3}],                         desc:'Détruire 1 carte marron adverse. +1 bouclier. +3 PV.' },
    { id:'temple_artemis',    name:"Temple d'Artémis",     cost:{wood:1,stone:1,glass:1,papyrus:1},effects:[{type:'coins',amount:12},{type:'replay'}],                                                                   desc:'+12 pièces. Rejouer.' },
    { id:'via_appia',         name:'Via Appia',            cost:{stone:2,clay:2,papyrus:1},        effects:[{type:'coins',amount:3},{type:'opponent_coins',amount:-3},{type:'replay'},{type:'vp',amount:3}],             desc:'+3 pièces. Adversaire perd 3 pièces. Rejouer. +3 PV.' },
  ];
  
  // Mélanger les merveilles (Fisher-Yates)
  for (let i = allWonders.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allWonders[i], allWonders[j]] = [allWonders[j], allWonders[i]];
  }

  // Mélanger les jetons Progrès et en sélectionner 5
  const allTokens = [...ALL_PROGRESS_TOKENS];
  for (let i = allTokens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTokens[i], allTokens[j]] = [allTokens[j], allTokens[i]];
  }

  return {
    age: 0,
    currentPlayer: 1,
    players: {
      1: { coins: 7, cards: [], wonders: [], progressTokens: [], choiceCards: [], scienceSymbols: [], tradeDiscounts: {} },
      2: { coins: 7, cards: [], wonders: [], progressTokens: [], choiceCards: [], scienceSymbols: [], tradeDiscounts: {} }
    },
    conflictPos: 0,
    militaryTokensUsed: [],
    progressTokensAvailable: allTokens.slice(0, 5).map(t => ({...t, taken: false})),
    removedProgressTokens: allTokens.slice(5),
    discardPile: [],
    structureCards: [],
    structureLayout: [],
    wondersBuilt: 0,
    log: [],
    selectedCard: null,
    selectedWonder: null,
    pendingAction: null,
    draft: {
      pool: allWonders,
      group: 0,
      round: 0,
      sequences: [
        [[1,1],[2,2],[1,1]],
        [[2,1],[1,2],[2,1]],
      ],
      stepIdx: 0,
      stepPicks: 0,
      offered: allWonders.slice(0, 4)
    }
  };
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
