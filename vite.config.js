import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
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
