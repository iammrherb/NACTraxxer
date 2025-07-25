import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  FolderOpen, 
  BarChart3, 
  Settings,
  BookOpen,
  HelpCircle,
  ChevronDown
} from 'lucide-react'
import { cn } from '../lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  children?: NavigationItem[]
  description?: string
}

export function NavigationEnhanced() {
  const location = useLocation()
  
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Overview and key metrics'
    },
    {
      name: 'Sites',
      href: '/sites',
      icon: Building2,
      description: 'Deployment site management',
      children: [
        { name: 'All Sites', href: '/sites', icon: Building2 },
        { name: 'Create Site', href: '/sites/create', icon: Building2 },
        { name: 'Bulk Operations', href: '/sites/bulk', icon: Building2 }
      ]
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderOpen,
      description: 'Project lifecycle management',
      children: [
        { name: 'All Projects', href: '/projects', icon: FolderOpen },
        { name: 'Create Project', href: '/projects/create', icon: FolderOpen },
        { name: 'Templates', href: '/projects/templates', icon: FolderOpen }
      ]
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Performance insights and reports',
      children: [
        { name: 'Overview', href: '/analytics', icon: BarChart3 },
        { name: 'Performance', href: '/analytics/performance', icon: BarChart3 },
        { name: 'Financial', href: '/analytics/financial', icon: BarChart3 },
        { name: 'Reports', href: '/analytics/reports', icon: BarChart3 }
      ]
    },
    {
      name: 'Library',
      href: '/library',
      icon: BookOpen,
      description: 'Knowledge base and templates',
      children: [
        { name: 'Use Cases', href: '/library/use-cases', icon: BookOpen },
        { name: 'Test Cases', href: '/library/test-cases', icon: BookOpen },
        { name: 'Vendor Configs', href: '/library/vendors', icon: BookOpen },
        { name: 'Requirements', href: '/library/requirements', icon: BookOpen }
      ]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Account and system configuration'
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      description: 'Documentation and support'
    }
  ]

  // Mark current navigation items
  const navigationWithCurrent = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href || location.pathname.startsWith(item.href + '/'),
    children: item.children?.map(child => ({
      ...child,
      current: location.pathname === child.href
    }))
  }))

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {navigationWithCurrent.map((item) => (
        <div key={item.name}>
          <Link
            to={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              item.current
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
            aria-current={item.current ? 'page' : undefined}
            title={item.description}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              )}
              aria-hidden="true"
            />
            {item.name}
            {item.children && (
              <ChevronDown className="ml-auto h-4 w-4" aria-hidden="true" />
            )}
          </Link>
          
          {/* Sub-navigation */}
          {item.children && item.current && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  to={child.href}
                  className={cn(
                    'group flex items-center px-2 py-1 text-sm rounded-md transition-colors duration-200',
                    child.current
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                  aria-current={child.current ? 'page' : undefined}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// Quick actions component for contextual navigation
export function QuickActions() {
  const location = useLocation()
  
  const getQuickActions = () => {
    switch (location.pathname) {
      case '/':
        return [
          { name: 'Create Site', href: '/sites/create', primary: true },
          { name: 'New Project', href: '/projects/create', primary: false },
          { name: 'View Analytics', href: '/analytics', primary: false }
        ]
      case '/sites':
        return [
          { name: 'Create Site', href: '/sites/create', primary: true },
          { name: 'Bulk Import', href: '/sites/bulk', primary: false },
          { name: 'Export Data', href: '/sites/export', primary: false }
        ]
      case '/projects':
        return [
          { name: 'New Project', href: '/projects/create', primary: true },
          { name: 'Use Template', href: '/projects/templates', primary: false },
          { name: 'Import Project', href: '/projects/import', primary: false }
        ]
      default:
        return []
    }
  }

  const quickActions = getQuickActions()

  if (quickActions.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      {quickActions.map((action) => (
        <Link
          key={action.name}
          to={action.href}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
            action.primary
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {action.name}
        </Link>
      ))}
    </div>
  )
}