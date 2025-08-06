'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Moon, Sun, Settings, Download, Share2, Save, FileText, ImageIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Header() {
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

  const handleExport = (format: 'pdf' | 'png' | 'json') => {
    // Export functionality would be implemented here
    console.log(`Exporting as ${format}`)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Company Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt="Company Logo" className="h-12 w-12 object-contain rounded-lg" />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ABM</span>
                </div>
              )}
              <div>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="text-xl font-bold bg-transparent border-none p-0 h-auto focus:ring-0"
                  placeholder="Company Name"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">Portnox NAC Architecture Designer</p>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Project Status */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Active Project
                  </Badge>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    NAC Deployment Phase 1
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="hidden sm:flex"
              >
                <Upload className="h-4 w-4 mr-2" />
                Logo
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="hidden md:flex"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  className="rounded-r-none border-r"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('png')}
                  className="rounded-none border-r"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('json')}
                  className="rounded-l-none"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

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

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Project Summary Bar */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-6">
            <span>Sites: <strong className="text-gray-900 dark:text-gray-100">24</strong></span>
            <span>Completed: <strong className="text-green-600">18</strong></span>
            <span>In Progress: <strong className="text-yellow-600">4</strong></span>
            <span>Planned: <strong className="text-blue-600">2</strong></span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Last Updated: <strong>Today, 2:30 PM</strong></span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Version 2.1
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
