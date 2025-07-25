import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { cn } from '../../lib/utils'

interface DropdownOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  group?: string
}

interface AccessibleDropdownProps {
  options: DropdownOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
  error?: string
  className?: string
  ariaLabel?: string
  maxHeight?: string
  clearable?: boolean
}

export function AccessibleDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  multiple = false,
  disabled = false,
  error,
  className,
  ariaLabel,
  maxHeight = "200px",
  clearable = false
}: AccessibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [announceText, setAnnounceText] = useState('')
  
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Group options if they have groups
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'default'
    if (!acc[group]) acc[group] = []
    acc[group].push(option)
    return acc
  }, {} as Record<string, DropdownOption[]>)

  // Get selected option(s) for display
  const selectedOptions = multiple
    ? options.filter(opt => Array.isArray(value) && value.includes(opt.value))
    : options.find(opt => opt.value === value)

  const displayText = multiple
    ? selectedOptions.length > 0
      ? `${selectedOptions.length} selected`
      : placeholder
    : selectedOptions?.label || placeholder

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          )
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0) {
            handleOptionSelect(filteredOptions[focusedIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          triggerRef.current?.focus()
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(filteredOptions.length - 1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, filteredOptions])

  // Focus management
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen, searchable])

  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest'
      })
    }
  }, [focusedIndex])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        listboxRef.current &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value]
      onChange(newValues)
      setAnnounceText(`${option.label} ${currentValues.includes(option.value) ? 'removed' : 'selected'}`)
    } else {
      onChange(option.value)
      setIsOpen(false)
      setAnnounceText(`${option.label} selected`)
      triggerRef.current?.focus()
    }
  }

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange(multiple ? [] : '')
    setAnnounceText('Selection cleared')
  }

  const isSelected = (option: DropdownOption) => {
    return multiple
      ? Array.isArray(value) && value.includes(option.value)
      : value === option.value
  }

  return (
    <div className={cn("relative", className)}>
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announceText}
      </div>

      {/* Trigger button */}
      <Button
        ref={triggerRef}
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          error && "border-red-500 focus:ring-red-500",
          !selectedOptions && "text-gray-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        aria-describedby={error ? `${ariaLabel}-error` : undefined}
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center space-x-1">
          {clearable && (selectedOptions || (Array.isArray(value) && value.length > 0)) && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Clear selection"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </div>
      </Button>

      {/* Error message */}
      {error && (
        <p id={`${ariaLabel}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setFocusedIndex(-1)
                  }}
                  className="pl-8"
                  aria-label="Search options"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <ul
            ref={listboxRef}
            role="listbox"
            aria-label={ariaLabel || "Options"}
            aria-multiselectable={multiple}
            className="py-1 overflow-auto"
            style={{ maxHeight }}
          >
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <React.Fragment key={groupName}>
                {groupName !== 'default' && (
                  <li role="presentation" className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    {groupName}
                  </li>
                )}
                {groupOptions.map((option, index) => {
                  const globalIndex = filteredOptions.indexOf(option)
                  return (
                    <li
                      key={option.value}
                      ref={(el) => (optionRefs.current[globalIndex] = el)}
                      role="option"
                      aria-selected={isSelected(option)}
                      aria-disabled={option.disabled}
                      className={cn(
                        "px-3 py-2 cursor-pointer flex items-center justify-between",
                        "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                        focusedIndex === globalIndex && "bg-gray-100",
                        option.disabled && "opacity-50 cursor-not-allowed",
                        isSelected(option) && "bg-blue-50 text-blue-900"
                      )}
                      onClick={() => handleOptionSelect(option)}
                      onMouseEnter={() => setFocusedIndex(globalIndex)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500 truncate">{option.description}</div>
                        )}
                      </div>
                      {isSelected(option) && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </li>
                  )
                })}
              </React.Fragment>
            ))}
            
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-gray-500 text-center">
                {searchTerm ? 'No options found' : 'No options available'}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// Alternative: Native select for better accessibility in some contexts
export function NativeSelectAlternative({
  options,
  value,
  onChange,
  placeholder,
  multiple = false,
  disabled = false,
  error,
  className,
  ariaLabel
}: Omit<AccessibleDropdownProps, 'searchable' | 'clearable'>) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={multiple ? (Array.isArray(value) ? value : []) : (value || '')}
        onChange={(e) => {
          if (multiple) {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value)
            onChange(selectedValues)
          } else {
            onChange(e.target.value)
          }
        }}
        multiple={multiple}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={error ? `${ariaLabel}-error` : undefined}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          multiple && "min-h-[100px]",
          className
        )}
      >
        {!multiple && placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={`${ariaLabel}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}