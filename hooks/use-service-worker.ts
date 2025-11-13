"use client"

import { useEffect, useState } from "react"

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(true)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("[SW] Registration failed:", error)
        })
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const updateServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.waiting?.postMessage({ type: "SKIP_WAITING" })
        window.location.reload()
      })
    }
  }

  return { isOnline, isUpdateAvailable, updateServiceWorker }
}
