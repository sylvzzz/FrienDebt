import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/registar': 'http://localhost:3000',
      '/userdata': 'http://localhost:3000',
      '/balance': 'http://localhost:3000',
      '/marcar': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
    }
  }
})