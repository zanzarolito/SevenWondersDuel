@echo off
REM Script de déploiement rapide pour Render.com (Windows)
REM Usage: deploy.bat "message de commit"

echo.
echo 🚀 Déploiement 7 Wonders Duel
echo ==============================
echo.

REM Vérifier si un message de commit est fourni
if "%~1"=="" (
  set COMMIT_MSG=Update application
) else (
  set COMMIT_MSG=%~1
)

echo 📝 Message de commit: %COMMIT_MSG%
echo.

REM Vérifier que nous sommes dans un repo git
if not exist .git (
  echo ❌ Erreur: Ce n'est pas un repository Git
  echo 💡 Initialisez d'abord avec: git init
  exit /b 1
)

echo 📦 Ajout des fichiers modifiés...
git add .

echo 💾 Commit des changements...
git commit -m "%COMMIT_MSG%"

REM Vérifier qu'une remote existe
git remote | findstr /C:"origin" >nul
if errorlevel 1 (
  echo ❌ Erreur: Aucune remote 'origin' configurée
  echo 💡 Ajoutez d'abord votre remote GitHub:
  echo    git remote add origin https://github.com/USERNAME/REPO.git
  exit /b 1
)

echo 🔄 Push vers GitHub...
git push origin main
if errorlevel 1 git push origin master

echo.
echo ✅ Déploiement terminé!
echo.
echo ⏳ Render va automatiquement redéployer votre application
echo    Cela prend généralement 2-3 minutes
echo.
echo 🌐 Vérifiez le statut sur: https://dashboard.render.com
echo.
echo 📊 Pour voir les logs en temps réel:
echo    Dashboard Render → Votre service → Logs
echo.

pause
