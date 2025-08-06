'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, RotateCcw, Download, Upload } from 'lucide-react'

interface ThemeCustomizerProps {
  open: boolean
  onClose: () => void
}

export default function ThemeCustomizer({ open, onClose }: ThemeCustomizerProps) {
  const [colors, setColors] = useState({
    primary: '#1a73e8',
    secondary: '#6c757d',
    success: '#0f9d58',
    warning: '#f9ab00',
    danger: '#d93025',
    info: '#17a2b8'
  })

  const [spacing, setSpacing] = useState({
    borderRadius: [8],
    padding: [16],
    margin: [16]
  })

  const [typography, setTypography] = useState({
    fontSize: [14],
    lineHeight: [1.5],
    fontWeight: [400]
  })

  const updateColor = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }))
    // Apply color to CSS custom properties
    document.documentElement.style.setProperty(`--${colorKey}-color`, value)
  }

  const resetToDefaults = () => {
    const defaultColors = {
      primary: '#1a73e8',
      secondary: '#6c757d',
      success: '#0f9d58',
      warning: '#f9ab00',
      danger: '#d93025',
      info: '#17a2b8'
    }
    setColors(defaultColors)
    setSpacing({
      borderRadius: [8],
      padding: [16],
      margin: [16]
    })
    setTypography({
      fontSize: [14],
      lineHeight: [1.5],
      fontWeight: [400]
    })

    // Reset CSS custom properties
    Object.entries(defaultColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}-color`, value)
    })
  }

  const exportTheme = () => {
    const theme = {
      colors,
      spacing,
      typography,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-theme-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string)
        if (theme.colors) setColors(theme.colors)
        if (theme.spacing) setSpacing(theme.spacing)
        if (theme.typography) setTypography(theme.typography)

        // Apply imported colors
        Object.entries(theme.colors || {}).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}-color`, value as string)
        })
      } catch (error) {
        console.error('Invalid theme file:', error)
      }
    }
    reader.readAsText(file)
  }

  const ColorPicker = ({ label, colorKey, value }: { label: string, colorKey: string, value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={colorKey}>{label}</Label>
      <div className="flex items-center space-x-3">
        <input
          id={colorKey}
          type="color"
          value={value}
          onChange={(e) => updateColor(colorKey, e.target.value)}
          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => updateColor(colorKey, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
          />
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Customizer</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Color Palette</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={exportTheme}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                    id="import-theme"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="import-theme" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Primary Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ColorPicker label="Primary" colorKey="primary" value={colors.primary} />
                  <ColorPicker label="Secondary" colorKey="secondary" value={colors.secondary} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ColorPicker label="Success" colorKey="success" value={colors.success} />
                  <ColorPicker label="Warning" colorKey="warning" value={colors.warning} />
                  <ColorPicker label="Danger" colorKey="danger" value={colors.danger} />
                  <ColorPicker label="Info" colorKey="info" value={colors.info} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Border Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Border Radius: {spacing.borderRadius[0]}px</Label>
                    <Slider
                      value={spacing.borderRadius}
                      onValueChange={(value) => setSpacing(prev => ({ ...prev, borderRadius: value }))}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Padding & Margin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Padding: {spacing.padding[0]}px</Label>
                    <Slider
                      value={spacing.padding}
                      onValueChange={(value) => setSpacing(prev => ({ ...prev, padding: value }))}
                      max={32}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Margin: {spacing.margin[0]}px</Label>
                    <Slider
                      value={spacing.margin}
                      onValueChange={(value) => setSpacing(prev => ({ ...prev, margin: value }))}
                      max={32}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Font Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Font Size: {typography.fontSize[0]}px</Label>
                    <Slider
                      value={typography.fontSize}
                      onValueChange={(value) => setTypography(prev => ({ ...prev, fontSize: value }))}
                      min={12}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Line Height: {typography.lineHeight[0]}</Label>
                    <Slider
                      value={typography.lineHeight}
                      onValueChange={(value) => setTypography(prev => ({ ...prev, lineHeight: value }))}
                      min={1.2}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Font Weight: {typography.fontWeight[0]}</Label>
                    <Slider
                      value={typography.fontWeight}
                      onValueChange={(value) => setTypography(prev => ({ ...prev, fontWeight: value }))}
                      min={300}
                      max={700}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-4 border rounded"
                    style={{
                      fontSize: `${typography.fontSize[0]}px`,
                      lineHeight: typography.lineHeight[0],
                      fontWeight: typography.fontWeight[0]
                    }}
                  >
                    <h3 className="font-bold mb-2">Sample Heading</h3>
                    <p>This is a sample paragraph to demonstrate the typography settings. You can adjust the font size, line height, and font weight using the controls.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button style={{ backgroundColor: colors.primary }}>Primary Button</Button>
                    <Button variant="secondary" style={{ backgroundColor: colors.secondary }}>Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded" style={{ backgroundColor: colors.success, color: 'white' }}>
                      <div className="font-semibold">Success</div>
                      <div className="text-sm opacity-90">Operation completed</div>
                    </div>
                    <div className="p-4 rounded" style={{ backgroundColor: colors.warning, color: 'white' }}>
                      <div className="font-semibold">Warning</div>
                      <div className="text-sm opacity-90">Please review</div>
                    </div>
                    <div className="p-4 rounded" style={{ backgroundColor: colors.danger, color: 'white' }}>
                      <div className="font-semibold">Error</div>
                      <div className="text-sm opacity-90">Action required</div>
                    </div>
                    <div className="p-4 rounded" style={{ backgroundColor: colors.info, color: 'white' }}>
                      <div className="font-semibold">Info</div>
                      <div className="text-sm opacity-90">Additional details</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
