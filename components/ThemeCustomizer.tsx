'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Palette, Download, Upload, RotateCcw, Eye, Paintbrush, Settings } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  fontSize: number
  spacing: number
  darkMode: boolean
  animations: boolean
  compactMode: boolean
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    primaryColor: '#00c8d7',
    secondaryColor: '#0099cc',
    accentColor: '#007acc',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    fontSize: 14,
    spacing: 16,
    darkMode: false,
    animations: true,
    compactMode: false
  })

  const [previewMode, setPreviewMode] = useState(false)

  const presetThemes = [
    {
      name: 'Portnox Default',
      config: {
        primaryColor: '#00c8d7',
        secondaryColor: '#0099cc',
        accentColor: '#007acc',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: 8,
        fontSize: 14,
        spacing: 16,
        darkMode: false,
        animations: true,
        compactMode: false
      }
    },
    {
      name: 'Ocean Blue',
      config: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#0284c7',
        accentColor: '#0369a1',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        borderRadius: 12,
        fontSize: 14,
        spacing: 16,
        darkMode: false,
        animations: true,
        compactMode: false
      }
    },
    {
      name: 'Forest Green',
      config: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        accentColor: '#065f46',
        backgroundColor: '#f0fdf4',
        textColor: '#14532d',
        borderRadius: 6,
        fontSize: 14,
        spacing: 16,
        darkMode: false,
        animations: true,
        compactMode: false
      }
    },
    {
      name: 'Dark Professional',
      config: {
        primaryColor: '#6366f1',
        secondaryColor: '#4f46e5',
        accentColor: '#4338ca',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        borderRadius: 8,
        fontSize: 14,
        spacing: 16,
        darkMode: true,
        animations: true,
        compactMode: false
      }
    },
    {
      name: 'Minimal Light',
      config: {
        primaryColor: '#374151',
        secondaryColor: '#4b5563',
        accentColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        borderRadius: 4,
        fontSize: 13,
        spacing: 12,
        darkMode: false,
        animations: false,
        compactMode: true
      }
    }
  ]

  const handleApplyTheme = (config: ThemeConfig) => {
    setThemeConfig(config)
    applyThemeToDocument(config)
    showNotification('Theme applied successfully!', 'success')
  }

  const handleSaveTheme = () => {
    localStorage.setItem('portnox-theme-config', JSON.stringify(themeConfig))
    applyThemeToDocument(themeConfig)
    showNotification('Theme saved successfully!', 'success')
  }

  const handleResetTheme = () => {
    const defaultTheme = presetThemes[0].config
    setThemeConfig(defaultTheme)
    applyThemeToDocument(defaultTheme)
    localStorage.removeItem('portnox-theme-config')
    showNotification('Theme reset to default!', 'success')
  }

  const handleExportTheme = () => {
    const exportData = {
      theme: themeConfig,
      exportDate: new Date().toISOString(),
      version: '20.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-theme-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    showNotification('Theme exported successfully!', 'success')
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        if (importData.theme) {
          setThemeConfig(importData.theme)
          applyThemeToDocument(importData.theme)
          showNotification('Theme imported successfully!', 'success')
        }
      } catch (error) {
        showNotification('Failed to import theme file!', 'error')
      }
    }
    reader.readAsText(file)
  }

  const applyThemeToDocument = (config: ThemeConfig) => {
    const root = document.documentElement
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', config.primaryColor)
    root.style.setProperty('--secondary-color', config.secondaryColor)
    root.style.setProperty('--accent-color', config.accentColor)
    root.style.setProperty('--background-color', config.backgroundColor)
    root.style.setProperty('--text-color', config.textColor)
    root.style.setProperty('--border-radius', `${config.borderRadius}px`)
    root.style.setProperty('--font-size', `${config.fontSize}px`)
    root.style.setProperty('--spacing', `${config.spacing}px`)
    
    // Apply dark mode
    if (config.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply animations
    if (!config.animations) {
      root.style.setProperty('--animation-duration', '0s')
    } else {
      root.style.setProperty('--animation-duration', '0.3s')
    }
    
    // Apply compact mode
    if (config.compactMode) {
      root.classList.add('compact')
    } else {
      root.classList.remove('compact')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-[#00c8d7]" />
              <span>Theme Customizer</span>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportTheme}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTheme}
                  className="hidden"
                  id="theme-import"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('theme-import')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Brand Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="primary-color"
                        type="color"
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          primaryColor: e.target.value
                        })}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          primaryColor: e.target.value
                        })}
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
                        value={themeConfig.secondaryColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          secondaryColor: e.target.value
                        })}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={themeConfig.secondaryColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          secondaryColor: e.target.value
                        })}
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
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          accentColor: e.target.value
                        })}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          accentColor: e.target.value
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Background & Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="background-color"
                        type="color"
                        value={themeConfig.backgroundColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          backgroundColor: e.target.value
                        })}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={themeConfig.backgroundColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          backgroundColor: e.target.value
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="text-color"
                        type="color"
                        value={themeConfig.textColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          textColor: e.target.value
                        })}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={themeConfig.textColor}
                        onChange={(e) => setThemeConfig({
                          ...themeConfig,
                          textColor: e.target.value
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={themeConfig.darkMode}
                      onCheckedChange={(checked) => setThemeConfig({
                        ...themeConfig,
                        darkMode: checked
                      })}
                    />
                    <Label>Dark Mode</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spacing & Sizing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Border Radius: {themeConfig.borderRadius}px</Label>
                    <Slider
                      value={[themeConfig.borderRadius]}
                      onValueChange={([value]) => setThemeConfig({
                        ...themeConfig,
                        borderRadius: value
                      })}
                      max={20}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Font Size: {themeConfig.fontSize}px</Label>
                    <Slider
                      value={[themeConfig.fontSize]}
                      onValueChange={([value]) => setThemeConfig({
                        ...themeConfig,
                        fontSize: value
                      })}
                      max={20}
                      min={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Spacing: {themeConfig.spacing}px</Label>
                    <Slider
                      value={[themeConfig.spacing]}
                      onValueChange={([value]) => setThemeConfig({
                        ...themeConfig,
                        spacing: value
                      })}
                      max={32}
                      min={8}
                      step={2}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interface Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={themeConfig.animations}
                      onCheckedChange={(checked) => setThemeConfig({
                        ...themeConfig,
                        animations: checked
                      })}
                    />
                    <Label>Enable Animations</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={themeConfig.compactMode}
                      onCheckedChange={(checked) => setThemeConfig({
                        ...themeConfig,
                        compactMode: checked
                      })}
                    />
                    <Label>Compact Mode</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presetThemes.map((preset, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preset.config.primaryColor }}
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preset.config.secondaryColor }}
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preset.config.accentColor }}
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {preset.config.darkMode && (
                          <Badge variant="outline">Dark</Badge>
                        )}
                        {preset.config.compactMode && (
                          <Badge variant="outline">Compact</Badge>
                        )}
                        {!preset.config.animations && (
                          <Badge variant="outline">No Animations</Badge>
                        )}
                      </div>

                      <Button
                        onClick={() => handleApplyTheme(preset.config)}
                        className="w-full"
                        size="sm"
                      >
                        <Paintbrush className="h-4 w-4 mr-2" />
                        Apply Theme
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Custom CSS Variables</Label>
                    <textarea
                      className="w-full h-32 p-3 border rounded-md font-mono text-sm mt-2"
                      placeholder="--custom-property: value;"
                      defaultValue={`--primary-color: ${themeConfig.primaryColor};
--secondary-color: ${themeConfig.secondaryColor};
--accent-color: ${themeConfig.accentColor};
--background-color: ${themeConfig.backgroundColor};
--text-color: ${themeConfig.textColor};`}
                    />
                  </div>
                  
                  <div>
                    <Label>Theme Configuration JSON</Label>
                    <textarea
                      className="w-full h-32 p-3 border rounded-md font-mono text-sm mt-2"
                      value={JSON.stringify(themeConfig, null, 2)}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleResetTheme}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTheme}
              className="bg-[#00c8d7] hover:bg-[#0099cc]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Apply & Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
