# 7 Wonders Duel - Version Multijoueur en Ligne

Jeu de société 7 Wonders Duel adapté pour jouer en ligne à 2 joueurs avec système de rooms.

## 🎮 Fonctionnalités

- **Système de rooms** : Créez ou rejoignez une partie avec un code unique
- **Multijoueur temps réel** : Synchronisation instantanée via Socket.IO
- **Interface repensée** : Layout en 3 colonnes inspiré du jeu original
- **Toutes les règles** : Âges I, II, III, Merveilles, Jetons Progrès, Guildes
- **Victoires multiples** : Militaire, Scientifique ou Civile

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Mode développement (avec auto-reload)
npm run dev
```

Le jeu sera accessible sur `http://localhost:3000`

## 🎯 Comment jouer

### 1. Créer une partie
- Entrez votre nom
- Cliquez sur "Créer une partie"
- Partagez le code de la room avec votre adversaire

### 2. Rejoindre une partie
- Entrez votre nom
- Entrez le code de la room
- Cliquez sur "Rejoindre une partie"

### 3. Draft des Merveilles
Le jeu commence par le choix des merveilles (8 au total, 4 par joueur) :

**Groupe 1** : J1 choisit 1 → J2 choisit 2 → J1 choisit 1  
**Groupe 2** : J2 choisit 1 → J1 choisit 2 → J2 choisit 1

L'interface indique clairement quel joueur doit choisir et combien de merveilles.

### 4. Jouer
- Le Joueur 1 commence l'Âge I
- Chaque joueur joue à tour de rôle
- Sélectionnez une carte accessible dans la structure
- Choisissez une action : Construire, Défausser ou Construire une Merveille

## 🏗️ Architecture

```
├── server.js                 # Serveur Express + Socket.IO
├── public/
│   ├── index.html           # Lobby (création/rejoindre room)
│   ├── game.html            # Interface de jeu
│   ├── js/
│   │   └── multiplayer.js   # Gestion multijoueur
│   └── css/
│       └── game-layout.css  # Nouveau layout 3 colonnes
└── package.json
```

## 🎨 Nouvelle Interface

### Layout en 3 colonnes :

**Colonne Gauche** (280px)
- Piste de conflit militaire (verticale)
- Jetons Progrès disponibles

**Colonne Centrale** (flexible)
- Structure de cartes de l'âge en cours
- Panel d'actions (Construire/Défausser/Merveille)

**Colonne Droite** (280px)
- Zone Joueur 2 (adversaire)
  - Merveilles (mini)
  - Cartes construites (compactes)
  - Statistiques
- Zone Joueur 1 (vous)
  - Merveilles (mini)
  - Cartes construites (compactes)
  - Statistiques

## 🔧 Technologies

- **Backend** : Node.js, Express, Socket.IO
- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Temps réel** : WebSocket (Socket.IO)

## 📝 Règles du jeu

Le jeu suit les règles officielles de 7 Wonders Duel :

### Draft des Merveilles
```
GROUPE 1 (4 merveilles)          GROUPE 2 (4 merveilles)
┌─────────────────────┐          ┌─────────────────────┐
│ J1 choisit 1        │          │ J2 choisit 1        │
│ J2 choisit 2        │   ⟺     │ J1 choisit 2        │
│ J1 choisit 1        │          │ J2 choisit 1        │
└─────────────────────┘          └─────────────────────┘
Résultat: J1=2, J2=2             Résultat: J1=2, J2=2
```

### Déroulement
- 3 Âges avec structures de cartes différentes
- Chaînage gratuit entre cartes
- Commerce de ressources avec l'adversaire
- Jetons Progrès scientifiques

### 3 types de victoire
- **Militaire** : Envahir la capitale adverse (pion conflit à ±9)
- **Scientifique** : Réunir 6 symboles scientifiques différents
- **Civile** : Plus de Points de Victoire à la fin de l'Âge III

## 🐛 Débogage

### Problème: Le joueur 2 ne peut pas jouer après le joueur 1

**Solution:** Ouvrez la console (F12) et vérifiez:
```javascript
console.log('currentPlayer:', G.currentPlayer);
console.log('Mon numéro:', MP.playerNumber);
console.log('C\'est mon tour?', G.currentPlayer === MP.playerNumber);
```

Si `currentPlayer` n'est pas correct, rafraîchissez les deux pages (Ctrl+Shift+R).

Voir [DEBUG_SYNC.md](DEBUG_SYNC.md) pour plus de détails.

### Autres Problèmes

- **Erreurs de connexion:** Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Problèmes de draft:** Voir [DRAFT_SYSTEM.md](DRAFT_SYSTEM.md)
- **Synchronisation:** Voir [SYNC.md](SYNC.md)

## 🚀 Déploiement

Pour déployer sur un serveur :

```bash
# Définir le port (optionnel, défaut: 3000)
export PORT=8080

# Démarrer en production
npm start
```

Compatible avec Heroku, Railway, Render, etc.

## 📄 Licence

Ce projet est une adaptation non officielle du jeu 7 Wonders Duel (Repos Production).
À usage éducatif et personnel uniquement.

## 🎲 Améliorations futures

- [ ] Système de comptes utilisateurs
- [ ] Historique des parties
- [ ] Chat intégré
- [ ] Animations des cartes
- [ ] Mode spectateur
- [ ] Replay des parties
- [ ] Classement ELO
