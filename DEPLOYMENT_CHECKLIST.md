# ✅ Checklist de Déploiement

## Avant de Déployer

### Vérifications Locales

- [ ] Le jeu fonctionne en local (`npm start`)
- [ ] Les tests passent (`npm test`)
- [ ] Pas d'erreurs dans la console
- [ ] Le multijoueur fonctionne (2 navigateurs)
- [ ] Le draft des merveilles fonctionne
- [ ] Les tours alternent correctement

### Fichiers Requis

- [ ] `package.json` avec `engines` et `scripts`
- [ ] `server.js` utilise `process.env.PORT`
- [ ] `.gitignore` créé
- [ ] `render.yaml` créé (optionnel)
- [ ] `README.md` à jour

### Git

- [ ] Repository initialisé (`git init`)
- [ ] Tous les fichiers ajoutés (`git add .`)
- [ ] Commit créé (`git commit -m "..."`)
- [ ] Repository GitHub créé
- [ ] Code poussé (`git push origin main`)

## Déploiement sur Render

### Étape 1: Compte Render

- [ ] Compte créé sur [render.com](https://render.com)
- [ ] GitHub connecté à Render

### Étape 2: Configuration

- [ ] New + → Web Service
- [ ] Repository sélectionné
- [ ] **Name:** `7-wonders-duel` (ou votre choix)
- [ ] **Region:** Choisie (ex: Frankfurt)
- [ ] **Branch:** `main`
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Plan:** Free ⭐

### Étape 3: Déploiement

- [ ] "Create Web Service" cliqué
- [ ] Build en cours (2-3 minutes)
- [ ] Build réussi ✅
- [ ] Service démarré ✅

### Étape 4: Vérification

- [ ] URL accessible (`https://votre-app.onrender.com`)
- [ ] Page d'accueil charge
- [ ] Peut créer une partie
- [ ] Code de room généré
- [ ] Peut rejoindre avec le code (2e navigateur)
- [ ] Draft des merveilles fonctionne
- [ ] Peut jouer des cartes
- [ ] Tours alternent correctement
- [ ] Synchronisation fonctionne

## Après le Déploiement

### Optimisations

- [ ] Service de ping configuré (UptimeRobot ou Cron-job)
- [ ] Monitoring activé (logs Render)
- [ ] URL partagée avec des amis

### Documentation

- [ ] README mis à jour avec l'URL de production
- [ ] Instructions de jeu claires
- [ ] Crédits ajoutés

### Tests en Production

- [ ] Test avec 2 joueurs réels
- [ ] Test sur mobile
- [ ] Test sur différents navigateurs
- [ ] Test de reconnexion après déconnexion
- [ ] Test de partie complète (3 âges)

## Maintenance

### Mises à Jour

- [ ] Process de mise à jour documenté
- [ ] Branche `main` protégée (optionnel)
- [ ] Tests avant chaque push

### Monitoring

- [ ] Logs vérifiés régulièrement
- [ ] Métriques surveillées (CPU, RAM)
- [ ] Erreurs corrigées rapidement

## Problèmes Courants

### ❌ Build Failed

**Vérifier:**
- [ ] `package.json` valide
- [ ] Toutes les dépendances listées
- [ ] Version Node.js compatible

**Solution:**
```bash
# Tester localement
npm install
npm start
```

### ❌ Application Failed to Respond

**Vérifier:**
- [ ] `PORT` utilisé correctement
- [ ] Serveur démarre sans erreur
- [ ] Logs Render pour détails

**Solution:**
```javascript
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur sur port ${PORT}`);
});
```

### ❌ WebSocket Connection Failed

**Vérifier:**
- [ ] Socket.IO configuré correctement
- [ ] CORS autorisé si nécessaire
- [ ] Service pas en veille

**Solution:**
- Attendre 30 secondes (premier chargement)
- Configurer un service de ping

### ❌ Service Unavailable

**Cause:** Service en veille (plan gratuit)

**Solution:**
- [ ] Configurer UptimeRobot
- [ ] Ou Cron-job.org
- [ ] Ou upgrade vers plan payant

## Ressources

### Documentation

- [Guide Rapide](DEPLOY_QUICK.md)
- [Guide Complet](DEPLOY_RENDER.md)
- [Débogage](TROUBLESHOOTING.md)
- [Synchronisation](SYNC.md)

### Support

- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Socket.IO Docs](https://socket.io/docs/)

## Commandes Utiles

```bash
# Voir les logs localement
npm start

# Tester le build
npm install

# Pousser une mise à jour
git add .
git commit -m "Update"
git push origin main

# Vérifier la version Node
node --version

# Nettoyer node_modules
rm -rf node_modules
npm install
```

## Métriques de Succès

### Performance

- [ ] Temps de chargement < 3 secondes
- [ ] Latence < 500ms entre actions
- [ ] Pas de lag visible

### Stabilité

- [ ] Pas de crash pendant une partie
- [ ] Reconnexion fonctionne
- [ ] État synchronisé correctement

### Expérience Utilisateur

- [ ] Interface claire et intuitive
- [ ] Notifications utiles
- [ ] Pas de bugs bloquants

## Notes

### Plan Gratuit Render

**Avantages:**
- ✅ Gratuit
- ✅ SSL automatique
- ✅ Déploiement auto
- ✅ 750h/mois

**Limitations:**
- ⚠️ Mise en veille après 15 min
- ⚠️ 512 MB RAM
- ⚠️ 0.1 CPU
- ⚠️ Pas de domaine custom

### Quand Upgrader?

Considérer un plan payant si:
- Beaucoup d'utilisateurs simultanés
- Besoin de 100% uptime
- Domaine personnalisé souhaité
- Plus de ressources nécessaires

## Félicitations! 🎉

Si toutes les cases sont cochées, votre jeu est:
- ✅ Déployé
- ✅ Accessible en ligne
- ✅ Prêt à être partagé
- ✅ Optimisé

**Partagez l'URL et amusez-vous bien!** 🎲
