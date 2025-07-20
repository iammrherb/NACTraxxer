"use client"
import { useState } from "react"
import { Moon, Sun, Users, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"

interface HeaderProps {
  onManageUsers: () => void
}

export function Header({ onManageUsers }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [showThemeOptions, setShowThemeOptions] = useState(false)

  return (
    <header className="bg-slate-900 text-white shadow-lg relative border-b-2 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"
                alt="Portnox Logo"
                width={180}
                height={45}
                className="h-12 w-auto filter drop-shadow-lg"
                priority
              />
            </div>
            <div className="hidden md:block">
              <div className="text-lg font-semibold text-gray-200">Network Access Control</div>
              <div className="text-xs text-blue-300 tracking-wider">Zero Trust Security Platform</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center hidden lg:block">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-md">
              Master Deployment Plan
            </h1>
            <p className="text-sm text-blue-200">Deployment & Use Case Tracker</p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
              <Sun className="h-5 w-5 text-yellow-400" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-blue-500"
              />
              <Moon className="h-5 w-5 text-blue-300" />
            </div>

            {/* Manage Users */}
            <Button
              variant="outline"
              size="sm"
              onClick={onManageUsers}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Manage Users</span>
            </Button>

            {/* Theme Customization */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeOptions(!showThemeOptions)}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Customize</span>
              </Button>

              {showThemeOptions && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-4 z-50">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Theme Colors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Primary</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border-gray-300 dark:border-slate-600"
                        defaultValue="#3b82f6"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Success</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border-gray-300 dark:border-slate-600"
                        defaultValue="#10b981"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Warning</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border-gray-300 dark:border-slate-600"
                        defaultValue="#f59e0b"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Danger</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border-gray-300 dark:border-slate-600"
                        defaultValue="#ef4444"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
