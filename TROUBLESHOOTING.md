# 🔧 Résolution de Problèmes

## Erreur: "Cannot destructure property 'gameState' of 'undefined'"

### Diagnostic
Cette erreur indique qu'un événement Socket.IO essaie de destructurer un objet qui n'existe pas.

### Solutions Appliquées

1. **Vérification côté serveur** (server.js)
   - Ajout de try/catch autour de `initializeGameState()`
   - Logs détaillés pour tracer le problème
   - Vérification que `gameState` n'est pas undefined avant envoi

2. **Vérification côté client** (index.html)
   - Pas de destructuration directe de `{ gameState }`
   - Vérification que `data` et `data.gameState` existent
   - Gestion d'erreur avec try/catch

3. **Fichier multiplayer.js réécrit**
   - Suppression des apostrophes problématiques
   - Vérifications `typeof` avant chaque accès
   - Gestion robuste des cas où les fonctions n'existent pas

### Comment Vérifier

```bash
# 1. Arrêter le serveur (Ctrl+C)

# 2. Redémarrer
npm start

# 3. Ouvrir la console navigateur (F12)

# 4. Créer une partie et regarder les logs
```

### Logs Attendus

**Console Serveur:**
```
Serveur démarré sur le port 3000
Nouveau joueur connecté: <socket-id>
Room <code> créée par <nom>
<nom> a rejoint la room <code>
Tentative de démarrage de la partie: <code>
État du jeu initialisé, envoi aux joueurs...
Partie démarrée dans la room <code>
```

**Console Navigateur (Lobby):**
```
Connecté au serveur
Événement gameStarted reçu: { gameState: {...} }
État initial stocké dans sessionStorage
Redirection vers game.html...
```

**Console Navigateur (Game):**
```
Mode solo (si pas de room)
OU
Connecte au serveur, socket ID: <id>
```

## Autres Erreurs Courantes

### 1. "io is not defined"

**Cause:** Socket.IO client non chargé

**Solution:**
```html
<!-- Vérifier que ce script est présent dans game.html -->
<script src="/socket.io/socket.io.js"></script>
```

### 2. "G is not defined"

**Cause:** Variable globale G pas encore initialisée

**Solution:** Le code vérifie maintenant `typeof G !== 'undefined'` avant utilisation

### 3. "notify is not defined"

**Cause:** Fonction notify appelée avant sa définition

**Solution:** Le code vérifie maintenant `typeof notify !== 'undefined'`

### 4. Serveur ne démarre pas

**Erreur:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Trouver le processus qui utilise le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# OU utiliser un autre port
PORT=8080 npm start
```

### 5. "Cannot find module 'socket.io'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. Page blanche

**Diagnostic:**
1. Ouvrir la console (F12)
2. Regarder l'onglet "Console" pour les erreurs
3. Regarder l'onglet "Network" pour les fichiers non chargés

**Solutions:**
- Vérifier que le serveur est démarré
- Vérifier l'URL (http://localhost:3000)
- Rafraîchir avec Ctrl+Shift+R

### 7. Les joueurs ne se synchronisent pas

**Diagnostic:**
```javascript
// Dans la console navigateur
console.log('Room ID:', MP.roomId);
console.log('Player Number:', MP.playerNumber);
console.log('Connected:', MP.isConnected);
```

**Solutions:**
- Vérifier que les 2 joueurs ont le même roomId
- Vérifier que Socket.IO est connecté
- Rafraîchir les deux pages

## Commandes de Débogage

### Voir les logs en temps réel
```bash
# Le serveur affiche automatiquement les logs
npm start
```

### Ajouter des logs personnalisés

**Serveur (server.js):**
```javascript
console.log('DEBUG:', variable);
```

**Client (game.html ou multiplayer.js):**
```javascript
console.log('DEBUG:', variable);
```

### Nettoyer le cache

**Chrome/Edge:**
```
Ctrl+Shift+Delete → Cocher "Cached images and files" → Clear data
```

**Firefox:**
```
Ctrl+Shift+Delete → Cocher "Cache" → Clear Now
```

### Tester en mode incognito

**Chrome:**
```bash
# Mac
open -na "Google Chrome" --args --incognito http://localhost:3000

# Windows
start chrome --incognito http://localhost:3000

# Linux
google-chrome --incognito http://localhost:3000
```

**Firefox:**
```bash
# Mac
open -na "Firefox" --args -private-window http://localhost:3000

# Windows
start firefox -private-window http://localhost:3000

# Linux
firefox -private-window http://localhost:3000
```

## Vérification de Santé

### Checklist Serveur
- [ ] `npm start` démarre sans erreur
- [ ] Console affiche "Serveur démarré sur le port 3000"
- [ ] Pas d'erreur dans les logs
- [ ] `npm test` passe tous les tests

### Checklist Client
- [ ] Page d'accueil charge (http://localhost:3000)
- [ ] Peut créer une room
- [ ] Reçoit un code de 6 caractères
- [ ] Peut rejoindre avec le code
- [ ] Console ne montre pas d'erreur

### Checklist Multijoueur
- [ ] Les 2 joueurs voient le même lobby
- [ ] Le bouton "Démarrer" apparaît pour J1
- [ ] Les 2 joueurs sont redirigés vers game.html
- [ ] Le draft commence avec les mêmes merveilles
- [ ] Les choix se synchronisent

## Réinitialisation Complète

Si rien ne fonctionne:

```bash
# 1. Arrêter le serveur
Ctrl+C

# 2. Supprimer node_modules
rm -rf node_modules package-lock.json

# 3. Réinstaller
npm install

# 4. Redémarrer
npm start

# 5. Tester
npm test

# 6. Nettoyer le cache navigateur
Ctrl+Shift+Delete

# 7. Réessayer
```

## Obtenir de l'Aide

Si le problème persiste:

1. **Copier les logs serveur** (tout le terminal)
2. **Copier les logs navigateur** (console F12)
3. **Noter les étapes pour reproduire**
4. **Vérifier la version de Node.js:**
   ```bash
   node --version
   # Doit être >= 14.x
   ```

## Versions Testées

- Node.js: 14.x, 16.x, 18.x, 20.x
- npm: 6.x, 7.x, 8.x, 9.x
- Navigateurs: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
