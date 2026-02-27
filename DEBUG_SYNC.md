# 🐛 Débogage de la Synchronisation

## Problème: "Le joueur 2 ne peut pas choisir de carte"

### Symptômes
- J1 joue sa carte
- J2 voit la carte disparaître
- Mais J2 ne peut pas cliquer sur les cartes
- Les boutons restent désactivés

### Cause Probable
L'état `G.currentPlayer` n'est pas correctement synchronisé entre les joueurs.

### Solution Appliquée

#### 1. Ordre de Synchronisation
**AVANT (incorrect):**
```javascript
// Synchroniser AVANT nextTurn
MP.sendGameState();
nextTurn(); // Change currentPlayer
```

**APRÈS (correct):**
```javascript
// Changer le tour AVANT de synchroniser
nextTurn(); // Change currentPlayer
MP.sendGameState(); // Envoie le nouvel état
```

#### 2. Synchronisation Profonde
**AVANT (incorrect):**
```javascript
Object.assign(G, gameState); // Copie superficielle
```

**APRÈS (correct):**
```javascript
// Remplacer complètement l'objet
for (const key in G) delete G[key];
for (const key in gameState) G[key] = gameState[key];
```

## Comment Vérifier

### Console Navigateur (F12)

**Joueur 1:**
```javascript
// Après avoir joué
console.log('J1 - currentPlayer:', G.currentPlayer); // Devrait être 2
console.log('J1 - Mon numéro:', MP.playerNumber);    // Devrait être 1
```

**Joueur 2:**
```javascript
// Après que J1 ait joué
console.log('J2 - currentPlayer:', G.currentPlayer); // Devrait être 2
console.log('J2 - Mon numéro:', MP.playerNumber);    // Devrait être 2
console.log('J2 - C\'est mon tour?', G.currentPlayer === MP.playerNumber); // true
```

### Logs Automatiques

Avec les corrections, vous devriez voir dans la console:

**Joueur 1 (qui joue):**
```
performBuild: J1 construit age1_chantier
nextTurn: passage de J1 à J2
Envoi de l'action cardBuilt et de l'état
Tour de l'adversaire...
```

**Joueur 2 (qui reçoit):**
```
Action de l'adversaire recue: cardBuilt { cardId: 'age1_chantier', playerNumber: 1 }
Synchronisation de l'etat: { avant: {...}, apres: {...} }
État synchronisé, currentPlayer: 2
A votre tour!
```

## Tests Manuels

### Test 1: Vérification Basique
```javascript
// Dans la console de J2 après que J1 ait joué
console.log('Test:', {
  currentPlayer: G.currentPlayer,
  myNumber: MP.playerNumber,
  isMyTurn: G.currentPlayer === MP.playerNumber,
  buttonsDisabled: document.getElementById('btn-build').disabled
});
```

**Résultat attendu:**
```javascript
{
  currentPlayer: 2,
  myNumber: 2,
  isMyTurn: true,
  buttonsDisabled: false  // Les boutons doivent être activés
}
```

### Test 2: Vérification de l'État
```javascript
// Comparer les états des deux joueurs
// J1:
console.log('J1 state:', {
  currentPlayer: G.currentPlayer,
  cardsInStructure: G.structureLayout.flatMap(r => r.slots).filter(s => s.cardId && !s.removed).length
});

// J2:
console.log('J2 state:', {
  currentPlayer: G.currentPlayer,
  cardsInStructure: G.structureLayout.flatMap(r => r.slots).filter(s => s.cardId && !s.removed).length
});
```

**Les deux doivent être identiques!**

### Test 3: Forcer une Synchronisation
```javascript
// Dans la console de J2
MP.socket.emit('gameStateUpdate', {
  roomId: MP.roomId,
  gameState: G
});
```

## Problèmes Courants

### 1. "currentPlayer ne change pas"

**Diagnostic:**
```javascript
console.log('Avant nextTurn:', G.currentPlayer);
nextTurn();
console.log('Après nextTurn:', G.currentPlayer);
```

**Solution:** Vérifier que `nextTurn()` est bien appelé

