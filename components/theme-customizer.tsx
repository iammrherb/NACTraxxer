'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Download, Upload, RotateCcw } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    border: '#E5E7EB'
  })

  const [typography, setTypography] = useState({
    fontSize: 14,
    fontFamily: 'Inter',
    lineHeight: 1.5,
    fontWeight: 400
  })

  const [layout, setLayout] = useState({
    borderRadius: 8,
    spacing: 16,
    shadowIntensity: 0.1,
    animationSpeed: 1
  })

  const [darkMode, setDarkMode] = useState(false)

  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }))
  }

  const handleTypographyChange = (key: string, value: number | string) => {
    setTypography(prev => ({ ...prev, [key]: value }))
  }

  const handleLayoutChange = (key: string, value: number) => {
    setLayout(prev => ({ ...prev, [key]: value }))
  }

  const handleExportTheme = () => {
    const theme = {
      colors,
      typography,
      layout,
      darkMode
    }
    
    const dataStr = JSON.stringify(theme, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'nac-designer-theme.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const theme = JSON.parse(e.target?.result as string)
          setColors(theme.colors || colors)
          setTypography(theme.typography || typography)
          setLayout(theme.layout || layout)
          setDarkMode(theme.darkMode || false)
        } catch (error) {
          console.error('Invalid theme file:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleResetTheme = () => {
    setColors({
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      border: '#E5E7EB'
    })
    setTypography({
      fontSize: 14,
      fontFamily: 'Inter',
      lineHeight: 1.5,
      fontWeight: 400
    })
    setLayout({
      borderRadius: 8,
      spacing: 16,
      shadowIntensity: 0.1,
      animationSpeed: 1
    })
    setDarkMode(false)
  }

  const applyTheme = () => {
    // Apply theme to CSS custom properties
    const root = document.documentElement
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    root.style.setProperty('--font-size-base', `${typography.fontSize}px`)
    root.style.setProperty('--font-family', typography.fontFamily)
    root.style.setProperty('--line-height', typography.lineHeight.toString())
    root.style.setProperty('--font-weight', typography.fontWeight.toString())
    
    root.style.setProperty('--border-radius', `${layout.borderRadius}px`)
    root.style.setProperty('--spacing-base', `${layout.spacing}px`)
    root.style.setProperty('--shadow-intensity', layout.shadowIntensity.toString())
    root.style.setProperty('--animation-speed', `${layout.animationSpeed}s`)
    
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
          <DialogDescription>
            Customize the appearance and styling of the NAC Architecture Designer
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>
                  Customize the color scheme for your architecture designer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primary"
                        type="color"
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondary"
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="accent"
                        type="color"
                        value={colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="background"
                        type="color"
                        value={colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="dark-mode">Enable Dark Mode</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography Settings</CardTitle>
                <CardDescription>
                  Adjust font settings and text appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Font Size: {typography.fontSize}px</Label>
                  <Slider
                    value={[typography.fontSize]}
                    onValueChange={(value) => handleTypographyChange('fontSize', value[0])}
                    min={12}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Line Height: {typography.lineHeight}</Label>
                  <Slider
                    value={[typography.lineHeight]}
                    onValueChange={(value) => handleTypographyChange('lineHeight', value[0])}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Weight: {typography.fontWeight}</Label>
                  <Slider
                    value={[typography.fontWeight]}
                    onValueChange={(value) => handleTypographyChange('fontWeight', value[0])}
                    min={300}
                    max={700}
                    step={100}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
                <CardDescription>
                  Customize spacing, borders, and visual effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Border Radius: {layout.borderRadius}px</Label>
                  <Slider
                    value={[layout.borderRadius]}
                    onValueChange={(value) => handleLayoutChange('borderRadius', value[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Spacing: {layout.spacing}px</Label>
                  <Slider
                    value={[layout.spacing]}
                    onValueChange={(value) => handleLayoutChange('spacing', value[0])}
                    min={8}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Shadow Intensity: {layout.shadowIntensity}</Label>
                  <Slider
                    value={[layout.shadowIntensity]}
                    onValueChange={(value) => handleLayoutChange('shadowIntensity', value[0])}
                    min={0}
                    max={0.5}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Animation Speed: {layout.animationSpeed}s</Label>
                  <Slider
                    value={[layout.animationSpeed]}
                    onValueChange={(value) => handleLayoutChange('animationSpeed', value[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Preview</CardTitle>
                <CardDescription>
                  Preview how your customizations will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: `${layout.borderRadius}px`
                  }}
                >
                  <div className="space-y-4">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ 
                        color: colors.text,
                        fontSize: `${typography.fontSize + 4}px`,
                        fontWeight: typography.fontWeight + 200,
                        lineHeight: typography.lineHeight
                      }}
                    >
                      Sample Architecture Component
                    </h3>
                    
                    <div className="flex space-x-2">
                      <div 
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ 
                          backgroundColor: colors.primary,
                          borderRadius: `${layout.borderRadius / 2}px`
                        }}
                      >
                        Primary
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ 
                          backgroundColor: colors.secondary,
                          borderRadius: `${layout.borderRadius / 2}px`
                        }}
                      >
                        Secondary
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ 
                          backgroundColor: colors.accent,
                          borderRadius: `${layout.borderRadius / 2}px`
                        }}
                      >
                        Accent
                      </div>
                    </div>
                    
                    <p 
                      style={{ 
                        color: colors.text,
                        fontSize: `${typography.fontSize}px`,
                        lineHeight: typography.lineHeight,
                        fontWeight: typography.fontWeight
                      }}
                    >
                      This is a preview of how text will appear with your current typography settings. 
                      The spacing and visual elements will reflect your layout customizations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="file"
                id="import-theme"
                accept=".json"
                onChange={handleImportTheme}
                className="hidden"
              />
              <label
                htmlFor="import-theme"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
              >
                <Upload className="h-4 w-4" />
                <span>Import Theme</span>
              </label>
            </div>
            
            <Button variant="outline" onClick={handleExportTheme}>
              <Download className="h-4 w-4 mr-2" />
              Export Theme
            </Button>
            
            <Button variant="outline" onClick={handleResetTheme}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={applyTheme}>
              Apply Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
