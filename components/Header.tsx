"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Moon, Sun, Upload, Download, Save, Play, Palette, Zap } from "lucide-react"
import UserManagementModal from "./UserManagementModal"
import ThemeCustomizer from "./ThemeCustomizer"

interface HeaderProps {
  currentTab: string
  onTabChange: (tab: string) => void
  onThemeToggle: () => void
  isDarkMode: boolean
  customerLogo?: string
  onLogoUpload: (file: File) => void
}

export default function Header({
  currentTab,
  onTabChange,
  onThemeToggle,
  isDarkMode,
  customerLogo,
  onLogoUpload,
}: HeaderProps) {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onLogoUpload(file)
    }
  }

  const handleExport = () => {
    // Export current configuration
    const config = {
      timestamp: new Date().toISOString(),
      currentTab,
      theme: isDarkMode ? "dark" : "light",
      customerLogo,
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portnox-nac-config-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    // Save to localStorage
    const config = {
      currentTab,
      theme: isDarkMode ? "dark" : "light",
      customerLogo,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem("portnox-nac-config", JSON.stringify(config))

    // Show success notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    notification.textContent = "Configuration saved successfully!"
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  const handleDeploy = () => {
    // Simulate deployment process
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    notification.textContent = "Starting deployment process..."
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.textContent = "Deployment initiated successfully!"
      notification.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    }, 2000)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 5000)
  }

  return (
    <>
      <header className="cyber-header relative overflow-hidden">
        {/* Cyberpunk scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-30 animate-pulse"
            style={{ top: "20%", animationDelay: "0s" }}
          />
          <div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-secondary to-transparent opacity-20 animate-pulse"
            style={{ top: "60%", animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative bg-black/50 p-2 rounded-lg border border-cyber-primary/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/10 to-cyber-secondary/10 rounded-lg" />
                  <img
                    src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"
                    alt="Portnox"
                    className="h-8 w-auto relative z-10 filter brightness-0 invert"
                  />
                  <div className="absolute inset-0 rounded-lg glow-cyber-primary opacity-50" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-cyber-primary glow-cyber-primary">NAC Designer</h1>
                  <p className="text-sm text-cyber-accent/80 font-mono">Zero Trust Architecture v2.0</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-8">
                <div className="relative bg-black/30 p-2 rounded-lg border border-cyber-secondary/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-secondary/10 to-cyber-accent/10 rounded-lg" />
                  <img
                    src={
                      customerLogo ||
                      "https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true"
                    }
                    alt="Customer Logo"
                    className="h-8 w-auto max-w-[120px] relative z-10"
                  />
                </div>
                <div>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cyber-button text-cyber-primary hover:text-cyber-primary"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Logo
                      </span>
                    </Button>
                  </label>
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className="cyber-badge-secondary font-mono">
                <Zap className="w-3 h-3 mr-1" />
                Version 20.0
              </Badge>

              <Button variant="ghost" size="sm" onClick={handleExport} className="cyber-button">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>

              <Button variant="ghost" size="sm" onClick={handleSave} className="cyber-button">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>

              <Button variant="ghost" size="sm" onClick={handleDeploy} className="cyber-button glow-cyber-accent">
                <Play className="w-4 h-4 mr-1" />
                Deploy
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowUserManagement(true)} className="cyber-button">
                <Users className="w-4 h-4 mr-1" />
                Users
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowThemeCustomizer(true)} className="cyber-button">
                <Palette className="w-4 h-4 mr-1" />
                Theme
              </Button>

              <Button variant="ghost" size="sm" onClick={onThemeToggle} className="cyber-button">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <UserManagementModal isOpen={showUserManagement} onClose={() => setShowUserManagement(false)} />

      <ThemeCustomizer isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />
    </>
  )
}
