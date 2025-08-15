"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Palette, Upload, Download, RotateCcw, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme()
  const [companyName, setCompanyName] = useState("TechCorp Global")
  const [customerLogo, setCustomerLogo] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (open) {
      loadPreferences()
    }
  }, [open])

  const loadPreferences = async () => {
    if (typeof window === "undefined") return

    try {
      const preferences = await storage.getUserPreferences()
      setCompanyName(preferences.companyName || "TechCorp Global")
      setCustomerLogo(preferences.customerLogo || "")
      setNotifications(preferences.notifications ?? true)
      setAutoSave(preferences.autoSave ?? true)
    } catch (error) {
      console.error("Error loading preferences:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await storage.updateUserPreferences({
        companyName,
        customerLogo,
        notifications,
        autoSave,
        theme,
      })

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })

      // Trigger a page refresh to apply changes
      window.location.reload()
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match("image.*")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomerLogo(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportSettings = async () => {
    try {
      const data = await storage.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nac-designer-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Settings exported",
        description: "Your settings have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting settings:", error)
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          await storage.importData(content)

          toast({
            title: "Settings imported",
            description: "Your settings have been imported successfully. The page will refresh.",
          })

          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } catch (error) {
          console.error("Error importing settings:", error)
          toast({
            title: "Import failed",
            description: "Please check the file format and try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefaults = () => {
    setCompanyName("TechCorp Global")
    setCustomerLogo("")
    setNotifications(true)
    setAutoSave(true)
    setTheme("system")
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme & Customization</span>
          </DialogTitle>
          <DialogDescription>Customize the appearance and behavior of your NAC Designer application.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="h-20 flex-col"
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="h-20 flex-col"
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="h-20 flex-col"
                  >
                    <Monitor className="h-6 w-6 mb-2" />
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize your company branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Customer Logo</Label>
                  <div className="flex items-center space-x-4">
                    {customerLogo && (
                      <img
                        src={customerLogo || "/placeholder.svg"}
                        alt="Customer Logo"
                        className="h-12 max-w-[150px] object-contain border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a logo image (PNG, JPG, SVG). Recommended size: 150x50px
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Configure how the application behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show toast notifications for actions and updates</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export, import, or reset your application data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleExportSettings} variant="outline" className="h-20 flex-col bg-transparent">
                    <Download className="h-6 w-6 mb-2" />
                    Export Data
                    <span className="text-xs text-muted-foreground">Download all settings and data</span>
                  </Button>

                  <div>
                    <input
                      type="file"
                      id="import-settings"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                    <label
                      htmlFor="import-settings"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-20 px-4 py-2 cursor-pointer w-full flex-col"
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      Import Data
                      <span className="text-xs text-muted-foreground">Upload settings and data file</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={resetToDefaults} variant="destructive" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will reset all customizations to their default values. Your data will not be affected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
