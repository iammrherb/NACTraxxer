'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Palette, RotateCcw, Download } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [colors, setColors] = useState({
    primary: '#1a73e8',
    planned: '#17a2b8',
    inProgress: '#ff9800',
    complete: '#0f9d58',
    delayed: '#d93025'
  })

  const updateColor = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }))
    
    // Apply the color to CSS custom properties
    const root = document.documentElement
    switch (colorKey) {
      case 'primary':
        root.style.setProperty('--primary', value)
        break
      case 'planned':
        root.style.setProperty('--chart-planned', value)
        break
      case 'inProgress':
        root.style.setProperty('--chart-in-progress', value)
        break
      case 'complete':
        root.style.setProperty('--chart-complete', value)
        break
      case 'delayed':
        root.style.setProperty('--chart-delayed', value)
        break
    }
  }

  const resetColors = () => {
    const defaultColors = {
      primary: '#1a73e8',
      planned: '#17a2b8',
      inProgress: '#ff9800',
      complete: '#0f9d58',
      delayed: '#d93025'
    }
    
    setColors(defaultColors)
    
    // Reset CSS custom properties
    const root = document.documentElement
    root.style.setProperty('--primary', defaultColors.primary)
    root.style.setProperty('--chart-planned', defaultColors.planned)
    root.style.setProperty('--chart-in-progress', defaultColors.inProgress)
    root.style.setProperty('--chart-complete', defaultColors.complete)
    root.style.setProperty('--chart-delayed', defaultColors.delayed)
  }

  const exportTheme = () => {
    const themeConfig = {
      name: 'Custom Portnox Theme',
      colors: colors,
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-theme-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-6 w-6 text-blue-600" />
              <span>Customize Theme Colors</span>
            </div>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="primary-color"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{colors.primary}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="planned-color">Planned Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="planned-color"
                  type="color"
                  value={colors.planned}
                  onChange={(e) => updateColor('planned', e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{colors.planned}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="progress-color">In Progress Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="progress-color"
                  type="color"
                  value={colors.inProgress}
                  onChange={(e) => updateColor('inProgress', e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{colors.inProgress}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="complete-color">Complete Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="complete-color"
                  type="color"
                  value={colors.complete}
                  onChange={(e) => updateColor('complete', e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{colors.complete}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="delayed-color">Delayed Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="delayed-color"
                  type="color"
                  value={colors.delayed}
                  onChange={(e) => updateColor('delayed', e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{colors.delayed}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetColors}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
