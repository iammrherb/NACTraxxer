import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, ChevronDown, Grid, List } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

interface InfiniteScrollItem {
  id: string
  content: React.ReactNode
}

interface AccessibleInfiniteScrollProps<T> {
  items: T[]
  loadMore: () => Promise<T[]>
  hasMore: boolean
  isLoading: boolean
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  pageSize?: number
  loadMoreText?: string
  noMoreText?: string
  ariaLabel?: string
  enableManualLoad?: boolean
  viewMode?: 'list' | 'grid'
  onViewModeChange?: (mode: 'list' | 'grid') => void
}

export function AccessibleInfiniteScroll<T extends { id: string }>({
  items,
  loadMore,
  hasMore,
  isLoading,
  renderItem,
  className,
  pageSize = 20,
  loadMoreText = "Load more items",
  noMoreText = "No more items to load",
  ariaLabel = "Content list",
  enableManualLoad = true,
  viewMode = 'list',
  onViewModeChange
}: AccessibleInfiniteScrollProps<T>) {
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(false)
  const [announceText, setAnnounceText] = useState('')
  const loadMoreRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const lastItemCountRef = useRef(items.length)

  // Intersection Observer for auto-loading (opt-in)
  useEffect(() => {
    if (!autoLoadEnabled || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [autoLoadEnabled, hasMore, isLoading])

  // Announce new items to screen readers
  useEffect(() => {
    if (items.length > lastItemCountRef.current) {
      const newItemsCount = items.length - lastItemCountRef.current
      setAnnounceText(`${newItemsCount} new items loaded. Total: ${items.length} items.`)
      lastItemCountRef.current = items.length
    }
  }, [items.length])

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    
    try {
      await loadMore()
    } catch (error) {
      setAnnounceText('Failed to load more items. Please try again.')
    }
  }, [loadMore, isLoading, hasMore])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Allow users to navigate with keyboard
    if (event.key === 'PageDown' && hasMore && !isLoading) {
      event.preventDefault()
      handleLoadMore()
    }
  }

  return (
    <div className={cn("space-y-4", className)} onKeyDown={handleKeyDown}>
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announceText}
      </div>

      {/* View mode controls */}
      {onViewModeChange && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-r-none"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-l-none"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
            </div>
          </div>

          {/* Auto-load toggle */}
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoLoadEnabled}
              onChange={(e) => setAutoLoadEnabled(e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span>Auto-load more items</span>
          </label>
        </div>
      )}

      {/* Items container */}
      <div
        ref={listRef}
        role="feed"
        aria-label={ariaLabel}
        aria-busy={isLoading}
        className={cn(
          viewMode === 'grid' 
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            role="article"
            aria-posinset={index + 1}
            aria-setsize={hasMore ? -1 : items.length}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            tabIndex={0}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8" role="status" aria-label="Loading more items">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading more items...</span>
        </div>
      )}

      {/* Load more controls */}
      {hasMore && !isLoading && (
        <div className="flex flex-col items-center space-y-4 py-8">
          {enableManualLoad && (
            <Button
              ref={loadMoreRef}
              onClick={handleLoadMore}
              variant="outline"
              className="flex items-center space-x-2"
              aria-describedby="load-more-help"
            >
              <ChevronDown className="h-4 w-4" />
              <span>{loadMoreText}</span>
            </Button>
          )}
          
          <div id="load-more-help" className="text-sm text-gray-600 text-center max-w-md">
            {autoLoadEnabled 
              ? "New items will load automatically as you scroll, or press PageDown to load more."
              : "Click the button above or press PageDown to load more items."
            }
          </div>
        </div>
      )}

      {/* End of content */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-600" role="status">
          <p>{noMoreText}</p>
          <p className="text-sm mt-2">Showing all {items.length} items</p>
        </div>
      )}

      {/* Pagination alternative */}
      <div className="mt-8 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // This would switch to paginated view
            // Implementation depends on parent component
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Switch to paginated view
        </Button>
      </div>
    </div>
  )
}

// Alternative: Paginated view for users who prefer traditional pagination
export function PaginatedAlternative<T>({
  items,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  renderItem,
  className
}: {
  items: T[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={(item as any).id}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Pagination info */}
      <div className="text-sm text-gray-600 text-center">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Pagination controls */}
      <nav aria-label="Pagination" className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            )
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </Button>
        </div>
      </nav>
    </div>
  )
}