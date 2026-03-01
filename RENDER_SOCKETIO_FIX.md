# Fix Socket.IO 404 sur Render.com

## Problème

Lors du déploiement sur Render.com, Socket.IO retourne des erreurs 404 :
```
GET https://votreapp.onrender.com/socket.io/... 404 (Not Found)
```

## Cause

Render.com utilise HTTPS et un reverse proxy. Socket.IO nécessite une configuration spéciale pour fonctionner correctement dans cet environnement.

## Solution appliquée

### 1. Configuration serveur (server.js)

Ajout d'options Socket.IO pour la compatibilité HTTPS/proxy :

```javascript
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});
```

### 2. Configuration client (index.html et multiplayer.js)

Ajout d'options de connexion robustes :

```javascript
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});
```

### 3. Route de santé

Ajout d'une route `/health` pour les health checks de Render :

```javascript
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
```

## Vérification

Après déploiement, vérifiez dans la console du navigateur :
- ✅ Pas d'erreurs 404 sur `/socket.io/...`
- ✅ Message "Connecté au serveur, socket ID: ..."
- ✅ Les événements Socket.IO fonctionnent

## Redéploiement

1. Commit les changements :
   ```bash
   git add .
   git commit -m "Fix Socket.IO configuration for Render.com"
   git push
   ```

2. Render redéploiera automatiquement

3. Attendez 2-3 minutes que le déploiement se termine

4. Testez l'application

## Alternatives si le problème persiste

Si les erreurs 404 persistent :

1. Vérifiez que `socket.io` est bien dans `dependencies` (pas `devDependencies`)
2. Vérifiez les logs Render pour voir si le serveur démarre correctement
3. Essayez de forcer le transport polling uniquement :
   ```javascript
   const socket = io({ transports: ['polling'] });
   ```
