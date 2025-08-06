'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarInitials } from '@/components/ui/avatar'
import { Users, Palette, Upload, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

interface HeaderProps {
  onUserManagement: () => void
  onThemeCustomizer: () => void
}

export default function Header({ onUserManagement, onThemeCustomizer }: HeaderProps) {
  const { theme, setTheme } = useTheme()
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

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <img 
                src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                alt="Portnox Logo" 
                className="h-12 filter brightness-0 invert drop-shadow-md hover:scale-105 transition-transform"
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
            <div>
              <h1 className="text-2xl font-bold">Zero Trust NAC Architecture Designer</h1>
              <p className="text-blue-100 text-sm">Enterprise Network Access Control Platform</p>
            </div>
          </div>
          
          {/* Controls */}
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
              onClick={onUserManagement}
              className="text-white hover:bg-white/20"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeCustomizer}
              className="text-white hover:bg-white/20"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-white/20"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarInitials name="Admin User" />
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
