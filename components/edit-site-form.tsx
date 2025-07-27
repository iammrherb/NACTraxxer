"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSiteAction } from "@/app/actions/sites"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

interface Site {
  id: string
  site_name: string
  site_id: string
  region: string
  country: string
  priority: string
  phase: string
  users_count: number
  project_manager: string
  status: string
  planned_start: string
  planned_end: string
  notes: string
  project_id: string
}

interface EditSiteFormProps {
  site: Site
  users: User[]
}

export function EditSiteForm({ site, users }: EditSiteFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await updateSiteAction(formData)
    } catch (error) {
      console.error("Error updating site:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="site_id" value={site.id} />
          <input type="hidden" name="project_id" value={site.project_id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name *</Label>
              <Input
                id="site_name"
                name="site_name"
                defaultValue={site.site_name}
                placeholder="Enter site name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_id_display">Site ID</Label>
              <Input id="site_id_display" value={site.site_id} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Site ID cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Input id="region" name="region" defaultValue={site.region} placeholder="Enter region" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" name="country" defaultValue={site.country} placeholder="Enter country" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select name="priority" defaultValue={site.priority} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase">Phase *</Label>
              <Input id="phase" name="phase" defaultValue={site.phase} placeholder="Enter phase" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="users_count">Users Count *</Label>
              <Input
                id="users_count"
                name="users_count"
                type="number"
                min="0"
                defaultValue={site.users_count}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_manager">Project Manager *</Label>
            <Select name="project_manager" defaultValue={site.project_manager} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planned_start">Planned Start Date *</Label>
              <Input id="planned_start" name="planned_start" type="date" defaultValue={site.planned_start} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planned_end">Planned End Date *</Label>
              <Input id="planned_end" name="planned_end" type="date" defaultValue={site.planned_end} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={site.status} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={site.notes || ""}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Site"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
