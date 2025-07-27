"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSiteIds: string[]
  onSuccess: () => void
}

export function BulkEditModal({ isOpen, onClose, selectedSiteIds, onSuccess }: BulkEditModalProps) {
  const [status, setStatus] = useState<string>("No change")
  const [priority, setPriority] = useState<string>("No change")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (status === "No change" && priority === "No change") {
      toast({
        title: "No changes selected",
        description: "Please select at least one field to update.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const updates: any = {}
      if (status !== "No change") updates.status = status
      if (priority !== "No change") updates.priority = priority

      const response = await fetch("/api/sites/bulk", {
        method: "PUT",
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

      const result = await response.json()

      toast({
        title: "Sites updated successfully",
        description: result.message,
      })

      // Reset form
      setStatus("No change")
      setPriority("No change")

      // Refresh the page to show updated data
      router.refresh()

      onSuccess()
    } catch (error) {
      console.error("Bulk edit error:", error)
      toast({
        title: "Error",
        description: "Failed to update sites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Edit Sites</DialogTitle>
          <DialogDescription>
            Update {selectedSiteIds.length} selected site{selectedSiteIds.length > 1 ? "s" : ""}. Only fields you change
            will be updated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="bulk-status">
                <SelectValue placeholder="Select new status (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No change">No change</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="bulk-priority">
                <SelectValue placeholder="Select new priority (optional)" />
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Sites"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
