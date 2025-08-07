'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, RotateCcw, Download, Upload } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [selectedPreset, setSelectedPreset] = useState('default')
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a'
  })

  const colorPresets = [
    {
      id: 'default',
      name: 'Default Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#0f172a'
      }
    },
    {
      id: 'portnox',
      name: 'Portnox Brand',
      colors: {
        primary: '#0066cc',
        secondary: '#4a5568',
        accent: '#ed8936',
        background: '#f7fafc',
        foreground: '#1a202c'
      }
    },
    {
      id: 'forest',
      name: 'Forest Green',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#d97706',
        background: '#f9fafb',
        foreground: '#111827'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      colors: {
        primary: '#ea580c',
        secondary: '#6b7280',
        accent: '#7c3aed',
        background: '#fefefe',
        foreground: '#1f2937'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      colors: {
        primary: '#6366f1',
        secondary: '#94a3b8',
        accent: '#f59e0b',
        background: '#0f172a',
        foreground: '#f1f5f9'
      }
    },
    {
      id: 'corporate',
      name: 'Corporate Gray',
      colors: {
        primary: '#374151',
        secondary: '#9ca3af',
        accent: '#3b82f6',
        background: '#f9fafb',
        foreground: '#111827'
      }
    }
  ]

  const applyPreset = (presetId: string) => {
    const preset = colorPresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setCustomColors(preset.colors)
      applyColorsToDocument(preset.colors)
    }
  }

  const applyColorsToDocument = (colors: typeof customColors) => {
    const root = document.documentElement
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--background', colors.background)
    root.style.setProperty('--foreground', colors.foreground)
  }

  const handleColorChange = (colorKey: keyof typeof customColors, value: string) => {
    const newColors = { ...customColors, [colorKey]: value }
    setCustomColors(newColors)
    applyColorsToDocument(newColors)
    setSelectedPreset('custom')
  }

  const resetToDefault = () => {
    applyPreset('default')
  }

  const exportTheme = () => {
    const themeData = {
      preset: selectedPreset,
      colors: customColors,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(themeData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `theme-${selectedPreset}-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string)
          if (themeData.colors) {
            setCustomColors(themeData.colors)
            setSelectedPreset(themeData.preset || 'custom')
            applyColorsToDocument(themeData.colors)
          }
        } catch (error) {
          console.error('Invalid theme file:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Color Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Colors</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorPresets.map((preset) => (
                <Card 
                  key={preset.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPreset === preset.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => applyPreset(preset.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{preset.name}</h4>
                      <div className="flex space-x-1">
                        {Object.values(preset.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id={key}
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg" style={{ 
                  backgroundColor: customColors.background,
                  color: customColors.foreground 
                }}>
                  <h3 className="text-lg font-semibold mb-2">Sample Content</h3>
                  <p className="mb-4">This is how your theme will look in the application.</p>
                  
                  <div className="flex space-x-2 mb-4">
                    <button 
                      className="px-4 py-2 rounded text-white"
                      style={{ backgroundColor: customColors.primary }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded text-white"
                      style={{ backgroundColor: customColors.secondary }}
                    >
                      Secondary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded text-white"
                      style={{ backgroundColor: customColors.accent }}
                    >
                      Accent Button
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded text-center text-white" style={{ backgroundColor: customColors.primary }}>
                      Primary
                    </div>
                    <div className="p-2 rounded text-center text-white" style={{ backgroundColor: customColors.secondary }}>
                      Secondary
                    </div>
                    <div className="p-2 rounded text-center text-white" style={{ backgroundColor: customColors.accent }}>
                      Accent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportTheme}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                id="theme-import"
                accept=".json"
                onChange={importTheme}
                className="hidden"
              />
              <label htmlFor="theme-import">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>
            </div>
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
