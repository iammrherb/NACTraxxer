"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { UserNav } from "@/components/user-nav"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Image
              src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"
              alt="Portnox Logo"
              width={140}
              height={35}
              className="h-9 w-auto"
              priority
            />
          </a>
          <div className="w-px h-8 bg-muted-foreground/30" />
          <div className="ml-6">
            <h1 className="text-lg font-semibold text-foreground">Master Site Deployment Plan</h1>
            <p className="text-xs text-muted-foreground">Deployment & Use Case Tracker</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5" />
            <Switch
              id="theme-switcher"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-5 w-5" />
          </div>
          <NotificationsDropdown />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
