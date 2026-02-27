# 🚀 Démarrage Rapide

## Installation (première fois)

```bash
npm install
```

## Démarrer le serveur

```bash
npm start
```

Vous devriez voir:
```
Serveur démarré sur le port 3000
```

## Tester que tout fonctionne

Dans un autre terminal:
```bash
npm test
```

Vous devriez voir:
```
✅ Serveur accessible
✅ game.html accessible
✅ multiplayer.js accessible
✅ game-layout.css accessible

🎉 Tous les tests sont passés!
```

## Jouer

### Option 1: Mode Solo (test rapide)
Ouvrez directement:
```
http://localhost:3000/game.html
```

### Option 2: Mode Multijoueur (2 joueurs)

**Joueur 1:**
1. Ouvrez `http://localhost:3000`
2. Entrez votre nom
3. Cliquez "Créer une partie"
4. Notez le code (ex: "A3F7K2")

**Joueur 2:**
1. Ouvrez `http://localhost:3000` dans un autre navigateur/onglet incognito
2. Entrez votre nom
3. Entrez le code de la room
4. Cliquez "Rejoindre une partie"

**Démarrage:**
1. Joueur 1 clique "Démarrer la partie"
2. Le draft des merveilles commence!

## Draft des Merveilles

### Groupe 1
```
J1 choisit 1 merveille
J2 choisit 2 merveilles
J1 choisit 1 merveille
```

### Groupe 2
```
J2 choisit 1 merveille
J1 choisit 2 merveilles
J2 choisit 1 merveille
```

Résultat: Chaque joueur a 4 merveilles

## Problèmes?

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -i :3000

# Si occupé, tuer le processus
kill -9 <PID>

# Ou changer le port
PORT=8080 npm start
```

### Erreur "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Page blanche
1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. Rafraîchir (Ctrl+Shift+R)

### Les joueurs ne se synchronisent pas
1. Vérifier que les 2 joueurs sont sur le même serveur
2. Vérifier la console serveur pour les logs
3. Rafraîchir les deux pages

## Commandes Utiles

```bash
# Démarrer avec auto-reload (développement)
npm run dev

# Tester le serveur
npm test

# Voir les logs en temps réel
# (déjà affiché par npm start)

# Arrêter le serveur
Ctrl+C
```

## Prochaines Étapes

Une fois le draft terminé:
1. L'Âge I commence
2. Joueur 1 joue en premier
3. Sélectionnez une carte accessible
4. Choisissez: Construire / Défausser / Merveille

Bon jeu! 🎲
