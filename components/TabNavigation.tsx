'use client'

import { Button } from '@/components/ui/button'
import { List, Book, TrendingUp, Network, type LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: string
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  list: List,
  book: Book,
  'chart-line': TrendingUp,
  sitemap: Network
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.icon]
          const isActive = activeTab === tab.id
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`flex items-center space-x-2 whitespace-nowrap ${
                isActive 
                  ? 'border-b-2 border-blue-500 rounded-b-none' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
