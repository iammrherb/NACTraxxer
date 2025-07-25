import React, { useEffect, useRef } from 'react'
import { useAccessibility } from './AccessibilityProvider'

// Enhanced Button with accessibility features
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  onClick,
  ...props
}: AccessibleButtonProps) {
  const { announceToScreenReader } = useAccessibility()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault()
      return
    }
    
    // Announce action to screen readers
    const buttonText = typeof children === 'string' ? children : 'Button'
    announceToScreenReader(`${buttonText} activated`)
    
    onClick?.(event)
  }

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-base min-h-[40px]",
    lg: "px-6 py-3 text-lg min-h-[48px]"
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
      aria-describedby={loading ? `${props.id}-loading` : undefined}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{loadingText}</span>
          <span id={`${props.id}-loading`} className="sr-only">
            Please wait, {loadingText.toLowerCase()}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Enhanced Form Field with accessibility features
interface AccessibleFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactElement
  className?: string
}

export function AccessibleField({
  label,
  error,
  hint,
  required = false,
  children,
  className
}: AccessibleFieldProps) {
  const fieldId = children.props.id || `field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  const enhancedChild = React.cloneElement(children, {
    id: fieldId,
    'aria-describedby': [
      hint ? hintId : null,
      error ? errorId : null
    ].filter(Boolean).join(' ') || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-required': required
  })

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-600 mb-2">
          {hint}
        </p>
      )}
      
      {enhancedChild}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced Modal with accessibility features
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const { announceToScreenReader } = useAccessibility()

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus the modal
      modalRef.current?.focus()
      
      // Announce modal opening
      announceToScreenReader(`${title} dialog opened`, 'assertive')
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore focus to previously focused element
      previousFocusRef.current?.focus()
      
      // Restore body scroll
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, title, announceToScreenReader])

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Table with accessibility features
interface AccessibleTableProps {
  data: any[]
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
  }>
  caption?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  className?: string
}

export function AccessibleTable({
  data,
  columns,
  caption,
  sortBy,
  sortDirection,
  onSort,
  className
}: AccessibleTableProps) {
  const { announceToScreenReader } = useAccessibility()

  const handleSort = (columnKey: string) => {
    if (!onSort) return
    
    onSort(columnKey)
    
    const column = columns.find(col => col.key === columnKey)
    const newDirection = sortBy === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'
    
    announceToScreenReader(
      `Table sorted by ${column?.label} in ${newDirection}ending order`,
      'assertive'
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200" role="table">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                aria-sort={
                  sortBy === column.key
                    ? sortDirection === 'asc' ? 'ascending' : 'descending'
                    : column.sortable ? 'none' : undefined
                }
                tabIndex={column.sortable ? 0 : undefined}
                onKeyDown={column.sortable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSort(column.key)
                  }
                } : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortBy === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  role={colIndex === 0 ? 'rowheader' : 'cell'}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}