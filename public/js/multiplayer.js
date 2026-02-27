// Gestion du multijoueur avec Socket.IO
class MultiplayerManager {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.playerNumber = null;
    this.isConnected = false;
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    this.roomId = urlParams.get('room');
    this.playerNumber = parseInt(urlParams.get('player'));

    if (!this.roomId || !this.playerNumber) {
      console.warn('Mode solo: pas de room ou playerNumber');
      return false;
    }

    this.socket = io();
    this.setupSocketListeners();
    return true;
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connecte au serveur, socket ID:', this.socket.id);
      this.isConnected = true;
      // Re-rejoindre la room après reconnexion (nouvelle page après lobby)
      if (this.roomId && this.playerNumber) {
        this.socket.emit('rejoinRoom', {
          roomId: this.roomId,
          playerNumber: this.playerNumber
        });
        console.log('rejoinRoom emis pour room', this.roomId, 'joueur', this.playerNumber);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Deconnecte du serveur');
      this.isConnected = false;
      if (typeof notify !== 'undefined') {
        notify('Connexion perdue...', 'error');
      }
    });

    this.socket.on('gameStateSync', (gameState) => {
      console.log('Synchronisation de l\'etat du jeu recue');
      this.syncGameState(gameState);
    });

    this.socket.on('opponentAction', ({ action, data }) => {
      console.log('Action de l\'adversaire recue:', action, data);
      this.handleOpponentAction(action, data);
    });

    this.socket.on('playerDisconnected', ({ playerName }) => {
      console.log('Joueur deconnecte:', playerName);
      if (typeof notify !== 'undefined') {
        notify(playerName + ' s\'est deconnecte', 'error');
      }
      setTimeout(() => {
        if (confirm('Votre adversaire s\'est deconnecte. Retourner au lobby ?')) {
          window.location.href = '/';
        }
      }, 1000);
    });

    this.socket.on('error', (error) => {
      console.error('Erreur Socket.IO:', error);
    });
  }

  syncGameState(gameState) {
    if (typeof G === 'undefined') {
      console.warn('G non defini');
      return;
    }

    const prevAge = G.age;

    console.log('Synchronisation de l\'etat:', {
      avant: { currentPlayer: G.currentPlayer, age: G.age },
      apres: { currentPlayer: gameState.currentPlayer, age: gameState.age }
    });

    // Remplacer complètement l'état (pas juste assign)
    for (const key in G) {
      delete G[key];
    }
    for (const key in gameState) {
      G[key] = gameState[key];
    }

    console.log('État synchronisé, age:', G.age, 'currentPlayer:', G.currentPlayer);

    if (G.age === 0) {
      // Phase de sélection des merveilles : rafraîchir l'overlay de draft
      if (typeof showDraftOverlay !== 'undefined') {
        showDraftOverlay();
      }
    } else {
      // Partie en cours : masquer l'overlay de draft si encore visible
      const draftOverlay = document.getElementById('draft-overlay');
      if (draftOverlay) draftOverlay.classList.remove('active');

      // Transition draft → jeu : montrer l'overlay de phase
      if (prevAge === 0 && G.age >= 1) {
        const ageNames = ['', 'I', 'II', 'III'];
        if (typeof showPhaseOverlay !== 'undefined') {
          showPhaseOverlay(
            'Âge ' + ageNames[G.age],
            'Joueur ' + G.currentPlayer + ' commence — Bonne chance !',
            true
          );
        }
      }

      if (typeof renderAll !== 'undefined') {
        renderAll();
      }

      // Notification de changement de tour
      if (G.currentPlayer === this.playerNumber) {
        if (typeof notify !== 'undefined') notify('À votre tour !', 'success');
      } else {
        if (typeof notify !== 'undefined') notify('Tour de l\'adversaire...', 'error');
      }
    }
  }

  sendGameState() {
    if (!this.isConnected || !this.roomId) return;

    this.socket.emit('gameStateUpdate', {
      roomId: this.roomId,
      gameState: G
    });
  }

  sendAction(action, data) {
    if (!this.isConnected || !this.roomId) return;

    this.socket.emit('playerAction', {
      roomId: this.roomId,
      action,
      data
    });
  }

  handleOpponentAction(action, data) {
    // Toutes les mises à jour d'état passent par gameStateSync.
    // Ce handler ne fait qu'un log pour le débogage.
    console.log('Action adversaire reçue:', action, data ? ('J' + data.playerNumber) : '');
  }

  isMyTurn() {
    return typeof G !== 'undefined' && G.currentPlayer === this.playerNumber;
  }

  getMyPlayer() {
    return typeof G !== 'undefined' ? G.players[this.playerNumber] : null;
  }

  getOpponentPlayer() {
    if (typeof G === 'undefined') return null;
    const oppNumber = this.playerNumber === 1 ? 2 : 1;
    return G.players[oppNumber];
  }
}

// Instance globale - toujours definie
const MP = new MultiplayerManager();

// Rendre MP accessible globalement
if (typeof window !== 'undefined') {
  window.MP = MP;
}
