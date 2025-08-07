'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Server, Building2, Book, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Navigation
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="truncate">{tab.label}</span>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Quick Stats
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total Sites:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active:</span>
                  <span className="font-medium text-green-600">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Planned:</span>
                  <span className="font-medium text-blue-600">3</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <div
              key={tab.id}
              className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}
            >
              <Component />
            </div>
          )
        })}
      </div>
    </div>
  )
}
