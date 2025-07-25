"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Library, Settings, BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/projects", icon: Package, label: "Projects" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/settings/users", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive =
              href === "/"
                ? pathname === href
                : pathname.startsWith(href) || (href === "/settings/users" && pathname.startsWith("/settings"))
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                      { "bg-accent text-accent-foreground": isActive },
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>
    </aside>
  )
}
