"use client"

import type React from "react"
import { useState } from "react"
import { Moon, Sun, Users, Palette, Upload } from "lucide-react"
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("Logo uploaded:", file.name)
    }
  }

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Image
                src="/placeholder.svg?height=50&width=150&text=Portnox"
                alt="Portnox Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <div className="h-10 w-px bg-white/30" />
            <div className="bg-white/10 rounded-lg p-2">
              <Image
                src="/placeholder.svg?height=40&width=120&text=Customer"
                alt="Customer Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold">Master Site Deployment Plan</h1>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Logo Upload */}
            <div className="relative">
              <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <label
                htmlFor="logo-upload"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Change Logo</span>
              </label>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              <Moon className="h-4 w-4" />
            </div>

            {/* Manage Users */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onManageUsers}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>

            {/* Theme Customization */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThemeOptions(!showThemeOptions)}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>

              {showThemeOptions && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-50">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Theme Colors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Primary</label>
                      <input type="color" className="w-12 h-8 rounded border" defaultValue="#3b82f6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Success</label>
                      <input type="color" className="w-12 h-8 rounded border" defaultValue="#10b981" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Warning</label>
                      <input type="color" className="w-12 h-8 rounded border" defaultValue="#f59e0b" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Danger</label>
                      <input type="color" className="w-12 h-8 rounded border" defaultValue="#ef4444" />
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
