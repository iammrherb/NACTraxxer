"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { UseCase } from "@/lib/database"

interface UseCaseFormProps {
  useCase?: UseCase | null
  isOpen: boolean
  onClose: () => void
  onSave: (useCase: Partial<UseCase>) => void
}

export function UseCaseForm({ useCase, isOpen, onClose, onSave }: UseCaseFormProps) {
  const [formData, setFormData] = useState<Partial<UseCase>>({})

  useEffect(() => {
    if (useCase) {
      setFormData(useCase)
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        category: "security",
        status: "pending",
        priority: "optional",
        completion_percentage: 0,
        notes: "",
      })
    }
  }, [useCase, isOpen])

  const handleChange = (field: keyof UseCase, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{useCase ? "Edit Use Case" : "Add New Use Case"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subtitle" className="text-right">
              Subtitle
            </Label>
            <Input
              id="subtitle"
              value={formData.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cert-auth">Certificate Auth</SelectItem>
                <SelectItem value="wifi">WiFi</SelectItem>
                <SelectItem value="wired">Wired</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
                <SelectItem value="nice-to-have">Nice to Have</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Use Case</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
