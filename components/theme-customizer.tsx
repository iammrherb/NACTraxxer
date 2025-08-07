'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Palette, Upload, Download, RotateCcw, Eye, Settings, Moon, Sun } from 'lucide-react'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontSize: number
  borderRadius: number
  darkMode: boolean
  compactMode: boolean
  customLogo?: string
}

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState('colors')
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    fontSize: 14,
    borderRadius: 8,
    darkMode: false,
    compactMode: false
  })

  const colorPresets = [
    {
      name: 'Portnox Blue',
      primary: '#0066cc',
      secondary: '#64748b',
      accent: '#10b981'
    },
    {
      name: 'Corporate Gray',
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6'
    },
    {
      name: 'Healthcare Green',
      primary: '#059669',
      secondary: '#64748b',
      accent: '#3b82f6'
    },
    {
      name: 'Financial Blue',
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    {
      name: 'Tech Purple',
      primary: '#7c3aed',
      secondary: '#64748b',
      accent: '#06b6d4'
    },
    {
      name: 'Modern Orange',
      primary: '#ea580c',
      secondary: '#64748b',
      accent: '#10b981'
    }
  ]

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor' | 'accentColor', value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      [colorType]: value
    }))
  }

  const handleSliderChange = (setting: 'fontSize' | 'borderRadius', value: number[]) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value[0]
    }))
  }

  const handleSwitchChange = (setting: 'darkMode' | 'compactMode', value: boolean) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }))
  }

  const resetToDefaults = () => {
    setThemeSettings({
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#10b981',
      fontSize: 14,
      borderRadius: 8,
      darkMode: false,
      compactMode: false
    })
  }

  const exportTheme = () => {
    const themeData = JSON.stringify(themeSettings, null, 2)
    const blob = new Blob([themeData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string)
          setThemeSettings(importedTheme)
        } catch (error) {
          alert('Error importing theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThemeSettings(prev => ({
          ...prev,
          customLogo: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Presets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-3 flex items-center justify-between"
                          onClick={() => applyPreset(preset)}
                        >
                          <span className="font-medium">{preset.name}</span>
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          placeholder="#3b82f6"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          placeholder="#64748b"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={themeSettings.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          placeholder="#10b981"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Font Size: {themeSettings.fontSize}px</Label>
                      <Slider
                        value={[themeSettings.fontSize]}
                        onValueChange={(value) => handleSliderChange('fontSize', value)}
                        min={12}
                        max={18}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Small (12px)</span>
                        <span>Large (18px)</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Border Radius: {themeSettings.borderRadius}px</Label>
                      <Slider
                        value={[themeSettings.borderRadius]}
                        onValueChange={(value) => handleSliderChange('borderRadius', value)}
                        min={0}
                        max={16}
                        step={2}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Sharp (0px)</span>
                        <span>Rounded (16px)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable dark theme</p>
                      </div>
                      <Switch
                        checked={themeSettings.darkMode}
                        onCheckedChange={(value) => handleSwitchChange('darkMode', value)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                      </div>
                      <Switch
                        checked={themeSettings.compactMode}
                        onCheckedChange={(value) => handleSwitchChange('compactMode', value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Branding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Logo</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        {themeSettings.customLogo && (
                          <div className="flex items-center space-x-2">
                            <img
                              src={themeSettings.customLogo || "/placeholder.svg"}
                              alt="Custom logo"
                              className="h-8 w-8 object-contain"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setThemeSettings(prev => ({ ...prev, customLogo: undefined }))}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upload a custom logo to replace the default branding. Recommended size: 200x50px
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Live Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-4 border rounded-lg space-y-4"
                  style={{
                    fontSize: `${themeSettings.fontSize}px`,
                    borderRadius: `${themeSettings.borderRadius}px`,
                    backgroundColor: themeSettings.darkMode ? '#1f2937' : '#ffffff',
                    color: themeSettings.darkMode ? '#f9fafb' : '#111827'
                  }}
                >
                  {/* Header Preview */}
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center space-x-2">
                      {themeSettings.customLogo ? (
                        <img
                          src={themeSettings.customLogo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-6 w-auto"
                        />
                      ) : (
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: themeSettings.primaryColor }}
                        />
                      )}
                      <span className="font-semibold">NAC Designer</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {themeSettings.darkMode ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className="space-y-2">
                    <button
                      className="px-3 py-2 text-white font-medium rounded transition-colors"
                      style={{
                        backgroundColor: themeSettings.primaryColor,
                        borderRadius: `${themeSettings.borderRadius}px`
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-3 py-2 border font-medium rounded transition-colors"
                      style={{
                        borderColor: themeSettings.secondaryColor,
                        color: themeSettings.secondaryColor,
                        borderRadius: `${themeSettings.borderRadius}px`
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>

                  {/* Card Preview */}
                  <div 
                    className="p-3 border rounded"
                    style={{
                      borderRadius: `${themeSettings.borderRadius}px`,
                      borderColor: themeSettings.secondaryColor + '40'
                    }}
                  >
                    <h4 className="font-semibold mb-2">Sample Card</h4>
                    <p className="text-sm opacity-75">
                      This is how your content will look with the current theme settings.
                    </p>
                    <div 
                      className="mt-2 px-2 py-1 rounded text-xs inline-block"
                      style={{
                        backgroundColor: themeSettings.accentColor + '20',
                        color: themeSettings.accentColor,
                        borderRadius: `${themeSettings.borderRadius / 2}px`
                      }}
                    >
                      Accent Badge
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportTheme}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Theme
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('theme-import')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Theme
                </Button>
                <input
                  id="theme-import"
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetToDefaults}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                
                <Separator />
                
                <Button
                  className="w-full"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  Apply Theme
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
