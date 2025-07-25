"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  siteIds: string[]
}

export function BulkEditModal({ isOpen, onClose, onSave, siteIds }: BulkEditModalProps) {
  const [updates, setUpdates] = useState<{ status?: string; priority?: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (Object.keys(updates).length === 0) {
      toast({
        title: "No changes",
        description: "Please select a value to update.",
        variant: "default",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/sites/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: siteIds, updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to bulk update sites.")
      }

      toast({
        title: "Success!",
        description: `${siteIds.length} sites have been updated.`,
      })
      onSave()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error updating sites",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit {siteIds.length} Sites</DialogTitle>
          <DialogDescription>
            Apply changes to all selected sites. Only fields with a selected value will be updated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(value) => setUpdates((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="-- No Change --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select onValueChange={(value) => setUpdates((prev) => ({ ...prev, priority: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="-- No Change --" />
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
