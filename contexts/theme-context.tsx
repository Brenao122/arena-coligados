"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  actualTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [actualTheme, setActualTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  const getSystemTheme = (): "dark" | "light" => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "dark"
  }

  const applyTheme = (newTheme: "dark" | "light") => {
    if (typeof document === "undefined") return

    const root = document.documentElement

    root.style.setProperty("--theme-transition", "all 0.3s ease")

    root.classList.remove("dark", "light")
    root.classList.add(newTheme)

    root.style.colorScheme = newTheme

    setActualTheme(newTheme)
  }

  useEffect(() => {
    setMounted(true)

    const savedTheme = (typeof window !== "undefined" ? localStorage.getItem("arena-theme") : null) as Theme
    const initialTheme = savedTheme || "system"

    setThemeState(initialTheme)

    const systemTheme = getSystemTheme()
    const resolvedTheme = initialTheme === "system" ? systemTheme : (initialTheme as "dark" | "light")

    applyTheme(resolvedTheme)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    localStorage.setItem("arena-theme", theme)

    if (theme === "system") {
      applyTheme(getSystemTheme())
    } else {
      applyTheme(theme as "dark" | "light")
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  const contextValue = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {!mounted ? <div className="dark">{children}</div> : children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

