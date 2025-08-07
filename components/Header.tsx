'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload, Users, Palette, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import UserManagementModal from '@/components/UserManagementModal'
import ThemeCustomizer from '@/components/ThemeCustomizer'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [customerLogo, setCustomerLogo] = useState('https://ahorrainvierte.com/wp-content/uploads/abm-industries-inc.png')

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

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                  alt="Portnox Logo" 
                  className="h-12 filter brightness-0 invert drop-shadow-md hover:scale-105 transition-transform"
                />
                <Separator orientation="vertical" className="h-10 bg-white/30" />
                <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <img 
                    src={customerLogo || "/placeholder.svg"} 
                    alt="ABM Industries Logo" 
                    className="h-10 max-w-[150px] object-contain"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold">
                Zero Trust NAC Architecture Designer
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

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/20"
              >
                {getThemeIcon()}
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
