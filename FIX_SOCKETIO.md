# Fix Socket.IO 404 sur Render.com

## Problème
Erreurs 404 : `GET https://sevenwondersduel.onrender.com/socket.io/... 404 (Not Found)`

## Solution Appliquée

### 1. Configuration serveur (server.js)
Ajout d'options Socket.IO pour HTTPS/proxy :
```javascript
const io = socketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});
```

### 2. Configuration client (index.html et multiplayer.js)
Ajout de reconnexion automatique :
```javascript
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});
```

## Déploiement
Les changements ont été poussés sur GitHub. Render va automatiquement redéployer (2-3 minutes).

## Vérification
1. Ouvrez `https://sevenwondersduel.onrender.com`
2. Console (F12) : pas d'erreurs 404
3. Testez en créant une partie
