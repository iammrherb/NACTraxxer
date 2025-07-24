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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DatabaseUser } from "@/lib/database"
import { mockCountries, initialRegions } from "@/lib/library-data"

interface BulkCreateSitesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (count: number, prefix: string, start: number, defaults: any) => void
  users: DatabaseUser[]
}

export function BulkCreateSitesModal({ isOpen, onClose, onSave, users }: BulkCreateSitesModalProps) {
  const [count, setCount] = useState(5)
  const [prefix, setPrefix] = useState("New-Site")
  const [startNumber, setStartNumber] = useState(1)
  const [defaults, setDefaults] = useState({
    region: "North America",
    country: "United States",
    project_manager_id: 0,
    status: "Planned",
    priority: "Medium",
  })

  const handleSave = () => {
    onSave(count, prefix, startNumber, defaults)
    onClose()
  }

  const projectManagers = users.filter((u) => u.user_type === "project_manager")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Create Sites</DialogTitle>
          <DialogDescription>
            Quickly generate multiple new sites with a common naming convention and default settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prefix">Site Name Prefix</Label>
              <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="count">Number of Sites</Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="startNumber">Starting Number</Label>
              <Input
                id="startNumber"
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(Number.parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This will create sites named: {prefix}-{startNumber}, {prefix}-{startNumber + 1}, ...
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label>Default Region</Label>
              <Select value={defaults.region} onValueChange={(value) => setDefaults((p) => ({ ...p, region: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {initialRegions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Country</Label>
              <Select
                value={defaults.country}
                onValueChange={(value) => setDefaults((p) => ({ ...p, country: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries
                    .filter((c) => c.region === defaults.region)
                    .map((c) => (
                      <SelectItem key={c.code} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Project Manager</Label>
              <Select
                value={String(defaults.project_manager_id)}
                onValueChange={(value) => setDefaults((p) => ({ ...p, project_manager_id: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Unassigned</SelectItem>
                  {projectManagers.map((pm) => (
                    <SelectItem key={pm.id} value={String(pm.id)}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Priority</Label>
              <Select
                value={defaults.priority}
                onValueChange={(value) => setDefaults((p) => ({ ...p, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create {count} Sites</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
