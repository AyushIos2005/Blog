import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls through the Vite dev server so the browser only ever
    // talks to http://localhost:5173. This makes every request same-origin,
    // which avoids CORS entirely and lets the backend's SameSite=Strict
    // auth cookie work correctly (it would otherwise be dropped on
    // cross-port requests, e.g. 5173 -> 3000, even with CORS allowed).
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
