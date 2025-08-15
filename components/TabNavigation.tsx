"use client"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon?: LucideIcon
}

interface TabNavigationProps {
  tabs?: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export default function TabNavigation({ tabs = [], activeTab, onTabChange, className }: TabNavigationProps) {
  if (!tabs || tabs.length === 0) {
    return null
  }

  return (
    <div className={cn("flex border-b", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
