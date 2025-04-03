"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"

export interface Settings {
  openaiKey?: string
  anthropicKey?: string
  geminiKey?: string
  selectedModel?: string
  sourceLang?: string
  targetLang?: string
  pricePerWord?: number
}

// Add this function after the Settings interface
export function isPlaceholder(value?: string): boolean {
  return !value || value.startsWith("placeholder-")
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  updateSettings: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    try {
      const storedSettings = localStorage.getItem("translator-settings")
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    // Save settings to localStorage when they change
    if (loaded) {
      try {
        localStorage.setItem("translator-settings", JSON.stringify(settings))
      } catch (error) {
        console.error("Failed to save settings:", error)
      }
    }
  }, [settings, loaded])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}

