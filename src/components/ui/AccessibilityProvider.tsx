import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  focusElement: (selector: string) => void
  preferences: {
    reducedMotion: boolean
    highContrast: boolean
    largeText: boolean
    keyboardNavigation: boolean
  }
  updatePreference: (key: string, value: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    keyboardNavigation: false
  })

  const [announcer, setAnnouncer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create screen reader announcer
    const announcerElement = document.createElement('div')
    announcerElement.setAttribute('aria-live', 'polite')
    announcerElement.setAttribute('aria-atomic', 'true')
    announcerElement.className = 'sr-only'
    document.body.appendChild(announcerElement)
    setAnnouncer(announcerElement)

    // Detect system preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    
    const updatePreferences = () => {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: motionQuery.matches,
        highContrast: contrastQuery.matches
      }))
    }

    updatePreferences()
    motionQuery.addEventListener('change', updatePreferences)
    contrastQuery.addEventListener('change', updatePreferences)

    // Detect keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setPreferences(prev => ({ ...prev, keyboardNavigation: true }))
      }
    }

    const handleMouseDown = () => {
      setPreferences(prev => ({ ...prev, keyboardNavigation: false }))
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.body.removeChild(announcerElement)
      motionQuery.removeEventListener('change', updatePreferences)
      contrastQuery.removeEventListener('change', updatePreferences)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcer) {
      announcer.setAttribute('aria-live', priority)
      announcer.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = ''
      }, 1000)
    }
  }

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    
    // Apply CSS classes to document
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', value)
    }
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value)
    }
    if (key === 'largeText') {
      document.documentElement.classList.toggle('large-text', value)
    }
  }

  return (
    <AccessibilityContext.Provider value={{
      announceToScreenReader,
      focusElement,
      preferences,
      updatePreference
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Accessibility settings panel
export function AccessibilitySettings() {
  const { preferences, updatePreference } = useAccessibility()

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Accessibility Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.reducedMotion}
            onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span>Reduce motion and animations</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.highContrast}
            onChange={(e) => updatePreference('highContrast', e.target.checked)}
            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span>High contrast mode</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.largeText}
            onChange={(e) => updatePreference('largeText', e.target.checked)}
            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span>Large text size</span>
        </label>
      </div>

      <div className="text-sm text-gray-600">
        <p>These settings will be saved to your browser and applied across the application.</p>
      </div>
    </div>
  )
}