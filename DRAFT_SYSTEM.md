# Système de Draft des Merveilles

## Règles du Draft

Le draft des merveilles se déroule en **2 groupes de 4 merveilles** (8 merveilles au total, 4 par joueur).

### Groupe 1 (Merveilles 1-4)
**Séquence : J1 → J2 → J1**

1. **Joueur 1** choisit **1 merveille**
2. **Joueur 2** choisit **2 merveilles**
3. **Joueur 1** choisit **1 merveille** (la dernière restante)

### Groupe 2 (Merveilles 5-8)
**Séquence : J2 → J1 → J2** (inversée)

1. **Joueur 2** choisit **1 merveille**
2. **Joueur 1** choisit **2 merveilles**
3. **Joueur 2** choisit **1 merveille** (la dernière restante)

## Résultat

À la fin du draft :
- **Joueur 1** possède **4 merveilles** (1+1 du groupe 1, 2 du groupe 2)
- **Joueur 2** possède **4 merveilles** (2 du groupe 1, 1+1 du groupe 2)

## Implémentation Multijoueur

### Synchronisation

1. Le **serveur** génère un pool de 12 merveilles mélangées au démarrage
2. Les **deux joueurs** reçoivent le même état initial
3. Chaque choix est **synchronisé en temps réel** via Socket.IO
4. L'interface indique clairement **quel joueur doit choisir**

### Code

```javascript
// Séquences encodées : [joueur, nombre_de_choix]
sequences: [
  [[1,1], [2,2], [1,1]],   // Groupe 1
  [[2,1], [1,2], [2,1]],   // Groupe 2
]
```

### Événements Socket.IO

- `wonderPicked` : Un joueur a choisi une merveille
  - Données : `{ offerIdx, playerNumber }`
  - Synchronise le choix avec l'adversaire
  - Met à jour l'état du draft

### Interface

- **Tour actif** : Bordure verte, "À votre tour !"
- **Tour adversaire** : Bordure rouge, "Joueur X choisit..."
- **Merveilles prises** : Grisées et non cliquables
- **Séquence affichée** : Texte explicatif en bas

## Exemple de Partie

```
GROUPE 1 : [Pyramides, Colosse, Sphinx, Phare]

Tour 1 : J1 choisit → Pyramides
Reste : [Colosse, Sphinx, Phare]

Tour 2 : J2 choisit → Colosse
Tour 2 : J2 choisit → Sphinx
Reste : [Phare]

Tour 3 : J1 choisit → Phare

---

GROUPE 2 : [Zeus, Jardins, Mausolée, Pirée]

Tour 1 : J2 choisit → Zeus
Reste : [Jardins, Mausolée, Pirée]

Tour 2 : J1 choisit → Jardins
Tour 2 : J1 choisit → Mausolée
Reste : [Pirée]

Tour 3 : J2 choisit → Pirée

---

RÉSULTAT :
J1 : Pyramides, Phare, Jardins, Mausolée
J2 : Colosse, Sphinx, Zeus, Pirée
```

## Avantages de ce Système

1. **Équilibré** : Chaque joueur choisit 4 merveilles
2. **Stratégique** : Le joueur qui choisit 2 fois peut bloquer des combos
3. **Compensé** : L'ordre est inversé au 2e groupe
4. **Conforme** : Respecte les règles officielles de 7 Wonders Duel
