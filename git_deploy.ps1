$git = "C:\Program Files\Git\cmd\git.exe"

& $git config --global user.name "Gerardo Rodriguez"
& $git config --global user.email "huixache@gmail.com"
& $git add .
& $git commit -m "Frimart OS PWA - Despliegue en Produccion Vercel"
& $git branch -M main
try {
    & $git remote remove origin
} catch {
    # Ignore if origin does not exist
}
& $git remote add origin https://github.com/huixache-cmyk/frimart-app.git
& $git push -u origin main
