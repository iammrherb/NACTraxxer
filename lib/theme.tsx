"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type ThemeSettings = {
  primary: string
  background: string
  nodeRadius: number
  edgeWidth: number
  protocolColors: Record<string, string>
}

const defaultTheme: ThemeSettings = {
  primary: "#059669",
  background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
  nodeRadius: 10,
  edgeWidth: 2,
  protocolColors: {
    radius: "#00c8d7",
    radsec: "#06b6d4",
    https: "#10b981",
    ldap: "#2563eb",
    syslog: "#7c3aed",
    tacacs: "#dc2626",
    data: "#6b7280",
    coa: "#f59e0b",
  },
}

type ThemeContextValue = {
  theme: ThemeSettings
  setTheme: (t: ThemeSettings) => void
  updateTheme: (patch: Partial<ThemeSettings>) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)

  useEffect(() => {
    const saved = localStorage.getItem("portnox-theme")
    if (saved) {
      try {
        setTheme(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("portnox-theme", JSON.stringify(theme))
    // Apply root CSS variables for easy theming
    const root = document.documentElement
    root.style.setProperty("--pn-primary", theme.primary)
    root.style.setProperty("--pn-edge-width", `${theme.edgeWidth}px`)
    root.style.setProperty("--pn-bg", theme.background)
    Object.entries(theme.protocolColors).forEach(([k, v]) => {
      root.style.setProperty(`--pn-protocol-${k}`, v)
    })
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      updateTheme: (patch: Partial<ThemeSettings>) =>
        setTheme((prev) => ({
          ...prev,
          ...patch,
          protocolColors: { ...prev.protocolColors, ...(patch.protocolColors || {}) },
        })),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeSettings() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useThemeSettings must be used within ThemeProvider")
  return ctx
}
