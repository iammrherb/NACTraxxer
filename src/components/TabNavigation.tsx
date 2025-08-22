"use client"

import { Building2, TrendingUp, FileText, Network, Calendar, Shield } from "lucide-react"
import { cn } from "../lib/utils"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole?: "admin" | "user"
}

export default function TabNavigation({ activeTab, onTabChange, userRole = "user" }: TabNavigationProps) {
  const tabs = [
    { 
      id: "sites", 
      label: "Sites Management", 
      icon: Building2,
      description: "Manage deployment sites",
      roles: ["admin", "user"]
    },
    { 
      id: "progress", 
      label: "Rollout Progress", 
      icon: TrendingUp,
      description: "Track deployment progress",
      roles: ["admin", "user"]
    },
    { 
      id: "workbook", 
      label: "Site Workbook", 
      icon: FileText,
      description: "Site configuration details",
      roles: ["admin", "user"]
    },
    { 
      id: "architecture", 
      label: "Architecture Designer", 
      icon: Network,
      description: "Design network architecture",
      roles: ["admin"]
    },
    { 
      id: "timeline", 
      label: "Timeline Schedule", 
      icon: Calendar,
      description: "Project timeline view",
      roles: ["admin", "user"]
    },
    { 
      id: "policies", 
      label: "Policy Management", 
      icon: Shield,
      description: "Manage security policies",
      roles: ["admin"]
    }
  ]

  // Filter tabs based on user role
  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole))

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto">
        <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
