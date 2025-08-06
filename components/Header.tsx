'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar'
import { Settings, Users, Upload, Download, Save, Palette, Bell, Search, Menu } from 'lucide-react'

interface HeaderProps {
  onUserManagement: () => void
  onThemeCustomizer: () => void
}

export function Header({ onUserManagement, onThemeCustomizer }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Portnox NAC Designer
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Architecture & Deployment Platform
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              v2.1.0
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search configurations, policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

            <Button 
              variant="ghost" 
              size="sm"
              onClick={onThemeCustomizer}
              className="hidden lg:flex"
            >
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={onUserManagement}
              className="hidden lg:flex"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            {/* User Avatar */}
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <AvatarInitials name="John Doe" />
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
