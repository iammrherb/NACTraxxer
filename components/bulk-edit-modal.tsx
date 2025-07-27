"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSiteIds: string[]
  onSuccess: () => void
}

export function BulkEditModal({ open, onOpenChange, selectedSiteIds, onSuccess }: BulkEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [priority, setPriority] = useState<string>("")
  const { toast } = useToast()

  async function handleSubmit() {
    if (!status && !priority) {
      toast({
        title: "Error",
        description: "Please select at least one field to update",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const updates: any = {}
      if (status) updates.status = status
      if (priority) updates.priority = priority

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
        const error = await response.json()
        throw new Error(error.error || "Failed to update sites")
      }

      toast({
        title: "Success",
        description: `Updated ${selectedSiteIds.length} site${selectedSiteIds.length > 1 ? "s" : ""}`,
      })

      onSuccess()

      // Reset form
      setStatus("")
      setPriority("")
    } catch (error) {
      console.error("Error updating sites:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update sites",
        variant: "destructive",
      })
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
            Update {selectedSiteIds.length} selected site{selectedSiteIds.length > 1 ? "s" : ""}. Only fields you select
            will be updated.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status (optional)" />
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
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
