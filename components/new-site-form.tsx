"use client"

import type React from "react"

import { useState } from "react"
import { createSiteAction } from "@/app/actions/sites"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ProjectManager {
  id: string
  name: string
  email: string
}

interface NewSiteFormProps {
  projectId: string
  projectManagers: ProjectManager[]
}

export function NewSiteForm({ projectId, projectManagers }: NewSiteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      await createSiteAction(projectId, formData)

      toast({
        title: "Success",
        description: "Site created successfully",
      })
    } catch (error) {
      console.error("Error creating site:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create site",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={createSiteAction.bind(null, projectId)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name *</Label>
          <Input id="name" name="name" placeholder="Enter site name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <Input id="region" name="region" placeholder="Enter region" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input id="country" name="country" placeholder="Enter country" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select name="priority" required>
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phase">Phase *</Label>
          <Input id="phase" name="phase" placeholder="Enter phase" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="users_count">Users Count *</Label>
          <Input
            id="users_count"
            name="users_count"
            type="number"
            min="0"
            placeholder="Enter number of users"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_manager_id">Project Manager *</Label>
        <Select name="project_manager_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select project manager" />
          </SelectTrigger>
          <SelectContent>
            {projectManagers.map((manager) => (
              <SelectItem key={manager.id} value={manager.id}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="planned_start_date">Planned Start Date *</Label>
          <Input id="planned_start_date" name="planned_start_date" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planned_end_date">Planned End Date *</Label>
          <Input id="planned_end_date" name="planned_end_date" type="date" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select name="status" defaultValue="Planned" required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion_percentage">Completion %</Label>
          <Input
            id="completion_percentage"
            name="completion_percentage"
            type="number"
            min="0"
            max="100"
            defaultValue="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Enter any additional notes" rows={3} />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Site"}
        </Button>
      </div>
    </form>
  )
}
