"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface LibraryItemDialogProps {
  isOpen: boolean
  onClose: () => void
  item: any | null
  itemType: string
  onSave: (itemData: any, type: string) => void
}

export function LibraryItemDialog({ isOpen, onClose, item, itemType, onSave }: LibraryItemDialogProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      // Set default values for new items
      setFormData(
        getFieldsForType(itemType).reduce((acc, field) => ({ ...acc, [field.id]: field.defaultValue || "" }), {}),
      )
    }
  }, [item, itemType, isOpen])

  const handleChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, itemType)
  }

  const getFieldsForType = (type: string) => {
    switch (type) {
      case "use-cases":
        return [
          { id: "id", label: "ID", type: "text", required: true, disabled: !!item },
          { id: "title", label: "Title", type: "text", required: true },
          { id: "description", label: "Description", type: "textarea" },
          { id: "scope", label: "Scope", type: "select", options: ["Mandatory", "Optional"] },
          { id: "portnox_status", label: "Portnox Ready", type: "checkbox" },
          { id: "notes", label: "Notes", type: "textarea" },
        ]
      case "test-cases":
        return [
          { id: "id", label: "ID", type: "text", required: true, disabled: !!item },
          { id: "name", label: "Name", type: "text", required: true },
          { id: "description", label: "Description", type: "textarea" },
          { id: "expected_outcome", label: "Expected Outcome", type: "textarea" },
          { id: "status", label: "Default Status", type: "select", options: ["Pass", "Fail", "WIP", "Not Started"] },
        ]
      case "requirements":
        return [
          { id: "id", label: "ID", type: "text", required: true, disabled: !!item },
          { id: "type", label: "Type", type: "select", options: ["Functional", "Non-Functional"] },
          { id: "description", label: "Description", type: "textarea", required: true },
          { id: "justification", label: "Justification", type: "textarea" },
          { id: "status", label: "Default Status", type: "select", options: ["Met", "Not Met"] },
        ]
      default:
        return []
    }
  }

  const fields = getFieldsForType(itemType)
  const title = `${item ? "Edit" : "Add"} ${itemType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {item ? "Update the details for this library item." : "Create a new item for the library."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === "text" && (
                  <Input
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                    disabled={field.disabled}
                  />
                )}
                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
                {field.type === "select" && (
                  <Select value={formData[field.id] || ""} onValueChange={(value) => handleChange(field.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={field.id}
                      checked={formData[field.id] || false}
                      onCheckedChange={(checked) => handleChange(field.id, checked)}
                    />
                    <Label htmlFor={field.id} className="font-normal">
                      {field.label}
                    </Label>
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
