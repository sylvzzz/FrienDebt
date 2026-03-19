import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { App } from "./App.jsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { NotificationProvider } from "./components/Notification"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>
)