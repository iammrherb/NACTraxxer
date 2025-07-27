"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSiteAction } from "@/app/actions/sites"
import { toast } from "sonner"

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
  notes?: string
}

interface ProjectManager {
  id: string
  name: string
  email: string
}

interface EditSiteFormProps {
  site: Site
  projectId: string
  projectManagers: ProjectManager[]
}

export function EditSiteForm({ site, projectId, projectManagers }: EditSiteFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    formData.append("site_id", site.id)
    formData.append("project_id", projectId)

    try {
      await updateSiteAction(formData)
      toast.success("Site updated successfully!")
    } catch (error) {
      console.error("Error updating site:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update site")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site Name *</Label>
          <Input id="site_name" name="site_name" defaultValue={site.site_name} placeholder="Enter site name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site_id">Site ID</Label>
          <Input
            id="site_id"
            name="site_id"
            defaultValue={site.site_id}
            placeholder="Enter unique site ID"
            disabled
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">Site ID cannot be changed after creation</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <Select name="region" defaultValue={site.region} required>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="EMEA">EMEA</SelectItem>
              <SelectItem value="APAC">APAC</SelectItem>
              <SelectItem value="LATAM">LATAM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input id="country" name="country" defaultValue={site.country} placeholder="Enter country" required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select name="priority" defaultValue={site.priority} required>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
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
          <Select name="phase" defaultValue={site.phase} required>
            <SelectTrigger>
              <SelectValue placeholder="Select phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Discovery">Discovery</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Implementation">Implementation</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Deployment">Deployment</SelectItem>
              <SelectItem value="Optimization">Optimization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="users_count">Number of Users *</Label>
          <Input
            id="users_count"
            name="users_count"
            type="number"
            min="0"
            defaultValue={site.users_count}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_manager">Project Manager *</Label>
        <Select name="project_manager" defaultValue={site.project_manager} required>
          <SelectTrigger>
            <SelectValue placeholder="Select project manager" />
          </SelectTrigger>
          <SelectContent>
            {projectManagers.map((pm) => (
              <SelectItem key={pm.id} value={pm.name}>
                {pm.name} ({pm.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-6">
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
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Complete">Complete</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={site.notes || ""}
          placeholder="Additional notes about this site"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Site"}
        </Button>
      </div>
    </form>
  )
}
