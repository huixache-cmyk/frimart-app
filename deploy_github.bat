@echo off
echo ========================================================
echo    FRIMART OS - DESPLIEGUE A GITHUB Y VERCEL (EN VIVO)
echo ========================================================
git config --global user.name "Gerardo Rodriguez"
git config --global user.email "huixache@gmail.com"
git add .
git commit -m "Frimart OS PWA Production Ready"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/huixache-cmyk/frimart-app.git
git push -u origin main
echo.
echo Despliegue enviado a GitHub exitosamente.
pause
