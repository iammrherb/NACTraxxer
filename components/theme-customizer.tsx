"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { storage, type UserPreferences } from "@/lib/storage"
import { Palette, RotateCcw, Building2 } from "lucide-react"

interface ThemeCustomizerProps {
  onThemeUpdated?: () => void
}

export default function ThemeCustomizer({ onThemeUpdated }: ThemeCustomizerProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({})
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    customerLogo: "",
    theme: "light" as "light" | "dark" | "system",
    notifications: true,
    autoSave: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && open) {
      loadPreferences()
    }
  }, [mounted, open])

  const loadPreferences = async () => {
    if (!mounted) return

    try {
      setLoading(true)
      const prefs = await storage.getUserPreferences()
      setPreferences(prefs)
      setFormData({
        companyName: prefs.companyName || "",
        customerLogo: prefs.customerLogo || "",
        theme: (prefs.theme as "light" | "dark" | "system") || "light",
        notifications: prefs.notifications ?? true,
        autoSave: prefs.autoSave ?? true,
      })
    } catch (error) {
      console.error("Error loading preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!mounted) return

    try {
      setLoading(true)
      await storage.updateUserPreferences(formData)

      toast({
        title: "Preferences saved",
        description: "Your customization preferences have been saved successfully.",
      })

      onThemeUpdated?.()
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData({ ...formData, customerLogo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = async () => {
    if (!mounted || !confirm("Are you sure you want to reset all customizations?")) return

    try {
      setLoading(true)
      const defaultPrefs = {
        companyName: "TechCorp Global",
        theme: "light" as const,
        notifications: true,
        autoSave: true,
      }

      await storage.updateUserPreferences(defaultPrefs)
      setFormData({ ...defaultPrefs, customerLogo: "" })

      toast({
        title: "Preferences reset",
        description: "All customizations have been reset to defaults.",
      })

      onThemeUpdated?.()
    } catch (error) {
      console.error("Error resetting preferences:", error)
      toast({
        title: "Error",
        description: "Failed to reset preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Palette className="h-4 w-4" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            Theme Customization
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Branding
                </CardTitle>
                <CardDescription>Customize your company information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1" />
                    {formData.customerLogo && (
                      <div className="w-16 h-16 border rounded-lg overflow-hidden">
                        <img
                          src={formData.customerLogo || "/placeholder.svg"}
                          alt="Company Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a logo image (PNG, JPG, SVG). Recommended size: 200x200px
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Configure the appearance and behavior of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <div className="flex gap-2">
                    {[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                      { value: "system", label: "System" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={formData.theme === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, theme: option.value as any })}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Notifications</Label>
                      <p className="text-xs text-gray-500">Show toast notifications for actions</p>
                    </div>
                    <Button
                      variant={formData.notifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                    >
                      {formData.notifications ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Save</Label>
                      <p className="text-xs text-gray-500">Automatically save changes</p>
                    </div>
                    <Button
                      variant={formData.autoSave ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, autoSave: !formData.autoSave })}
                    >
                      {formData.autoSave ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Current Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Company: {formData.companyName || "Not set"}</Badge>
                  <Badge variant="outline">Theme: {formData.theme}</Badge>
                  <Badge variant="outline">Notifications: {formData.notifications ? "On" : "Off"}</Badge>
                  <Badge variant="outline">Auto Save: {formData.autoSave ? "On" : "Off"}</Badge>
                  {formData.customerLogo && <Badge variant="outline">Logo: Uploaded</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
