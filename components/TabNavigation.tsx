'use client'

import { Button } from '@/components/ui/button'
import { Network, Shield, Users, Building, BarChart3, FileText } from 'lucide-react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'sites', label: 'Site Management', icon: Building },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'workbook', label: 'Site Workbook', icon: FileText }
  ]

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className="flex items-center space-x-2"
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
