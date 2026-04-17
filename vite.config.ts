import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/login": "http://localhost:3000",
      "/registar": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/friends": "http://localhost:3000",
      "/userdata": "http://localhost:3000",
      "/balance": "http://localhost:3000",
      "/marcar": "http://localhost:3000",
      "/remover-amigo": "http://localhost:3000",
      "/utilizadores": "http://localhost:3000",
      "/friends/adicionar": "http://localhost:3000",
      "/updateuser": "http://localhost:3000",
      "/delete": "http://localhost:3000",
      "/logout": "http://localhost:3000",
    },
  },
})
