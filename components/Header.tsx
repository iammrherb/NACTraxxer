'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useTheme } from 'next-themes'
import { Moon, Sun, Upload, Users, Palette, Settings, Shield, Download, Save } from 'lucide-react'

interface HeaderProps {
  onUserManagement: () => void
  onThemeCustomizer: () => void
}

export default function Header({ onUserManagement, onThemeCustomizer }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [logoUrl, setLogoUrl] = useState('')
  const [companyName, setCompanyName] = useState('ABM Industries')

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const exportConfiguration = () => {
    const config = {
      companyName,
      logoUrl,
      theme,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-config-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {logoUrl ? (
              <img src={logoUrl || "/placeholder.svg"} alt="Company Logo" className="h-10 w-auto" />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {companyName} - Zero Trust NAC Designer
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Portnox Architecture Planning & Deployment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportConfiguration}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Application Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-upload">Company Logo</Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onUserManagement}>
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>

            <Button variant="outline" size="sm" onClick={onThemeCustomizer}>
              <Palette className="h-4 w-4 mr-2" />
              Theme
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
