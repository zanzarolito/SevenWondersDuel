const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

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
        
        // Notifier les autres joueurs
        socket.to(roomId).emit('playerDisconnected', {
          playerName: playerName
        });
        
        // Supprimer la room si elle est vide ou en attente
        if (room.status === 'waiting' || room.players.length <= 1) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} supprimée`);
        } else {
          // Retirer le joueur de la room
          room.players.splice(playerIndex, 1);
        }
        break;
      }
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialiser l'état du jeu (même logique que côté client)
function initializeGameState() {
  // Mélanger les merveilles
  const allWonders = [
    { id:'circus_maximus', name:'Circus Maximus', cost:{stone:2,wood:1,glass:1}, effects:[{type:'destroy_card',color:'gray'},{type:'shields',amount:1},{type:'vp',amount:3}] },
    { id:'colosse', name:'Colosse', cost:{clay:3,glass:1}, effects:[{type:'shields',amount:2},{type:'vp',amount:3}] },
    { id:'grand_phare', name:'Grand Phare', cost:{clay:1,stone:1,papyrus:2}, effects:[{type:'produce_choice',res:['stone','clay','wood']},{type:'vp',amount:4}] },
    { id:'jardins_suspendus', name:'Jardins Suspendus', cost:{clay:2,glass:1,papyrus:1}, effects:[{type:'coins',amount:6},{type:'replay'},{type:'vp',amount:3}] },
    { id:'grande_bibliotheque', name:'Grande Bibliothèque', cost:{wood:3,glass:1,papyrus:1}, effects:[{type:'choose_progress'},{type:'vp',amount:4}] },
    { id:'mausolee', name:'Mausolée', cost:{clay:2,glass:2,papyrus:1}, effects:[{type:'build_discard'},{type:'vp',amount:2}] },
    { id:'piree', name:'Pirée', cost:{wood:2,stone:1,clay:1}, effects:[{type:'produce_choice',res:['glass','papyrus']},{type:'replay'},{type:'vp',amount:2}] },
    { id:'pyramides', name:'Pyramides', cost:{stone:3,papyrus:1}, effects:[{type:'vp',amount:9}] },
    { id:'sphinx', name:'Sphinx', cost:{clay:1,stone:1,glass:2}, effects:[{type:'replay'},{type:'vp',amount:6}] },
    { id:'statue_de_zeus', name:'Statue de Zeus', cost:{clay:1,wood:1,papyrus:2,stone:1}, effects:[{type:'destroy_card',color:'brown'},{type:'shields',amount:1},{type:'vp',amount:3}] },
    { id:'temple_artemis', name:"Temple d'Artémis", cost:{wood:1,stone:1,glass:1,papyrus:1}, effects:[{type:'coins',amount:12},{type:'replay'}] },
    { id:'via_appia', name:'Via Appia', cost:{stone:2,clay:2,papyrus:1}, effects:[{type:'coins',amount:3},{type:'opponent_coins',amount:-3},{type:'replay'},{type:'vp',amount:3}] },
  ];
  
  // Mélanger (Fisher-Yates)
  for (let i = allWonders.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allWonders[i], allWonders[j]] = [allWonders[j], allWonders[i]];
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
    progressTokensAvailable: [],
    removedProgressTokens: [],
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
