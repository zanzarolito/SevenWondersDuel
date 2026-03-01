# ⚡ Déploiement Rapide sur Render.com

## En 5 Minutes

### 1️⃣ Pousser sur GitHub

```bash
git init
git add .
git commit -m "7 Wonders Duel - Ready to deploy"
git remote add origin https://github.com/VOTRE_USERNAME/7-wonders-duel.git
git push -u origin main
```

### 2️⃣ Créer un compte Render

👉 [render.com](https://render.com) → "Get Started for Free" → Connecter avec GitHub

### 3️⃣ Déployer

1. **New +** → **Web Service**
2. Sélectionner votre repo `7-wonders-duel`
3. Configurer:
   - **Name:** `7-wonders-duel`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ⭐
4. **Create Web Service**

### 4️⃣ Attendre 2-3 minutes ⏱️

Render va:
- ✅ Cloner le repo
- ✅ Installer les dépendances
- ✅ Démarrer le serveur

### 5️⃣ C'est en ligne! 🎉

URL: `https://7-wonders-duel.onrender.com`

## ⚠️ Important

**Le service s'endort après 15 min d'inactivité** (plan gratuit)

**Solution:** Configurer un ping automatique

### Option A: UptimeRobot (Recommandé)

1. 👉 [uptimerobot.com](https://uptimerobot.com) → Créer un compte
2. **Add New Monitor**
   - Type: HTTP(s)
   - URL: `https://7-wonders-duel.onrender.com`
   - Interval: 5 minutes
3. ✅ Votre app reste active!

### Option B: Cron-job.org

1. 👉 [cron-job.org](https://cron-job.org)
2. Créer un cronjob qui ping votre URL toutes les 10 minutes

## 🔄 Mises à Jour

```bash
# Faire des modifications
git add .
git commit -m "Amélioration"
git push origin main

# Render redéploie automatiquement! ✨
```

## 📊 Monitoring

Dashboard Render → Votre service → **Logs**

Voir les logs en temps réel, erreurs, etc.

## 🆘 Problèmes?

### "Application failed to respond"
→ Vérifier les logs dans Render

### "Build failed"
→ Tester localement: `npm install && npm start`

### WebSocket ne marche pas
→ Attendre 30 secondes (premier chargement après veille)

## 📚 Guide Complet

Voir [DEPLOY_RENDER.md](DEPLOY_RENDER.md) pour tous les détails.

## ✅ Checklist

- [ ] Code sur GitHub
- [ ] Compte Render créé
- [ ] Service déployé
- [ ] URL accessible
- [ ] Test: Créer une partie
- [ ] Test: Jouer à 2
- [ ] (Optionnel) Ping configuré

## 🎮 Partager

Envoyez l'URL à vos amis:
```
https://7-wonders-duel.onrender.com
```

Ils peuvent créer/rejoindre des parties immédiatement!

---

**Temps total:** ~5 minutes ⚡
**Coût:** Gratuit 💰
**Difficulté:** Facile 😊
