"use client"

import { Building2, TrendingUp, FileText, Network, Calendar, Shield } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      id: "sites",
      label: "Master Site List",
      icon: Building2,
      description: "Manage all sites",
    },
    {
      id: "progress",
      label: "Rollout Progress",
      icon: TrendingUp,
      description: "Track deployment progress",
    },
    {
      id: "workbook",
      label: "Site Workbook",
      icon: FileText,
      description: "Site documentation",
    },
    {
      id: "architecture",
      label: "Architecture Designer",
      icon: Network,
      description: "Design network architecture",
    },
    {
      id: "timeline",
      label: "Timeline & Schedule",
      icon: Calendar,
      description: "Project timeline",
    },
    {
      id: "policies",
      label: "Policy Management",
      icon: Shield,
      description: "Access control policies",
    },
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