### 2. "L'état est synchronisé mais l'interface ne se met pas à jour"

**Diagnostic:**
```javascript
console.log('renderAll existe?', typeof renderAll);
console.log('G existe?', typeof G);
```

**Solution:** Vérifier que `renderAll()` est appelé après `syncGameState()`

### 3. "Les boutons restent désactivés"

**Diagnostic:**
```javascript
console.log('renderActionPanel - isMyTurn:', 
  typeof MP === 'undefined' || !MP.playerNumber || G.currentPlayer === MP.playerNumber
);
```

**Solution:** Vérifier la logique dans `renderActionPanel()`

### 4. "Désynchronisation progressive"

**Symptôme:** Après plusieurs tours, les états divergent

**Diagnostic:**
```javascript
// Comparer les hash des états
function hashState(state) {
  return JSON.stringify({
    currentPlayer: state.currentPlayer,
    age: state.age,
    p1Cards: state.players[1].cards.length,
    p2Cards: state.players[2].cards.length,
    structureCards: state.structureLayout.flatMap(r => r.slots).filter(s => s.cardId && !s.removed).length
  });
}

console.log('Hash J1:', hashState(G));
console.log('Hash J2:', hashState(G));
```

**Solution:** Rafraîchir les deux pages (F5)

## Commandes de Débogage Avancées

### Activer les Logs Détaillés
```javascript
// Dans la console
window.DEBUG_SYNC = true;

// Modifier multiplayer.js pour utiliser cette variable
if (window.DEBUG_SYNC) {
  console.log('SYNC DEBUG:', ...);
}
```

### Capturer Tous les Événements Socket.IO
```javascript
// Dans la console
const originalEmit = MP.socket.emit;
MP.socket.emit = function(...args) {
  console.log('EMIT:', args[0], args[1]);
  return originalEmit.apply(this, args);
};

const originalOn = MP.socket.on;
MP.socket.on = function(event, handler) {
  return originalOn.call(this, event, function(...args) {
    console.log('RECEIVE:', event, args[0]);
    return handler.apply(this, args);
  });
};
```

### Comparer les États en Temps Réel
```javascript
// Exécuter dans les deux consoles
setInterval(() => {
  console.log('État actuel:', {
    player: MP.playerNumber,
    currentPlayer: G.currentPlayer,
    isMyTurn: G.currentPlayer === MP.playerNumber,
    cardsLeft: G.structureLayout.flatMap(r => r.slots).filter(s => s.cardId && !s.removed).length
  });
}, 2000);
```

## Checklist de Résolution

- [ ] Les logs "nextTurn: passage de J1 à J2" apparaissent
- [ ] Les logs "Synchronisation de l'etat" apparaissent chez J2
- [ ] `G.currentPlayer` est identique chez J1 et J2
- [ ] Les boutons sont activés pour le joueur actif
- [ ] Les boutons sont désactivés pour l'adversaire
- [ ] Les notifications "A votre tour!" apparaissent
- [ ] Les cartes sont cliquables pour le joueur actif

## Si Rien ne Fonctionne

1. **Rafraîchir les deux pages** (Ctrl+Shift+R)
2. **Redémarrer le serveur** (Ctrl+C puis `npm start`)
3. **Vider le cache** (Ctrl+Shift+Delete)
4. **Créer une nouvelle partie**
5. **Vérifier les versions:**
   ```bash
   node --version  # >= 14.x
   npm --version   # >= 6.x
   ```

## Logs de Succès

Quand tout fonctionne, vous devriez voir:

**J1 joue:**
```
performBuild: J1 construit age1_chantier
nextTurn: passage de J1 à J2
Envoi de l'action cardBuilt et de l'état
Tour de l'adversaire...
```

**J2 reçoit:**
```
Action de l'adversaire recue: cardBuilt
Synchronisation de l'etat: { avant: { currentPlayer: 1 }, apres: { currentPlayer: 2 } }
État synchronisé, currentPlayer: 2
A votre tour!
```

**J2 peut maintenant jouer! ✅**
