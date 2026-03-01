# 🚀 Guide de Démarrage Rapide

## Installation Locale (2 minutes)

```bash
# 1. Cloner ou télécharger le projet
cd 7-wonders-duel

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start
```

✅ Ouvrez `http://localhost:3000` dans votre navigateur

## Déploiement sur Render.com (5 minutes)

### Prérequis
- Compte GitHub (gratuit)
- Compte Render.com (gratuit)

### Étapes

#### 1. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/7-wonders-duel.git
git push -u origin main
```

#### 2. Déployer sur Render

1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **New +** → **Web Service**
4. Sélectionnez votre repository `7-wonders-duel`
5. Configurez :
   - **Name:** `7-wonders-duel` (ou votre choix)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
6. Cliquez sur **Create Web Service**

⏳ Attendez 2-3 minutes que le déploiement se termine

✅ Votre jeu est en ligne ! URL : `https://votre-app.onrender.com`

### ⚠️ Problème Socket.IO 404 ?

Si vous voyez des erreurs 404 dans la console :
```
GET https://votre-app.onrender.com/socket.io/... 404 (Not Found)
```

**Solution :** Les fichiers ont déjà été mis à jour avec la bonne configuration Socket.IO. Si le problème persiste :

1. Vérifiez les logs Render pour voir si le serveur démarre correctement
2. Consultez [RENDER_SOCKETIO_FIX.md](RENDER_SOCKETIO_FIX.md) pour plus de détails

## Test de l'Application

### En local
1. Ouvrez deux onglets sur `http://localhost:3000`
2. Onglet 1 : Créez une partie
3. Onglet 2 : Rejoignez avec le code
4. Jouez !

### En ligne (Render)
1. Ouvrez `https://votre-app.onrender.com` sur deux appareils
2. Créez et rejoignez une partie
3. Jouez !

## Commandes Utiles

```bash
# Démarrer en mode développement (auto-reload)
npm run dev

# Tester le serveur
npm test

# Voir les logs en production (Render)
# → Allez dans le dashboard Render → Logs
```

## Prochaines Étapes

- Lisez [README.md](README.md) pour comprendre l'architecture
- Consultez [DEPLOY_RENDER.md](DEPLOY_RENDER.md) pour le guide complet
- Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md) en cas de problème

## Limitations du Plan Gratuit Render

- ⏸️ Mise en veille après 15 min d'inactivité
- 🔄 Redémarrage automatique à la première requête (30-60 secondes)
- 💾 750 heures/mois (suffisant pour usage personnel)

**Astuce :** Utilisez [UptimeRobot](https://uptimerobot.com) pour garder votre app active (ping toutes les 5 minutes).

## Support

Des questions ? Consultez la documentation :
- [README.md](README.md) - Vue d'ensemble
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Dépannage
- [DEBUG.md](DEBUG.md) - Débogage
