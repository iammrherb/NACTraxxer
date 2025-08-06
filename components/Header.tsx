'use client'

import { useState } from 'react'
import { Sun, Moon, Users, Palette, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/components/ThemeProvider'
import UserManagementModal from './UserManagementModal'
import ThemeCustomizer from './ThemeCustomizer'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [customerLogo, setCustomerLogo] = useState('/placeholder.svg?height=40&width=150&text=ABM+Industries')

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomerLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <img 
                  src="/placeholder.svg?height=50&width=150&text=Portnox+Logo" 
                  alt="Portnox Logo" 
                  className="h-12 filter drop-shadow-md hover:scale-105 transition-transform"
                />
                <div className="h-10 w-px bg-white/30" />
                <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <img 
                    src={customerLogo || "/placeholder.svg"} 
                    alt="Customer Logo" 
                    className="h-10 max-w-[150px] object-contain"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-shadow">
                Portnox NAC Architecture Designer
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Change Logo</span>
                </label>
              </div>

              <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-blue-500"
                />
                <Moon className="h-4 w-4" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserModal(true)}
                className="text-white hover:bg-white/20"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThemeCustomizer(true)}
                className="text-white hover:bg-white/20"
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </header>

      <UserManagementModal 
        open={showUserModal} 
        onOpenChange={setShowUserModal} 
      />
      
      <ThemeCustomizer 
        open={showThemeCustomizer} 
        onOpenChange={setShowThemeCustomizer} 
      />
    </>
  )
}
