"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, AlertCircle, CheckCircle, Users, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationPreferences {
  email_notifications: boolean
  site_status_changes: boolean
  deployment_milestones: boolean
  user_assignments: boolean
  weekly_reports: boolean
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    site_status_changes: true,
    deployment_milestones: true,
    user_assignments: true,
    weekly_reports: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/notifications/preferences")
      if (response.ok) {
        const data = await response.json()
        if (data.user_id) {
          setPreferences({
            email_notifications: data.email_notifications,
            site_status_changes: data.site_status_changes,
            deployment_milestones: data.deployment_milestones,
            user_assignments: data.user_assignments,
            weekly_reports: data.weekly_reports,
          })
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification preferences updated successfully",
        })
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading notification settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="email_notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
          </div>
          <Switch
            id="email_notifications"
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => updatePreference("email_notifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="site_status_changes" className="text-base font-medium">
                Site Status Changes
              </Label>
              <p className="text-sm text-muted-foreground">Get notified when site deployment status changes</p>
            </div>
          </div>
          <Switch
            id="site_status_changes"
            checked={preferences.site_status_changes}
            onCheckedChange={(checked) => updatePreference("site_status_changes", checked)}
            disabled={!preferences.email_notifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="deployment_milestones" className="text-base font-medium">
                Deployment Milestones
              </Label>
              <p className="text-sm text-muted-foreground">Get notified when deployment milestones are reached</p>
            </div>
          </div>
          <Switch
            id="deployment_milestones"
            checked={preferences.deployment_milestones}
            onCheckedChange={(checked) => updatePreference("deployment_milestones", checked)}
            disabled={!preferences.email_notifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="user_assignments" className="text-base font-medium">
                User Assignments
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you're assigned to new sites or projects
              </p>
            </div>
          </div>
          <Switch
            id="user_assignments"
            checked={preferences.user_assignments}
            onCheckedChange={(checked) => updatePreference("user_assignments", checked)}
            disabled={!preferences.email_notifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="weekly_reports" className="text-base font-medium">
                Weekly Reports
              </Label>
              <p className="text-sm text-muted-foreground">Receive weekly progress summary reports</p>
            </div>
          </div>
          <Switch
            id="weekly_reports"
            checked={preferences.weekly_reports}
            onCheckedChange={(checked) => updatePreference("weekly_reports", checked)}
            disabled={!preferences.email_notifications}
          />
        </div>

        <div className="pt-4">
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
