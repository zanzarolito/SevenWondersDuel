# Guide de Débogage

## Erreur: "Cannot destructure property 'gameState' of 'undefined'"

### Cause
Cette erreur se produit quand le serveur essaie d'accéder à une room qui n'existe pas ou qui a été supprimée.

### Solutions Appliquées

1. **Vérifications de sécurité dans server.js**
   - Vérifier que `room` existe avant d'y accéder
   - Vérifier que `room.players` existe
   - Gestion propre de la déconnexion

2. **Mode solo supporté**
   - Le jeu peut maintenant fonctionner sans multijoueur
   - Accès direct à `/game.html` fonctionne

3. **Initialisation robuste de MP**
   - `MP` est toujours défini (instance globale)
   - `MP.init()` retourne `false` si pas de room (mode solo)
   - Vérifications avant chaque appel Socket.IO

## Comment Tester

### Mode Solo (sans erreur)
```bash
# Ouvrir directement
http://localhost:3000/game.html
```
✅ Devrait fonctionner sans erreur

### Mode Multijoueur
```bash
# Joueur 1
http://localhost:3000
→ Créer une partie

# Joueur 2
http://localhost:3000
→ Rejoindre avec le code
```
✅ Devrait fonctionner sans erreur

## Logs à Surveiller

### Console Serveur (Terminal)
```
✅ Nouveau joueur connecté: <id>
✅ Room <code> créée par <nom>
✅ <nom> a rejoint la room <code>
✅ Partie démarrée dans la room <code>
✅ Joueur déconnecté: <id>
✅ Room <code> supprimée
```

### Console Navigateur (F12)
```
✅ Connecté au serveur
✅ Mode solo (si pas de room)
✅ J1 choisit <merveille>
```

## Erreurs Possibles

### 1. "Room introuvable"
**Cause**: Code de room invalide ou expiré
**Solution**: Créer une nouvelle partie

### 2. "Room complète"
**Cause**: 2 joueurs déjà dans la room
**Solution**: Créer une nouvelle partie

### 3. "Partie déjà en cours"
**Cause**: Tentative de rejoindre une partie démarrée
**Solution**: Créer une nouvelle partie

### 4. Socket.IO ne se connecte pas
**Cause**: Serveur non démarré ou port incorrect
**Solution**: 
```bash
npm start
# Vérifier que le serveur écoute sur le port 3000
```

### 5. État du jeu non synchronisé
**Cause**: Problème de réseau ou déconnexion
**Solution**: Rafraîchir la page (F5)

## Commandes Utiles

### Redémarrer le serveur
```bash
# Ctrl+C pour arrêter
npm start
```

### Voir les logs en temps réel
```bash
# Le serveur affiche automatiquement les logs
# Ajouter plus de logs si nécessaire:
console.log('DEBUG:', variable);
```

### Nettoyer le cache
```bash
# Dans le navigateur
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Tester en local avec 2 navigateurs
```bash
# Terminal 1: Navigateur normal
open http://localhost:3000

# Terminal 2: Mode incognito
# Chrome
open -na "Google Chrome" --args --incognito http://localhost:3000

# Firefox
open -na "Firefox" --args -private-window http://localhost:3000
```

## Vérifications de Santé

### ✅ Serveur OK
- [ ] `npm start` démarre sans erreur
- [ ] Console affiche "Serveur démarré sur le port 3000"
- [ ] Pas d'erreur dans les logs

### ✅ Lobby OK
- [ ] Page d'accueil charge
- [ ] Peut créer une room
- [ ] Reçoit un code de 6 caractères
- [ ] Peut rejoindre avec le code

### ✅ Draft OK
- [ ] Les 2 joueurs voient les mêmes merveilles
- [ ] Seul le joueur actif peut cliquer
- [ ] Les choix se synchronisent
- [ ] Le draft se termine correctement

### ✅ Jeu OK
- [ ] L'Âge I démarre après le draft
- [ ] Les tours alternent correctement
- [ ] Les actions se synchronisent
- [ ] Pas d'erreur dans la console

## Contact / Support

Si l'erreur persiste:
1. Vérifier les logs serveur ET navigateur
2. Copier le message d'erreur complet
3. Noter les étapes pour reproduire
4. Vérifier la version de Node.js: `node --version` (>= 14.x)
