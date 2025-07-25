import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

interface InternalLinkProps {
  to: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'subtle' | 'prominent' | 'card'
  showIcon?: boolean
  external?: boolean
  trackingData?: {
    category: string
    action: string
    label?: string
  }
}

export function InternalLink({ 
  to, 
  children, 
  className, 
  variant = 'default',
  showIcon = false,
  external = false,
  trackingData
}: InternalLinkProps) {
  const baseClasses = "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  
  const variantClasses = {
    default: "text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2",
    subtle: "text-gray-600 hover:text-gray-900 no-underline hover:underline",
    prominent: "text-blue-700 hover:text-blue-900 font-medium",
    card: "block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
  }

  const handleClick = () => {
    if (trackingData) {
      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', trackingData.action, {
          event_category: trackingData.category,
          event_label: trackingData.label || to
        })
      }
    }
  }

  const linkProps = {
    to,
    className: cn(baseClasses, variantClasses[variant], className),
    onClick: handleClick,
    ...(external && {
      target: "_blank",
      rel: "noopener noreferrer"
    })
  }

  return (
    <Link {...linkProps}>
      <span className="flex items-center gap-1">
        {children}
        {showIcon && (
          external ? (
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )
        )}
      </span>
    </Link>
  )
}

// Contextual link suggestions component
interface RelatedLinksProps {
  currentPage: string
  currentId?: string
  className?: string
}

export function RelatedLinks({ currentPage, currentId, className }: RelatedLinksProps) {
  const getRelatedLinks = () => {
    switch (currentPage) {
      case 'sites':
        return [
          { to: '/projects', label: 'View Related Projects', icon: true },
          { to: '/analytics', label: 'Site Performance Analytics', icon: true },
          { to: '/library/use-cases', label: 'Recommended Use Cases', icon: true }
        ]
      case 'projects':
        return [
          { to: '/sites', label: 'Associated Sites', icon: true },
          { to: '/analytics/performance', label: 'Project Analytics', icon: true },
          { to: '/library/requirements', label: 'Requirements Library', icon: true }
        ]
      case 'analytics':
        return [
          { to: '/sites', label: 'Site Details', icon: true },
          { to: '/projects', label: 'Project Overview', icon: true },
          { to: '/settings/integrations', label: 'Data Sources', icon: true }
        ]
      default:
        return []
    }
  }

  const relatedLinks = getRelatedLinks()

  if (relatedLinks.length === 0) {
    return null
  }

  return (
    <div className={cn("bg-gray-50 rounded-lg p-4", className)}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Related</h3>
      <div className="space-y-2">
        {relatedLinks.map((link, index) => (
          <InternalLink
            key={index}
            to={link.to}
            variant="subtle"
            showIcon={link.icon}
            className="text-sm block"
            trackingData={{
              category: 'Related Links',
              action: 'click',
              label: `${currentPage}-${link.label}`
            }}
          >
            {link.label}
          </InternalLink>
        ))}
      </div>
    </div>
  )
}