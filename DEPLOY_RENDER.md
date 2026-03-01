# 🚀 Déploiement sur Render.com (Gratuit)

## Prérequis

- Un compte GitHub (gratuit)
- Un compte Render.com (gratuit)
- Votre code poussé sur GitHub

## Étape 1: Préparer le Projet

### 1.1 Créer un fichier render.yaml (optionnel mais recommandé)

Ce fichier configure automatiquement le déploiement:

```yaml
services:
  - type: web
    name: 7-wonders-duel
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 18.17.0
```

### 1.2 Vérifier package.json

Assurez-vous que votre `package.json` contient:

```json
{
  "engines": {
    "node": ">=14.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### 1.3 Créer un .gitignore (si pas déjà fait)

```
node_modules/
npm-debug.log
.DS_Store
.env
*.log
```

## Étape 2: Pousser sur GitHub

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit - 7 Wonders Duel"

# Créer un repo sur GitHub puis:
git remote add origin https://github.com/VOTRE_USERNAME/7-wonders-duel.git
git branch -M main
git push -u origin main
```

## Étape 3: Déployer sur Render

### 3.1 Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur "Get Started for Free"
3. Connectez-vous avec GitHub

### 3.2 Créer un nouveau Web Service

1. Dans le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez le repo `7-wonders-duel`

### 3.3 Configurer le Service

**Paramètres à remplir:**

