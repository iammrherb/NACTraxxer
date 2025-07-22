"use client"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "./ui/use-toast"
import * as api from "@/lib/api"
import type { Site, LibraryData, DatabaseUser as User } from "@/lib/database"

interface BulkCreateSitesModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  library: LibraryData
  users: User[]
}

export function BulkCreateSitesModal({ isOpen, onClose, onUpdate }: BulkCreateSitesModalProps) {
  const [count, setCount] = useState(1)
  const [baseName, setBaseName] = useState("New Site")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (count < 1) {
      toast({ title: "Invalid count", description: "Please enter a number of sites greater than 0." })
      return
    }
    setIsSaving(true)

    const sitesToCreate: Partial<Site>[] = Array.from({ length: count }, (_, i) => ({
      name: `${baseName} ${i + 1}`,
      id: `${baseName.replace(/\s+/g, "-").toUpperCase()}-${Date.now() + i}`,
    }))

    try {
      await api.bulkCreateSites(sitesToCreate)
      toast({ title: "Success", description: `${count} sites have been created.` })
      onUpdate()
      onClose()
    } catch (error) {
      toast({ title: "Error", description: "Failed to perform bulk create.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Create Sites</DialogTitle>
          <DialogDescription>
            Quickly create multiple sites with a common base name. You can edit details later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="baseName">Base Site Name</Label>
            <Input id="baseName" value={baseName} onChange={(e) => setBaseName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="siteCount">Number of Sites to Create</Label>
            <Input
              id="siteCount"
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This will create sites named: {baseName} 1, {baseName} 2, ...
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Creating..." : `Create ${count} Sites`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
