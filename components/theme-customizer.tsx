'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Palette, RotateCcw } from 'lucide-react'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-6 w-6 text-blue-600" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-12 text-muted-foreground">
          Theme customization functionality will be implemented here
        </div>
      </DialogContent>
    </Dialog>
  )
}
