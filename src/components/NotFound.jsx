import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useNotification } from "./Notification"

export function NotFound() {
  const notify = useNotification()

  useEffect(() => {
    notify("Erro 404", "Página não encontrada.")
  }, [])

  return <Navigate to="/" replace />
}

export default NotFound