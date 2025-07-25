import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

interface CarouselItem {
  id: string
  content: React.ReactNode
  alt?: string
}

interface AccessibleCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
  ariaLabel?: string
}

export function AccessibleCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className,
  ariaLabel = "Content carousel"
}: AccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-play functionality with pause on interaction
  useEffect(() => {
    if (isPlaying && !isUserInteracting && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isUserInteracting, items.length, autoPlayInterval])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!carouselRef.current?.contains(event.target as Node)) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
        case 'Home':
          event.preventDefault()
          goToSlide(0)
          break
        case 'End':
          event.preventDefault()
          goToSlide(items.length - 1)
          break
        case ' ':
          if (autoPlay) {
            event.preventDefault()
            togglePlayPause()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items.length, autoPlay])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsUserInteracting(true)
    
    // Focus the current slide for screen readers
    setTimeout(() => {
      itemRefs.current[index]?.focus()
      setIsUserInteracting(false)
    }, 100)
  }

  const goToNext = () => {
    goToSlide((currentIndex + 1) % items.length)
  }

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div
      ref={carouselRef}
      className={cn("relative focus-within:outline-none", className)}
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Screen reader instructions */}
      <div className="sr-only">
        Use arrow keys to navigate slides. Press spacebar to {isPlaying ? 'pause' : 'play'} auto-advance.
        Currently showing slide {currentIndex + 1} of {items.length}.
      </div>

      {/* Main carousel content */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className="w-full flex-shrink-0 focus:outline-none"
              role="tabpanel"
              aria-label={`Slide ${index + 1} of ${items.length}`}
              aria-hidden={index !== currentIndex}
              tabIndex={index === currentIndex ? 0 : -1}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToPrevious}
            aria-label={`Go to previous slide (${currentIndex === 0 ? items.length : currentIndex} of ${items.length})`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToNext}
            aria-label={`Go to next slide (${(currentIndex + 1) % items.length + 1} of ${items.length})`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Play/Pause button for auto-play */}
      {autoPlay && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause auto-advance' : 'Resume auto-advance'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}

      {/* Dot indicators */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4" role="tablist" aria-label="Slide navigation">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                index === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={index === currentIndex ? 0 : -1}
            />
          ))}
        </div>
      )}

      {/* Alternative: List view toggle for accessibility */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // This would toggle to a list view showing all items
            // Implementation depends on parent component state
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          View all items as list
        </Button>
      </div>
    </div>
  )
}

// Alternative: Static grid layout for users who prefer no motion
export function StaticCarouselAlternative({ items, className }: { items: CarouselItem[], className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          tabIndex={0}
          role="article"
          aria-label={`Item ${index + 1} of ${items.length}`}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}