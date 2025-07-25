"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  siteIds: string[]
}

export function BulkEditModal({ isOpen, onClose, onSave, siteIds }: BulkEditModalProps) {
  const [status, setStatus] = useState("")
  const [phase, setPhase] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const payload: { status?: string; phase?: number } = {}
    if (status) payload.status = status
    if (phase) payload.phase = Number.parseInt(phase, 10)

    if (Object.keys(payload).length === 0) {
      toast({ title: "No changes", description: "Please select a value to update.", variant: "destructive" })
      setIsSaving(false)
      return
    }

    try {
      const response = await fetch("/api/sites/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteIds, ...payload }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to bulk update sites")
      }

      toast({ title: "Success", description: `${siteIds.length} sites updated.` })
      onSave()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
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
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="phase">Phase</Label>
            <Input type="number" value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="Change phase" />
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
