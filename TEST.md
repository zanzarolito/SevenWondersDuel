# Tests du Système de Draft

## Test 1 : Draft Local (Solo)

1. Ouvrir `http://localhost:3000/game.html` directement
2. Le draft devrait démarrer automatiquement
3. Vérifier la séquence :
   - Groupe 1 : J1(1) → J2(2) → J1(1)
   - Groupe 2 : J2(1) → J1(2) → J2(1)
4. Résultat : Chaque joueur a 4 merveilles

## Test 2 : Draft Multijoueur

### Joueur 1
1. Aller sur `http://localhost:3000`
2. Entrer nom : "Alice"
3. Cliquer "Créer une partie"
4. Noter le code (ex: "A3F7K2")

### Joueur 2
1. Ouvrir un autre navigateur/onglet incognito
2. Aller sur `http://localhost:3000`
3. Entrer nom : "Bob"
4. Entrer le code de la room
5. Cliquer "Rejoindre une partie"

### Démarrage
1. Joueur 1 clique "Démarrer la partie"
2. Les deux joueurs sont redirigés vers le jeu
3. Le draft commence avec le **même pool de merveilles**

### Vérifications Draft
- [ ] Les 4 merveilles du groupe 1 sont identiques pour les 2 joueurs
- [ ] Seul J1 peut cliquer au tour 1
- [ ] Seul J2 peut cliquer au tour 2 (2 choix)
- [ ] Seul J1 peut cliquer au tour 3
- [ ] Le groupe 2 s'affiche avec 4 nouvelles merveilles
- [ ] L'ordre est inversé (J2 commence)
- [ ] À la fin, chaque joueur a 4 merveilles

### Vérifications Synchronisation
- [ ] Quand J1 choisit, J2 voit la merveille disparaître
- [ ] Quand J2 choisit, J1 voit la merveille disparaître
- [ ] Le compteur "X merveille(s)" se met à jour
- [ ] Le message "À votre tour" / "Joueur X choisit" est correct

## Test 3 : Déconnexion pendant le Draft

1. Démarrer une partie à 2 joueurs
2. Pendant le draft, fermer l'onglet d'un joueur
3. Vérifier que l'autre joueur reçoit un message
4. Vérifier qu'il peut retourner au lobby

## Test 4 : Séquence Complète

### Groupe 1
```
Pool: [Pyramides, Colosse, Sphinx, Phare]

Tour 1 (J1) : Choisit Pyramides
  → J2 voit : [Colosse, Sphinx, Phare] disponibles
  
Tour 2 (J2) : Choisit Colosse
  → J1 voit : [Sphinx, Phare] disponibles
  
Tour 2 (J2) : Choisit Sphinx
  → J1 voit : [Phare] disponible
  
Tour 3 (J1) : Choisit Phare
  → Groupe 1 terminé
```

### Groupe 2
```
Pool: [Zeus, Jardins, Mausolée, Pirée]

Tour 1 (J2) : Choisit Zeus
  → J1 voit : [Jardins, Mausolée, Pirée] disponibles
  
Tour 2 (J1) : Choisit Jardins
  → J2 voit : [Mausolée, Pirée] disponibles
  
Tour 2 (J1) : Choisit Mausolée
  → J2 voit : [Pirée] disponible
  
Tour 3 (J2) : Choisit Pirée
  → Draft terminé, Âge I commence
```

### Résultat Final
```
J1 : [Pyramides, Phare, Jardins, Mausolée]
J2 : [Colosse, Sphinx, Zeus, Pirée]
```

## Bugs Connus à Vérifier

- [ ] Les merveilles sont-elles bien mélangées ?
- [ ] Le même pool est-il partagé entre les 2 joueurs ?
- [ ] Les clics sont-ils bien bloqués quand ce n'est pas son tour ?
- [ ] La synchronisation fonctionne-t-elle en temps réel ?
- [ ] Le passage au groupe 2 est-il fluide ?
- [ ] Le démarrage de l'Âge I après le draft fonctionne-t-il ?

## Commandes de Test

```bash
# Terminal 1 : Démarrer le serveur
npm start

# Terminal 2 : Ouvrir navigateur 1
open http://localhost:3000

# Terminal 3 : Ouvrir navigateur 2 (incognito)
open -na "Google Chrome" --args --incognito http://localhost:3000
```

## Logs à Surveiller

### Console Serveur
```
Nouveau joueur connecté: <socket-id>
Room <room-id> créée par <player-name>
<player-name> a rejoint la room <room-id>
Partie démarrée dans la room <room-id>
```

### Console Navigateur (F12)
```
Connecté au serveur
J1 choisit <wonder-name>
J2 choisit <wonder-name>
```
