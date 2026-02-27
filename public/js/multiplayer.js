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
    if (typeof G === 'undefined' || typeof renderAll === 'undefined') {
      console.warn('G ou renderAll non defini');
      return;
    }
    
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
    
    console.log('État synchronisé, currentPlayer:', G.currentPlayer);
    renderAll();
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
    switch (action) {
      case 'cardSelected':
        break;
      case 'turnComplete':
        if (typeof renderAll !== 'undefined') {
          renderAll();
        }
        break;
      case 'cardBuilt':
      case 'cardDiscarded':
      case 'wonderBuilt':
        // Ces actions sont déjà synchronisées via gameStateSync
        // On rafraîchit juste l'affichage
        console.log('Action recue:', action, 'par J' + data.playerNumber);
        if (typeof renderAll !== 'undefined') {
          renderAll();
        }
        break;
      case 'wonderPicked':
        if (data.offerIdx !== undefined && typeof G !== 'undefined') {
          const d = G.draft;
          const w = d.offered[data.offerIdx];
          if (w && !w._taken) {
            w._taken = true;
            G.players[data.playerNumber].wonders.push({...w, built: false});
            if (typeof addLog !== 'undefined') {
              addLog('J' + data.playerNumber + ' choisit ' + w.name);
            }
            
            d.stepPicks++;
            const seq = d.sequences[d.group];
            const picksInStep = seq[d.stepIdx][1];
            
            if (d.stepPicks >= picksInStep) {
              d.stepIdx++;
              d.stepPicks = 0;
            }
            
            if (d.stepIdx >= seq.length) {
              d.group++;
              if (d.group >= 2) {
                if (typeof finishDraft !== 'undefined') {
                  finishDraft();
                }
              } else {
                const groupStart = d.group * 4;
                d.offered = d.pool.slice(groupStart, groupStart + 4);
                d.offered.forEach(w => w._taken = false);
                d.stepIdx = 0;
                d.stepPicks = 0;
                if (typeof showDraftOverlay !== 'undefined') {
                  showDraftOverlay();
                }
              }
            } else {
              if (typeof showDraftOverlay !== 'undefined') {
                showDraftOverlay();
              }
            }
          }
        }
        break;
    }
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
