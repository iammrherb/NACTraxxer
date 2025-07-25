"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationPreferences {
  projectUpdates: boolean
  deploymentAlerts: boolean
  weeklySummary: boolean
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notifications/preferences")
      if (!response.ok) {
        throw new Error("Failed to fetch notification preferences.")
      }
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load your notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: !preferences[key] })
    }
  }

  const handleSaveChanges = async () => {
    if (!preferences) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences.")
      }

      toast({
        title: "Success",
        description: "Your notification settings have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your settings. Please try again.",
        variant: "destructive",
      })
      fetchPreferences()
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications from the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences && (
          <>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="project-updates">Project Updates</Label>
              <Switch
                id="project-updates"
                checked={preferences.projectUpdates}
                onCheckedChange={() => handleToggle("projectUpdates")}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="deployment-alerts">Deployment Alerts</Label>
              <Switch
                id="deployment-alerts"
                checked={preferences.deploymentAlerts}
                onCheckedChange={() => handleToggle("deploymentAlerts")}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="weekly-summary">Weekly Summary</Label>
              <Switch
                id="weekly-summary"
                checked={preferences.weeklySummary}
                onCheckedChange={() => handleToggle("weeklySummary")}
              />
            </div>
          </>
        )}
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
