'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Palette, Upload, RotateCcw } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#64748b')
  const [accentColor, setAccentColor] = useState('#8b5cf6')
  const [fontSize, setFontSize] = useState([16])
  const [borderRadius, setBorderRadius] = useState([8])
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  const colorPresets = [
    { name: 'Default Blue', primary: '#3b82f6', secondary: '#64748b', accent: '#8b5cf6' },
    { name: 'Portnox Green', primary: '#059669', secondary: '#6b7280', accent: '#0891b2' },
    { name: 'Corporate Purple', primary: '#7c3aed', secondary: '#64748b', accent: '#dc2626' },
    { name: 'Professional Gray', primary: '#374151', secondary: '#6b7280', accent: '#f59e0b' }
  ]

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setAccentColor(preset.accent)
  }

  const resetToDefaults = () => {
    setPrimaryColor('#3b82f6')
    setSecondaryColor('#64748b')
    setAccentColor('#8b5cf6')
    setFontSize([16])
    setBorderRadius([8])
    setDarkMode(false)
    setCompactMode(false)
  }

  const exportTheme = () => {
    const theme = {
      primaryColor,
      secondaryColor,
      accentColor,
      fontSize: fontSize[0],
      borderRadius: borderRadius[0],
      darkMode,
      compactMode,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-theme-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-6 w-6 text-blue-600" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="accent-color"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Color Presets */}
                <div>
                  <Label className="text-sm font-medium">Color Presets</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {colorPresets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="justify-start"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <span className="text-xs">{preset.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography & Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Typography & Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Font Size</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">12px</span>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={20}
                      min={12}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">20px</span>
                    <span className="text-sm font-medium min-w-[40px]">{fontSize[0]}px</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Border Radius</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">0px</span>
                    <Slider
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                      max={16}
                      min={0}
                      step={2}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">16px</span>
                    <span className="text-sm font-medium min-w-[40px]">{borderRadius[0]}px</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
                    <p className="text-xs text-gray-600">Enable dark theme for better visibility in low light</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode" className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-gray-600">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
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
              <div 
                className="p-4 border rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  color: darkMode ? '#f9fafb' : '#111827',
                  fontSize: `${fontSize[0]}px`,
                  borderRadius: `${borderRadius[0]}px`
                }}
              >
                <div className="space-y-3">
                  <h3 
                    className="font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Sample Architecture Component
                  </h3>
                  <p className="text-sm" style={{ color: secondaryColor }}>
                    This is how your customized theme will look in the application.
                  </p>
                  <div className="flex space-x-2">
                    <div 
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ 
                        backgroundColor: primaryColor,
                        borderRadius: `${borderRadius[0]}px`
                      }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ 
                        backgroundColor: accentColor,
                        borderRadius: `${borderRadius[0]}px`
                      }}
                    >
                      Accent Button
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportTheme}>
              <Upload className="h-4 w-4 mr-2" />
              Export Theme
            </Button>
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
