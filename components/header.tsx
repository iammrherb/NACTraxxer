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
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden border-b-4 border-blue-500">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-10 right-20 w-16 h-16 bg-green-400 rounded-full animate-bounce delay-1000 blur-lg"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-400 rounded-full animate-pulse delay-500 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-cyan-400 rounded-full animate-ping delay-2000 blur-lg"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-full mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center group">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-2xl animate-logo-in">
                <Image
                  src="https://www.portnox.com/wp-content/uploads/2023/07/Portnox-Logo-White-1.svg"
                  alt="Portnox Logo"
                  width={240}
                  height={60}
                  className="h-20 w-auto transition-all duration-300 group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(255,255,255,0.25)]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl blur-md -z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-20 rounded-xl animate-pulse"></div>
              </div>

              <div className="ml-6">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-200 via-white to-green-200 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                  Network Access Control
                </div>
                <div className="text-sm text-blue-100 animate-fade-in font-medium tracking-wide drop-shadow-md">
                  Zero Trust Security Platform
                </div>
              </div>
            </div>
          </div>

          <div className="text-center hidden lg:block group">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:drop-shadow-xl">
              Master Site Deployment Plan
            </h1>
            <div className="text-base text-blue-100 animate-fade-in font-medium tracking-wide drop-shadow-md mt-1 transition-all duration-300 ease-in-out group-hover:text-blue-50 group-hover:tracking-wider">
              Deployment & Use Case Tracker
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/15 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 shadow-lg">
              <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-180 text-yellow-200 drop-shadow-sm" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-blue-500"
              />
              <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12 text-blue-200 drop-shadow-sm" />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onManageUsers}
              className="bg-white/15 hover:bg-white/25 text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 shadow-lg px-4 py-2 h-auto"
            >
              <Users className="h-5 w-5 mr-2 drop-shadow-sm" />
              <span className="font-medium">Manage Users</span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThemeOptions(!showThemeOptions)}
                className="bg-white/15 hover:bg-white/25 text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 shadow-lg px-4 py-2 h-auto"
              >
                <Palette className="h-5 w-5 mr-2 drop-shadow-sm" />
                <span className="font-medium">Customize</span>
              </Button>

              {showThemeOptions && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/30 p-4 z-50 animate-fade-in">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Theme Colors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Primary</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border transition-all duration-300 hover:scale-110 shadow-md"
                        defaultValue="#3b82f6"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Success</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border transition-all duration-300 hover:scale-110 shadow-md"
                        defaultValue="#10b981"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Warning</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border transition-all duration-300 hover:scale-110 shadow-md"
                        defaultValue="#f59e0b"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Danger</label>
                      <input
                        type="color"
                        className="w-12 h-8 rounded border transition-all duration-300 hover:scale-110 shadow-md"
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

      <style jsx>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }

  @keyframes logo-in {
    from {
      opacity: 0;
      transform: translateX(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  .animate-logo-in {
    animation: logo-in 0.8s ease-out forwards;
  }
`}</style>
    </header>
  )
}
