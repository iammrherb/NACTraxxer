'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, RotateCcw } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [secondaryColor, setSecondaryColor] = useState('#64748b')
  const [accentColor, setAccentColor] = useState('#0ea5e9')
  const [successColor, setSuccessColor] = useState('#10b981')
  const [warningColor, setWarningColor] = useState('#f59e0b')
  const [errorColor, setErrorColor] = useState('#ef4444')

  const colorPresets = [
    { name: 'Default Blue', primary: '#2563eb', secondary: '#64748b', accent: '#0ea5e9' },
    { name: 'Purple', primary: '#7c3aed', secondary: '#64748b', accent: '#a855f7' },
    { name: 'Green', primary: '#059669', secondary: '#64748b', accent: '#10b981' },
    { name: 'Orange', primary: '#ea580c', secondary: '#64748b', accent: '#f97316' },
    { name: 'Pink', primary: '#db2777', secondary: '#64748b', accent: '#ec4899' },
    { name: 'Teal', primary: '#0d9488', secondary: '#64748b', accent: '#14b8a6' }
  ]

  const applyColors = () => {
    const root = document.documentElement
    root.style.setProperty('--primary', primaryColor)
    root.style.setProperty('--secondary', secondaryColor)
    root.style.setProperty('--accent', accentColor)
    root.style.setProperty('--success', successColor)
    root.style.setProperty('--warning', warningColor)
    root.style.setProperty('--error', errorColor)
  }

  const resetToDefaults = () => {
    setPrimaryColor('#2563eb')
    setSecondaryColor('#64748b')
    setAccentColor('#0ea5e9')
    setSuccessColor('#10b981')
    setWarningColor('#f59e0b')
    setErrorColor('#ef4444')
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setAccentColor(preset.accent)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Color Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-12 justify-start"
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span>{preset.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primary"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="secondary"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="accent"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{accentColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="success">Success Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="success"
                      value={successColor}
                      onChange={(e) => setSuccessColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{successColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="warning">Warning Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="warning"
                      value={warningColor}
                      onChange={(e) => setWarningColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{warningColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="error">Error Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="error"
                      value={errorColor}
                      onChange={(e) => setErrorColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm font-mono">{errorColor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button style={{ backgroundColor: primaryColor, color: 'white' }}>
                    Primary Button
                  </Button>
                  <Button variant="outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>
                    Secondary Button
                  </Button>
                  <Button style={{ backgroundColor: accentColor, color: 'white' }}>
                    Accent Button
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: successColor }}
                  >
                    Success
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: warningColor }}
                  >
                    Warning
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: errorColor }}
                  >
                    Error
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={applyColors}>
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
