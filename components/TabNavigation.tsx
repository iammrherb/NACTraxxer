'use client'

import { Button } from '@/components/ui/button'
import { Network, Shield, Users, FileText, BarChart3, Settings } from 'lucide-react'

interface TabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'architecture', label: 'Architecture Designer', icon: Network },
    { id: 'policies', label: 'Policy Editor', icon: Shield },
    { id: 'onboarding', label: 'Device Onboarding', icon: Users },
    { id: 'sites', label: 'Site Management', icon: FileText },
    { id: 'workbook', label: 'Site Workbook', icon: FileText },
    { id: 'progress', label: 'Rollout Progress', icon: BarChart3 }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
