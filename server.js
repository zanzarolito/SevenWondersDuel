const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const compression = require('compression');
const { WONDER_DATA, PROGRESS_DATA } = require('./public/js/shared-data');

const app = express();
const server = http.createServer(app);

// En production, restreindre les origines CORS à l'URL du déploiement.
// Définir CLIENT_ORIGIN dans les variables d'environnement (ex: https://monapp.render.com).
// En développement (pas de CLIENT_ORIGIN), tout est autorisé.
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';

const io = socketIO(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
});

app.use(compression());   // gzip sur tous les fichiers statiques et réponses
app.use(express.static('public'));

// Gestion des rooms
const rooms = new Map();

// Durées d'expiration
const LOBBY_TIMEOUT   = 10 * 60 * 1000;  // 10 min sans 2e joueur
const PLAYING_TIMEOUT =  2 * 60 * 60 * 1000;  // 2 h sans activité en partie

// Nettoyage périodique (toutes les 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    const idle = now - room.lastActivity;
    const expired =
      (room.status === 'waiting' && idle > LOBBY_TIMEOUT) ||
      (room.status === 'playing' && idle > PLAYING_TIMEOUT);
    if (expired) {
      io.to(roomId).emit('roomExpired', { reason: 'Partie expirée pour inactivité.' });
      rooms.delete(roomId);
      console.log(`[cleanup] Room ${roomId} supprimée (${Math.round(idle / 60000)} min d'inactivité)`);
    }
  }
}, 5 * 60 * 1000);

io.on('connection', (socket) => {
  console.log('Nouveau joueur connecté:', socket.id);

  // Créer une room
  socket.on('createRoom', (playerName) => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      id: roomId,
      players: [{ id: socket.id, name: playerName, playerNumber: 1 }],
      gameState: null,
      status: 'waiting',
      lastActivity: Date.now(),
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
    room.lastActivity = Date.now();
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
    room.lastActivity = Date.now();

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

  // Re-rejoindre une room après navigation vers game.html ou reconnexion
  socket.on('rejoinRoom', ({ roomId, playerNumber }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.warn(`rejoinRoom: room ${roomId} introuvable pour joueur ${playerNumber}`);
      // Prévenir le client pour qu'il redirige vers l'accueil
      socket.emit('roomExpired', { reason: 'La partie n\'existe plus (serveur redémarré ?).' });
      return;
    }
    socket.join(roomId);
    const player = room.players.find(p => p.playerNumber === playerNumber);
    if (player) {
      player.id = socket.id;
      player.inGameSocket = true;
    }
    room.lastActivity = Date.now();
    // Renvoyer l'état courant au joueur reconnecté (page rechargée, onglet restauré…)
    if (room.gameState) {
      socket.emit('gameStateSync', room.gameState);
    }
    console.log(`Joueur ${playerNumber} a rejoint/reconnecté la room ${roomId} (socket: ${socket.id})`);
  });

  // Synchroniser l'état du jeu
  socket.on('gameStateUpdate', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.gameState = gameState;
    room.lastActivity = Date.now();
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

// Initialiser l'état du jeu (utilise les données partagées de shared-data.js)
function initializeGameState() {
  // Copies mélangées (Fisher-Yates) — on ne modifie pas les tableaux source
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const allWonders = shuffle(WONDER_DATA);
  const allTokens  = shuffle(PROGRESS_DATA);

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
