import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

let showNotificationFn = null

export function useNotification() {
  return (title, description) => {
    if (showNotificationFn) showNotificationFn(title, description)
  }
}

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  showNotificationFn = (t, d) => {
    setTitle(t)
    setDescription(d)
    setOpen(true)
    setTimeout(() => setOpen(false), 4000)
  }

  return (
    <>
      {children}
      {open && (
        <div className="fixed top-6 right-6 z-50 w-80">
          <Alert className="bg-[#1a1a1f] border-gray-700 text-white">
            <Info className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="text-gray-400">
              {description}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}