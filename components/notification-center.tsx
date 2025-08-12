"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Settings,
  Mail,
  Smartphone,
  X,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "deployment" | "system" | "milestone" | "alert"
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  categories: {
    deployment: boolean
    system: boolean
    milestone: boolean
    alert: boolean
  }
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Site Deployment Completed",
    message: "Main Office deployment has been successfully completed with all use cases validated.",
    type: "success",
    category: "deployment",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    actionUrl: "/sites/main-office",
  },
  {
    id: "2",
    title: "Milestone Approaching",
    message: "Phase 2 milestone is due in 3 days. Review progress and ensure deliverables are on track.",
    type: "warning",
    category: "milestone",
    timestamp: "2024-01-15T09:15:00Z",
    read: false,
    actionUrl: "/milestones/phase-2",
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    message: "Portnox Cloud maintenance window scheduled for tonight 11 PM - 2 AM EST.",
    type: "info",
    category: "system",
    timestamp: "2024-01-15T08:45:00Z",
    read: true,
  },
  {
    id: "4",
    title: "Authentication Issue Detected",
    message: "Multiple authentication failures detected at Branch Office. Immediate attention required.",
    type: "error",
    category: "alert",
    timestamp: "2024-01-15T07:20:00Z",
    read: false,
    actionUrl: "/sites/branch-office/issues",
  },
  {
    id: "5",
    title: "New Use Case Added",
    message: "Guest Network Access use case has been added to the deployment checklist.",
    type: "info",
    category: "deployment",
    timestamp: "2024-01-14T16:30:00Z",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: {
      deployment: true,
      system: true,
      milestone: true,
      alert: true,
    },
  })
  const [filter, setFilter] = useState<"all" | "unread" | "deployment" | "system" | "milestone" | "alert">("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    const variants = {
      success: "default",
      warning: "secondary",
      error: "destructive",
      info: "outline",
    } as const

    return (
      <Badge variant={variants[type as keyof typeof variants] || "outline"} className="text-xs">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.category === filter
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAsUnread = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Tabs */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All", count: notifications.length },
                  { key: "unread", label: "Unread", count: unreadCount },
                  {
                    key: "deployment",
                    label: "Deployment",
                    count: notifications.filter((n) => n.category === "deployment").length,
                  },
                  {
                    key: "milestone",
                    label: "Milestones",
                    count: notifications.filter((n) => n.category === "milestone").length,
                  },
                  { key: "alert", label: "Alerts", count: notifications.filter((n) => n.category === "alert").length },
                  {
                    key: "system",
                    label: "System",
                    count: notifications.filter((n) => n.category === "system").length,
                  },
                ].map(({ key, label, count }) => (
                  <Button
                    key={key}
                    variant={filter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(key as any)}
                    className="flex items-center gap-2"
                  >
                    {label}
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-0">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                <div className="flex items-center gap-2">
                                  {getNotificationBadge(notification.type)}
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {notification.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {notification.read ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsUnread(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <MarkAsUnread className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {notification.actionUrl && (
                              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < filteredNotifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Methods */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.email}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.push}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, push: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.sms}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, sms: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Categories</h4>
                <div className="space-y-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`${category}-category`} className="capitalize">
                          {category} Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {category === "deployment" && "Site deployments, progress updates, completions"}
                          {category === "system" && "System maintenance, updates, service status"}
                          {category === "milestone" && "Project milestones, deadlines, deliverables"}
                          {category === "alert" && "Critical issues, failures, security alerts"}
                        </p>
                      </div>
                      <Switch
                        id={`${category}-category`}
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            categories: { ...prev.categories, [category]: checked },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
