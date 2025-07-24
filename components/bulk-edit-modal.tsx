"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "./ui/use-toast"
import * as api from "@/lib/api"
import type { DatabaseUser, LibraryData, Site } from "@/lib/database"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  siteIds: string[]
  library: LibraryData
  users: DatabaseUser[]
  onUpdate: () => void
}

export function BulkEditModal({ isOpen, onClose, siteIds, library, users, onUpdate }: BulkEditModalProps) {
  const [projectManagerId, setProjectManagerId] = useState<string>("")
  const [technicalOwnerIds, setTechnicalOwnerIds] = useState<number[]>([])
  const [useCaseIds, setUseCaseIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleMultiSelectChange = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    id: number | string,
    checked: boolean,
  ) => {
    setter((prev: any[]) => (checked ? [...prev, id] : prev.filter((existingId) => existingId !== id)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const updates: Partial<Site> = {}
    if (projectManagerId) updates.project_manager_id = Number(projectManagerId)
    if (technicalOwnerIds.length > 0) updates.technical_owner_ids = technicalOwnerIds
    if (useCaseIds.length > 0) updates.use_case_ids = useCaseIds

    if (Object.keys(updates).length === 0) {
      toast({ title: "No changes", description: "Please select a value to apply.", variant: "destructive" })
      setIsSaving(false)
      return
    }

    try {
      await api.bulkUpdateSites(siteIds, updates)
      toast({ title: "Success", description: `${siteIds.length} sites have been updated.` })
      onUpdate()
      onClose()
    } catch (error) {
      toast({ title: "Error", description: "Failed to perform bulk update.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit {siteIds.length} Sites</DialogTitle>
          <DialogDescription>
            Apply changes to all selected sites. Fields left blank will not be changed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <Label>Assign Project Manager</Label>
            <Select value={projectManagerId} onValueChange={setProjectManagerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Project Manager" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((u) => u.user_type === "project_manager")
                  .map((pm) => (
                    <SelectItem key={pm.id} value={String(pm.id)}>
                      {pm.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Assign Technical Owners</Label>
            <ScrollArea className="h-32 border rounded p-2">
              <div className="space-y-1">
                {users
                  .filter((u) => u.user_type === "technical_owner")
                  .map((to) => (
                    <div key={to.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`to-${to.id}`}
                        checked={technicalOwnerIds.includes(to.id)}
                        onCheckedChange={(c) => handleMultiSelectChange(setTechnicalOwnerIds, to.id, c as boolean)}
                      />
                      <Label htmlFor={`to-${to.id}`} className="font-normal">
                        {to.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <Label>Assign Use Cases</Label>
            <ScrollArea className="h-32 border rounded p-2">
              <div className="space-y-1">
                {library.useCases.map((uc) => (
                  <div key={uc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`uc-${uc.id}`}
                      checked={useCaseIds.includes(uc.id)}
                      onCheckedChange={(c) => handleMultiSelectChange(setUseCaseIds, uc.id, c as boolean)}
                    />
                    <Label htmlFor={`uc-${uc.id}`} className="font-normal">
                      {uc.title}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Apply Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
