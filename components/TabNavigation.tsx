'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Network, Shield, UserPlus, Building, BarChart3, FileText, Users, Palette, Zap, Settings } from 'lucide-react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      id: 'architecture',
      label: 'Architecture',
      icon: <Network className="h-4 w-4" />,
      description: 'Design and visualize NAC architecture',
      badge: null
    },
    {
      id: 'policies',
      label: 'Policies',
      icon: <Shield className="h-4 w-4" />,
      description: 'Configure access control policies',
      badge: '12'
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      icon: <UserPlus className="h-4 w-4" />,
      description: 'Device onboarding scenarios',
      badge: null
    },
    {
      id: 'sites',
      label: 'Sites',
      icon: <Building className="h-4 w-4" />,
      description: 'Manage deployment sites',
      badge: '24'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Track deployment progress',
      badge: '75%'
    },
    {
      id: 'workbook',
      label: 'Workbook',
      icon: <FileText className="h-4 w-4" />,
      description: 'Site configuration workbook',
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="h-4 w-4" />,
      description: 'User management',
      badge: '156'
    },
    {
      id: 'themes',
      label: 'Themes',
      icon: <Palette className="h-4 w-4" />,
      description: 'Customize appearance',
      badge: null
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            size="sm"
          >
            <span className={`${activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              {tab.icon}
            </span>
            <span className="font-medium">{tab.label}</span>
            {tab.badge && (
              <Badge 
                variant={activeTab === tab.id ? 'secondary' : 'outline'}
                className={`ml-1 ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {tab.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {/* Tab Description */}
      <div className="mt-3 px-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  )
}
