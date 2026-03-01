#!/bin/bash

# Script de déploiement rapide pour Render.com
# Usage: ./deploy.sh "message de commit"

set -e

echo "🚀 Déploiement 7 Wonders Duel"
echo "=============================="
echo ""

# Vérifier si un message de commit est fourni
if [ -z "$1" ]; then
  COMMIT_MSG="Update application"
else
  COMMIT_MSG="$1"
fi

echo "📝 Message de commit: $COMMIT_MSG"
echo ""

# Vérifier que nous sommes dans un repo git
if [ ! -d .git ]; then
  echo "❌ Erreur: Ce n'est pas un repository Git"
  echo "💡 Initialisez d'abord avec: git init"
  exit 1
fi

# Vérifier qu'il y a des changements
if git diff-index --quiet HEAD --; then
  echo "ℹ️  Aucun changement à commiter"
else
  echo "📦 Ajout des fichiers modifiés..."
  git add .
  
  echo "💾 Commit des changements..."
  git commit -m "$COMMIT_MSG"
fi

# Vérifier qu'une remote existe
if ! git remote | grep -q origin; then
  echo "❌ Erreur: Aucune remote 'origin' configurée"
  echo "💡 Ajoutez d'abord votre remote GitHub:"
  echo "   git remote add origin https://github.com/USERNAME/REPO.git"
  exit 1
fi

echo "🔄 Push vers GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "⏳ Render va automatiquement redéployer votre application"
echo "   Cela prend généralement 2-3 minutes"
echo ""
echo "🌐 Vérifiez le statut sur: https://dashboard.render.com"
echo ""
echo "📊 Pour voir les logs en temps réel:"
echo "   Dashboard Render → Votre service → Logs"
echo ""
