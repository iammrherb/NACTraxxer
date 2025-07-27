"use client"

import type React from "react"

import { useState } from "react"
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
import { toast } from "sonner"

interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSiteIds: string[]
  onSuccess: () => void
}

export function BulkEditModal({ open, onOpenChange, selectedSiteIds, onSuccess }: BulkEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: "No change",
    priority: "No change",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updates: any = {}
      if (formData.status !== "No change") updates.status = formData.status
      if (formData.priority !== "No change") updates.priority = formData.priority

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
        throw new Error("Failed to update sites")
      }

      toast.success(`Successfully updated ${selectedSiteIds.length} sites`)
      onSuccess()

      // Reset form
      setFormData({ status: "No change", priority: "No change" })
    } catch (error) {
      console.error("Error updating sites:", error)
      toast.error("Failed to update sites")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Edit Sites</DialogTitle>
          <DialogDescription>
            Update {selectedSiteIds.length} selected sites. Only fields with values will be updated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No change">No change</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
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
                <SelectValue placeholder="Select priority (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No change">No change</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Sites"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
