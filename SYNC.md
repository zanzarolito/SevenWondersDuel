# 🔄 Système de Synchronisation Multijoueur

## Vue d'ensemble

Le jeu utilise Socket.IO pour synchroniser l'état entre les deux joueurs en temps réel.

## Architecture

```
Joueur 1                    Serveur                    Joueur 2
   |                           |                           |
   |-- Action (emit) --------->|                           |
   |                           |-- Action (broadcast) ---->|
   |                           |                           |
   |<-- GameState (emit) ------|<-- GameState (emit) ------|
   |                           |                           |
```

## Actions Synchronisées

### 1. Draft des Merveilles

**Événement:** `wonderPicked`

**Données:**
```javascript
{
  offerIdx: number,      // Index de la merveille choisie (0-3)
  playerNumber: number   // 1 ou 2
}
```

**Flux:**
1. Joueur clique sur une merveille
2. `draftPickWonder()` vérifie que c'est son tour
3. Envoie `MP.sendAction('wonderPicked', data)`
4. Envoie `MP.sendGameState()` pour synchroniser
5. L'adversaire reçoit l'action et met à jour son état

### 2. Construction de Carte

**Événement:** `cardBuilt`

**Données:**
```javascript
{
  cardId: string,        // ID de la carte construite
  playerNumber: number   // 1 ou 2
}
```

**Flux:**
1. Joueur clique "Construire"
2. `performBuild()` vérifie:
   - C'est son tour
   - Il a assez de pièces
3. Applique les effets localement
4. Envoie l'action + état complet
5. L'adversaire reçoit et rafraîchit l'affichage

### 3. Défausse de Carte

**Événement:** `cardDiscarded`

**Données:**
```javascript
{
  cardId: string,        // ID de la carte défaussée
  playerNumber: number   // 1 ou 2
}
```

**Flux:**
1. Joueur clique "Défausser"
2. `performDiscard()` ajoute les pièces
3. Retire la carte de la structure
4. Synchronise l'état

### 4. Construction de Merveille

**Événement:** `wonderBuilt`

**Données:**
```javascript
{
  cardId: string,        // Carte utilisée comme ressource
  wonderIdx: number,     // Index de la merveille (0-3)
  playerNumber: number,  // 1 ou 2
  replay: boolean        // Si le joueur rejoue
}
```

**Flux:**
1. Joueur sélectionne merveille + carte
2. `performWonderBuild()` vérifie le coût
3. Applique les effets de la merveille
4. Synchronise
5. Si `replay: true`, le joueur garde la main

## Vérifications de Tour

Chaque action vérifie:
```javascript
if (typeof MP !== 'undefined' && MP.playerNumber && G.currentPlayer !== MP.playerNumber) {
  notify("Ce n'est pas votre tour!", 'error');
  return;
}
```

## Interface Utilisateur

### Indicateurs de Tour

**Panel d'actions:**
- Tour du joueur: Boutons actifs, message "Sélectionnez une carte"
- Tour adversaire: Boutons désactivés, message "⏳ Tour de l'adversaire..."

**Notifications:**
- Changement de tour: "A votre tour!" (vert) ou "Tour de l'adversaire..." (rouge)

**Bannière en haut:**
- `#current-player-banner` change de couleur selon le joueur actif

## Synchronisation de l'État

### Méthode 1: État Complet (utilisée)

Après chaque action, on envoie l'état complet du jeu:
```javascript
MP.sendGameState(); // Envoie tout l'objet G
```

**Avantages:**
- Simple à implémenter
- Pas de désynchronisation possible
- Facile à déboguer

**Inconvénients:**
- Plus de données transférées
- Peut être lent sur connexion lente

### Méthode 2: Deltas (non utilisée)

On pourrait envoyer seulement les changements:
```javascript
MP.sendDelta({ coins: { 1: -5 }, cards: { 1: ['new_card'] } });
```

## Gestion des Erreurs

### Déconnexion

Si un joueur se déconnecte:
1. L'autre joueur reçoit `playerDisconnected`
2. Affiche une notification
3. Propose de retourner au lobby

### Désynchronisation

Si les états divergent:
1. Rafraîchir la page (F5)
2. Les deux joueurs rechargent depuis le serveur
3. L'état est restauré

### Latence

Le jeu tolère bien la latence car:
- Tour par tour (pas de temps réel)
- Vérifications côté client ET serveur
- Notifications visuelles claires

## Logs de Débogage

### Console Serveur
```
Tentative de démarrage de la partie: ABC123
État du jeu initialisé, envoi aux joueurs...
Partie démarrée dans la room ABC123
```

### Console Navigateur
```
Connecte au serveur, socket ID: xyz789
Action recue: cardBuilt par J1
Synchronisation de l'etat du jeu recue
```

## Tests de Synchronisation

### Test 1: Construction Simple
1. J1 construit une carte
2. Vérifier que J2 voit la carte apparaître dans la cité de J1
3. Vérifier que c'est maintenant le tour de J2

### Test 2: Défausse
1. J1 défausse une carte
2. Vérifier que J2 voit les pièces de J1 augmenter
3. Vérifier que la carte disparaît de la structure

### Test 3: Merveille
1. J1 construit une merveille
2. Vérifier que J2 voit la merveille construite
3. Vérifier les effets (pièces, boucliers, etc.)

### Test 4: Rejouer
1. J1 construit une merveille avec effet "Rejouer"
2. Vérifier que J1 garde la main
3. Vérifier que J2 voit "Tour de J1" continuer

### Test 5: Fin d'Âge
1. Jouer jusqu'à la dernière carte de l'âge
2. Vérifier que les deux joueurs passent à l'âge suivant
3. Vérifier que le bon joueur commence

## Commandes de Test

```javascript
// Dans la console navigateur

// Voir l'état actuel
console.log('État du jeu:', G);

// Voir le joueur actif
console.log('Tour de:', G.currentPlayer);

// Voir mon numéro
console.log('Je suis:', MP.playerNumber);

// Forcer une synchronisation
MP.sendGameState();

// Voir si connecté
console.log('Connecté:', MP.isConnected);
```

## Améliorations Futures

### Optimisations
- [ ] Compression de l'état (gzip)
- [ ] Envoi de deltas au lieu de l'état complet
- [ ] Mise en cache côté client

### Fonctionnalités
- [ ] Reconnexion automatique
- [ ] Sauvegarde de partie
- [ ] Replay des actions
- [ ] Mode spectateur

### Sécurité
- [ ] Validation côté serveur des actions
- [ ] Anti-triche (vérifier les coûts)
- [ ] Rate limiting
