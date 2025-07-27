"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSiteIds: string[]
  onSuccess: () => void
}

interface ProjectManager {
  id: string
  name: string
  email: string
}

export function BulkEditModal({ open, onOpenChange, selectedSiteIds, onSuccess }: BulkEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([])
  const [formData, setFormData] = useState({
    status: "No change",
    priority: "No change",
    project_manager: "No change",
    phase: "No change",
    completion_percent: "",
  })

  // Fetch project managers when modal opens
  useEffect(() => {
    if (open) {
      fetchProjectManagers()
    }
  }, [open])

  const fetchProjectManagers = async () => {
    try {
      const response = await fetch("/api/users?role=Manager")
      if (response.ok) {
        const data = await response.json()
        setProjectManagers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching project managers:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updates: any = {}
      if (formData.status !== "No change") updates.status = formData.status
      if (formData.priority !== "No change") updates.priority = formData.priority
      if (formData.project_manager !== "No change") updates.project_manager = formData.project_manager
      if (formData.phase !== "No change") updates.phase = formData.phase
      if (formData.completion_percent !== "") {
        const percent = Number.parseInt(formData.completion_percent)
        if (!isNaN(percent) && percent >= 0 && percent <= 100) {
          updates.completion_percent = percent
        }
      }

      if (Object.keys(updates).length === 0) {
        toast.error("Please select at least one field to update")
        return
      }

      const response = await fetch("/api/sites/bulk", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedSiteIds,
          updates,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update sites")
      }

      toast.success(`Successfully updated ${selectedSiteIds.length} sites`)
      onSuccess()
      onOpenChange(false)

      // Reset form
      setFormData({
        status: "No change",
        priority: "No change",
        project_manager: "No change",
        phase: "No change",
        completion_percent: "",
      })
    } catch (error) {
      console.error("Error updating sites:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update sites")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Sites</DialogTitle>
          <DialogDescription>
            Update {selectedSiteIds.length} selected sites. Only fields with values will be updated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No change">No change</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No change">No change</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_manager">Project Manager</Label>
              <Select
                value={formData.project_manager}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, project_manager: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No change">No change</SelectItem>
                  {projectManagers.map((pm) => (
                    <SelectItem key={pm.id} value={pm.name}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Select
                value={formData.phase}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, phase: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No change">No change</SelectItem>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Implementation">Implementation</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Deployment">Deployment</SelectItem>
                  <SelectItem value="Optimization">Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_percent">Completion Percentage</Label>
            <Input
              id="completion_percent"
              type="number"
              min="0"
              max="100"
              placeholder="Leave empty for no change"
              value={formData.completion_percent}
              onChange={(e) => setFormData((prev) => ({ ...prev, completion_percent: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Enter a value between 0-100, or leave empty to keep current values
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : `Update ${selectedSiteIds.length} Sites`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
