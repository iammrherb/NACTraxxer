'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<any>
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  activeTab === tab.id && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {tabs.map((tab) => {
            if (tab.id === activeTab) {
              const Component = tab.component
              return <Component key={tab.id} />
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