| Champ | Valeur |
|-------|--------|
| **Name** | `7-wonders-duel` (ou votre choix) |
| **Region** | Choisir le plus proche (ex: Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | (laisser vide) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** ⭐ |

### 3.4 Variables d'Environnement (optionnel)

Cliquez sur "Advanced" puis "Add Environment Variable":

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18.17.0` |
| `PORT` | (Render le définit automatiquement) |

### 3.5 Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement:
   - Cloner votre repo
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)

⏱️ Le déploiement prend environ 2-3 minutes.

## Étape 4: Accéder à votre Application

Une fois déployé, Render vous donne une URL:

```
https://7-wonders-duel.onrender.com
```

🎉 Votre jeu est maintenant en ligne!

## Limitations du Plan Gratuit

### ⚠️ Important à Savoir

1. **Mise en veille automatique**
   - Après 15 minutes d'inactivité, le service s'endort
   - Premier accès après veille: ~30 secondes de chargement
   - Solution: Utiliser un service de "ping" (voir ci-dessous)

2. **750 heures/mois**
   - Suffisant pour un usage personnel/test
   - Réinitialise chaque mois

3. **Pas de domaine personnalisé**
   - URL: `*.onrender.com`
   - Domaine custom = plan payant

## Optimisations

### Garder le Service Actif (Anti-Sleep)

#### Option 1: UptimeRobot (Recommandé)

1. Créer un compte sur [uptimerobot.com](https://uptimerobot.com) (gratuit)
2. Ajouter un nouveau monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://7-wonders-duel.onrender.com`
   - **Monitoring Interval:** 5 minutes
3. Le service pingera votre app toutes les 5 minutes

#### Option 2: Cron-job.org

1. Aller sur [cron-job.org](https://cron-job.org)
2. Créer un cronjob:
   - **URL:** `https://7-wonders-duel.onrender.com`
   - **Interval:** Toutes les 10 minutes

#### Option 3: Script Auto-Ping (dans l'app)

Ajouter dans `server.js`:

```javascript
// Auto-ping pour éviter le sleep (seulement en production)
if (process.env.RENDER) {
  const https = require('https');
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  
  setInterval(() => {
    https.get(RENDER_URL, (res) => {
      console.log('Auto-ping:', res.statusCode);
    }).on('error', (err) => {
      console.error('Auto-ping error:', err);
    });
  }, 14 * 60 * 1000); // Toutes les 14 minutes
}
```

## Mises à Jour

### Déploiement Automatique

Render redéploie automatiquement à chaque push sur `main`:

```bash
# Faire des modifications
git add .
git commit -m "Amélioration du jeu"
git push origin main

# Render détecte le push et redéploie automatiquement
```

### Déploiement Manuel

Dans le dashboard Render:
1. Aller dans votre service
2. Cliquer sur "Manual Deploy"
3. Sélectionner "Deploy latest commit"

## Monitoring

### Logs en Temps Réel

Dans le dashboard Render:
1. Aller dans votre service
2. Cliquer sur l'onglet **"Logs"**
3. Voir les logs en temps réel

### Métriques

- **CPU Usage**
- **Memory Usage**
- **Request Count**

Disponibles dans l'onglet "Metrics".

## Dépannage

### Problème: "Application failed to respond"

**Cause:** Le serveur ne démarre pas correctement

**Solution:**
1. Vérifier les logs dans Render
2. Vérifier que `PORT` est bien utilisé:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

### Problème: "Build failed"

**Cause:** Erreur lors de `npm install`

**Solution:**
1. Vérifier `package.json`
2. Tester localement: `npm install`
3. Vérifier les logs de build

### Problème: WebSocket ne fonctionne pas

**Cause:** Socket.IO mal configuré

**Solution:** Vérifier que Socket.IO utilise le bon transport:
```javascript
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

### Problème: "Service unavailable"

**Cause:** Service en veille

**Solution:** 
- Attendre 30 secondes (premier chargement)
- Configurer un service de ping (voir Optimisations)

## Sécurité

### Variables Sensibles

Si vous avez des secrets (API keys, etc.):

1. Ne JAMAIS les commiter dans Git
2. Les ajouter dans Render:
   - Dashboard → Service → Environment
   - Add Environment Variable

### CORS

Si vous avez des problèmes CORS, ajouter dans `server.js`:

```javascript
const cors = require('cors');
app.use(cors());
```

## Coûts

### Plan Gratuit (Free)
- ✅ 750 heures/mois
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ SSL automatique
- ✅ Déploiement automatique
- ❌ Mise en veille après 15 min
- ❌ Pas de domaine custom

### Plan Payant (Starter - $7/mois)
- ✅ Pas de mise en veille
- ✅ Plus de ressources
- ✅ Domaine custom
- ✅ Support prioritaire

## Alternatives Gratuites

Si Render ne convient pas:

### 1. Railway.app
- 500 heures/mois gratuit
- Pas de mise en veille
- Configuration similaire

### 2. Fly.io
- 3 machines gratuites
- Pas de mise en veille
- Plus technique

### 3. Heroku
- Plan gratuit supprimé (payant uniquement)
- Pas recommandé

## Checklist de Déploiement

- [ ] Code poussé sur GitHub
- [ ] `package.json` configuré correctement
- [ ] `.gitignore` créé
- [ ] Compte Render créé
- [ ] Web Service créé sur Render
- [ ] Configuration correcte (Build + Start commands)
- [ ] Déploiement réussi
- [ ] Application accessible via l'URL Render
- [ ] Test: Créer une partie
- [ ] Test: Jouer à 2 joueurs
- [ ] (Optionnel) Service de ping configuré

## Support

### Documentation Render
- [Render Docs](https://render.com/docs)
- [Node.js sur Render](https://render.com/docs/deploy-node-express-app)

### Communauté
- [Render Community](https://community.render.com)
- [Discord Render](https://discord.gg/render)

## Commandes Utiles

```bash
# Voir les logs en local avant de déployer
npm start

# Tester le build
npm install

# Vérifier la version de Node
node --version

# Pousser sur GitHub
git push origin main

# Forcer un redéploiement
# (via le dashboard Render)
```

## Exemple Complet

Voici un exemple de workflow complet:

```bash
# 1. Préparer le projet
git init
git add .
git commit -m "Initial commit"

# 2. Créer le repo GitHub
# (via l'interface GitHub)

# 3. Pousser
git remote add origin https://github.com/username/7-wonders-duel.git
git push -u origin main

# 4. Aller sur render.com
# - New + → Web Service
# - Connecter le repo
# - Configurer (voir ci-dessus)
# - Deploy

# 5. Attendre 2-3 minutes

# 6. Accéder à l'URL fournie
# https://7-wonders-duel.onrender.com

# 🎉 C'est en ligne!
```

## Prochaines Étapes

Une fois déployé:
1. Partager l'URL avec vos amis
2. Configurer un service de ping
3. Monitorer les logs
4. Améliorer le jeu
5. Pousser les mises à jour sur GitHub (redéploiement auto)

Bon déploiement! 🚀
