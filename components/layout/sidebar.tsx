"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, Building2, Library, BarChart3, Settings, LifeBuoy, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/sites", icon: Building2, label: "Sites" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/reporting", icon: BarChart3, label: "Reporting" },
  { href: "/automation", icon: Bot, label: "AI & Automation" },
]

const bottomNavItems = [
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
]

export function Sidebar() {
  const pathname = usePathname()

  const renderNavItem = (item: { href: string; icon: React.ElementType; label: string }) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              isActive && "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <img
              src="/placeholder-logo.svg"
              alt="Portnox Logo"
              className="h-5 w-5 transition-all group-hover:scale-110"
            />
            <span className="sr-only">Portnox</span>
          </Link>
          {navItems.map(renderNavItem)}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">{bottomNavItems.map(renderNavItem)}</nav>
      </aside>
    </TooltipProvider>
  )
}
