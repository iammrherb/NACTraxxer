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
    <div className={cn("flex border-b border-cyber-primary/20 bg-black/20 backdrop-blur-sm relative", className)}>
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "cyber-tab relative z-10",
              isActive ? "active text-cyber-primary" : "text-muted-foreground hover:text-cyber-primary",
            )}
          >
            {/* Cyberpunk hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/10 to-cyber-primary/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />

            <div className="relative z-10 flex items-center">
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {tab.label}
            </div>

            {/* Active indicator with glow */}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-primary glow-cyber-primary" />}
          </button>
        )
      })}

      {/* Animated scan line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-secondary to-transparent opacity-50 animate-pulse" />
    </div>
  )
}
