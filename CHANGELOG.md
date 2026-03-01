# Changelog - 7 Wonders Duel Online

## [1.1.0] - 2026-03-01

### 🔧 Fixed
- **Socket.IO 404 sur Render.com** : Configuration Socket.IO améliorée pour la compatibilité HTTPS/proxy
  - Ajout des options CORS et transports dans `server.js`
  - Configuration client robuste avec reconnexion automatique
  - Ajout d'une route `/health` pour les health checks

### 📝 Documentation
- Nouveau guide : `RENDER_SOCKETIO_FIX.md` - Solution détaillée pour les erreurs 404
- Nouveau guide : `QUICKSTART.md` - Guide de démarrage rapide (2-5 minutes)
- Mise à jour du `README.md` avec lien vers le fix Socket.IO

### 🧪 Tests
- Nouveau script : `test-socketio.js` - Vérification de la configuration Socket.IO
- Commande : `npm run test:socketio`

### 🚀 Déploiement
- Configuration optimisée pour Render.com
- Support HTTPS natif
- Reconnexion automatique en cas de déconnexion

---

## [1.0.0] - 2026-02-28

### ✨ Features
- **Système multijoueur** : Rooms avec codes à 6 caractères
- **Lobby** : Création et rejoindre des parties
- **Synchronisation temps réel** : Socket.IO pour tous les événements
- **Draft des merveilles** : Séquence J1→J2→J1 puis inversé
- **Interface 3 colonnes** : Layout inspiré du jeu original
- **Toutes les règles** : Âges I-II-III, Merveilles, Progrès, Guildes

### 🎨 Interface
- Piste de conflit militaire verticale
- Jetons Progrès en strip horizontal
- Structure de cartes pyramidale
- Zones joueurs compactes avec merveilles mini
- Design responsive mobile

### 🔄 Synchronisation
- Actions de jeu synchronisées (construction, défausse, merveilles)
- Gestion des tours avec vérification côté client
- Notifications de changement de tour
- Gestion des déconnexions

### 📚 Documentation
- `README.md` - Vue d'ensemble complète
- `DEPLOY_RENDER.md` - Guide de déploiement détaillé
- `DEPLOY_QUICK.md` - Guide rapide
- `DEPLOYMENT_CHECKLIST.md` - Checklist
- `TROUBLESHOOTING.md` - Dépannage
- `DEBUG.md` - Débogage
- `DEBUG_SYNC.md` - Synchronisation
- `SYNC.md` - Documentation sync
- `DRAFT_SYSTEM.md` - Système de draft
- `TEST.md` - Guide de test

### 🛠️ Technique
- Node.js + Express
- Socket.IO pour WebSocket
- HTML5/CSS3/JavaScript vanilla
- Déploiement Render.com (gratuit)

---

## Format

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

### Types de changements
- `Added` - Nouvelles fonctionnalités
- `Changed` - Modifications de fonctionnalités existantes
- `Deprecated` - Fonctionnalités bientôt supprimées
- `Removed` - Fonctionnalités supprimées
- `Fixed` - Corrections de bugs
- `Security` - Corrections de sécurité
