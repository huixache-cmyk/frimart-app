import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Sello visible en la pantalla de acceso para verificar la versión publicada
    __BUILD_STAMP__: JSON.stringify(
      new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', dateStyle: 'short', timeStyle: 'short' }) +
      (process.env.VERCEL_GIT_COMMIT_SHA ? ' · ' + process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : '')
    )
  },
  plugins: [
    tailwindcss(),
    react(),
    basicSsl()
  ],
  server: {
    host: true, // Expone la app a la red local (celulares conectados al mismo Wi-Fi)
    port: 5173
  }
})
