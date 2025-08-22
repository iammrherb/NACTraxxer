"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, RotateCcw, Download, Upload } from "lucide-react"

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  planned: string
  inProgress: string
  complete: string
  delayed: string
  background: string
  foreground: string
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#1a73e8",
    secondary: "#6c757d",
    accent: "#17a2b8",
    planned: "#17a2b8",
    inProgress: "#ff9800",
    complete: "#0f9d58",
    delayed: "#d93025",
    background: "#ffffff",
    foreground: "#000000",
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem("portnox-theme-colors")
    if (savedTheme) {
      setColors(JSON.parse(savedTheme))
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    localStorage.setItem("portnox-theme-colors", JSON.stringify(colors))
  }, [colors])

  const updateColor = (colorKey: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [colorKey]: value }))
  }

  const resetColors = () => {
    const defaultColors: ThemeColors = {
      primary: "#1a73e8",
      secondary: "#6c757d",
      accent: "#17a2b8",
      planned: "#17a2b8",
      inProgress: "#ff9800",
      complete: "#0f9d58",
      delayed: "#d93025",
      background: "#ffffff",
      foreground: "#000000",
    }

    setColors(defaultColors)
  }

  const exportTheme = () => {
    const themeData = {
      name: "Custom Portnox Theme",
      version: "1.0",
      colors,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portnox-theme-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/json") {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string)
          if (themeData.colors) {
            setColors(themeData.colors)
          }
        } catch (error) {
          console.error("Invalid theme file:", error)
        }
      }
      reader.readAsText(file)
    }
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
          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primary-color">Primary</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="primary-color"
                      type="color"
                      value={colors.primary}
                      onChange={(e) => updateColor("primary", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.primary}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="secondary-color">Secondary</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="secondary-color"
                      type="color"
                      value={colors.secondary}
                      onChange={(e) => updateColor("secondary", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.secondary}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="accent-color">Accent</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="accent-color"
                      type="color"
                      value={colors.accent}
                      onChange={(e) => updateColor("accent", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.accent}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="planned-color">Planned</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="planned-color"
                      type="color"
                      value={colors.planned}
                      onChange={(e) => updateColor("planned", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.planned}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="progress-color">In Progress</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="progress-color"
                      type="color"
                      value={colors.inProgress}
                      onChange={(e) => updateColor("inProgress", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.inProgress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="complete-color">Complete</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="complete-color"
                      type="color"
                      value={colors.complete}
                      onChange={(e) => updateColor("complete", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.complete}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="delayed-color">Delayed</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="delayed-color"
                      type="color"
                      value={colors.delayed}
                      onChange={(e) => updateColor("delayed", e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-mono w-20">{colors.delayed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Theme Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={resetColors}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>

                <Button variant="outline" onClick={exportTheme}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Theme
                </Button>

                <div className="relative">
                  <input type="file" id="theme-import" accept=".json" onChange={importTheme} className="hidden" />
                  <Button variant="outline" asChild>
                    <label htmlFor="theme-import" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Theme
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
