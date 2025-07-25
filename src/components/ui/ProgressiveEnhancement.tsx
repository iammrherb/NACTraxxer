import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

// Hook for detecting user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeText: false,
    supportsHover: true,
    supportsTouch: false,
    connectionSpeed: 'fast' as 'slow' | 'fast'
  })

  useEffect(() => {
    // Detect motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const hoverQuery = window.matchMedia('(hover: hover)')
    const touchQuery = window.matchMedia('(pointer: coarse)')

    // Detect connection speed (simplified)
    const connection = (navigator as any).connection
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData
    )

    setPreferences({
      prefersReducedMotion: motionQuery.matches,
      prefersHighContrast: contrastQuery.matches,
      prefersLargeText: window.getComputedStyle(document.documentElement).fontSize !== '16px',
      supportsHover: hoverQuery.matches,
      supportsTouch: touchQuery.matches,
      connectionSpeed: isSlowConnection ? 'slow' : 'fast'
    })

    // Listen for changes
    const updateMotion = () => setPreferences(prev => ({ ...prev, prefersReducedMotion: motionQuery.matches }))
    const updateContrast = () => setPreferences(prev => ({ ...prev, prefersHighContrast: contrastQuery.matches }))

    motionQuery.addEventListener('change', updateMotion)
    contrastQuery.addEventListener('change', updateContrast)

    return () => {
      motionQuery.removeEventListener('change', updateMotion)
      contrastQuery.removeEventListener('change', updateContrast)
    }
  }, [])

  return preferences
}

// Progressive enhancement wrapper
interface ProgressiveWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiresJS?: boolean
  requiresCSS?: boolean
  className?: string
}

export function ProgressiveWrapper({
  children,
  fallback,
  requiresJS = false,
  requiresCSS = false,
  className
}: ProgressiveWrapperProps) {
  const [isEnhanced, setIsEnhanced] = useState(!requiresJS)
  const preferences = useUserPreferences()

  useEffect(() => {
    if (requiresJS) {
      setIsEnhanced(true)
    }
  }, [requiresJS])

  // Provide fallback for users with JavaScript disabled
  if (requiresJS && !isEnhanced) {
    return (
      <div className={cn("progressive-fallback", className)}>
        {fallback || (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              This feature requires JavaScript to be enabled for the best experience.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "progressive-enhanced",
        preferences.prefersReducedMotion && "motion-reduce",
        preferences.prefersHighContrast && "high-contrast",
        preferences.supportsTouch && "touch-enabled",
        className
      )}
    >
      {children}
    </div>
  )
}

// Adaptive loading component
interface AdaptiveImageProps {
  src: string
  alt: string
  lowQualitySrc?: string
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}

export function AdaptiveImage({
  src,
  alt,
  lowQualitySrc,
  className,
  sizes,
  loading = 'lazy'
}: AdaptiveImageProps) {
  const [imageSrc, setImageSrc] = useState(lowQualitySrc || src)
  const [isLoaded, setIsLoaded] = useState(false)
  const preferences = useUserPreferences()
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Use low quality image for slow connections
    if (preferences.connectionSpeed === 'slow' && lowQualitySrc) {
      setImageSrc(lowQualitySrc)
    } else {
      // Preload high quality image
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [src, lowQualitySrc, preferences.connectionSpeed])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        loading={loading}
        className={cn(
          "transition-opacity duration-300",
          !isLoaded && lowQualitySrc && "blur-sm",
          isLoaded && "opacity-100"
        )}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

export function ResponsiveText({
  children,
  className,
  as: Component = 'p'
}: ResponsiveTextProps) {
  const preferences = useUserPreferences()

  return (
    <Component
      className={cn(
        "responsive-text",
        preferences.prefersLargeText && "text-lg",
        preferences.prefersHighContrast && "font-semibold",
        className
      )}
    >
      {children}
    </Component>
  )
}

// Focus management hook
export function useFocusManagement() {
  const [focusVisible, setFocusVisible] = useState(false)
  const lastInteractionRef = useRef<'mouse' | 'keyboard' | null>(null)

  useEffect(() => {
    const handleMouseDown = () => {
      lastInteractionRef.current = 'mouse'
      setFocusVisible(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        lastInteractionRef.current = 'keyboard'
        setFocusVisible(true)
      }
    }

    const handleFocus = () => {
      if (lastInteractionRef.current === 'keyboard') {
        setFocusVisible(true)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocus)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocus)
    }
  }, [])

  return { focusVisible }
}

// Skip link component
export function SkipLink({ href = "#main-content", children = "Skip to main content" }: {
  href?: string
  children?: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      {children}
    </a>
  )
}