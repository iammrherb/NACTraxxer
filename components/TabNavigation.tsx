'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Network, Shield, Smartphone, Building, FileText, BarChart3, ChevronRight } from 'lucide-react'

interface TabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = [
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Network,
    description: 'Design & Configure',
    badge: null
  },
  {
    id: 'policies',
    label: 'Policies',
    icon: Shield,
    description: 'Access Control',
    badge: '12'
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: Smartphone,
    description: 'Device Workflows',
    badge: null
  },
  {
    id: 'sites',
    label: 'Sites',
    icon: Building,
    description: 'Master List',
    badge: '8'
  },
  {
    id: 'workbook',
    label: 'Workbook',
    icon: FileText,
    description: 'Site Configuration',
    badge: null
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: BarChart3,
    description: 'Rollout Status',
    badge: '75%'
  }
]

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-2">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={`text-xs ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs ${
                  isActive 
                    ? 'text-white/80' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.description}
                </span>
              </div>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
