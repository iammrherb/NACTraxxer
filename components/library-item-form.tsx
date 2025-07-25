"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { LibraryCategory } from "./library-manager"

interface LibraryItemFormProps {
  item?: any
  category: LibraryCategory
  onSave: (itemData: any) => void
  onCancel: () => void
  isSaving: boolean
}

export function LibraryItemForm({ item, category, onSave, onCancel, isSaving }: LibraryItemFormProps) {
  const [formData, setFormData] = useState({})

  useEffect(() => {
    // When editing, pre-fill the form. For use cases, convert array fields to comma-separated strings.
    if (item) {
      const data = { ...item }
      if (category.key === "use-cases") {
        data.applicable_industries = (data.applicable_industries || []).join(", ")
        data.applicable_goals = (data.applicable_goals || []).join(", ")
      }
      setFormData(data)
    } else {
      // When creating, set default values.
      const defaults: any = {}
      if (category.key === "network-vendors") defaults.type = "wired"
      if (category.key === "security-vendors") defaults.category = "firewall"
      if (category.key === "checklist-items") defaults.category = "MDM/UEM"
      if (category.key === "use-cases") defaults.is_baseline = false
      setFormData(defaults)
    }
  }, [item, category])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...formData }
    // For use cases, convert comma-separated strings back to arrays.
    if (category.key === "use-cases") {
      dataToSave.applicable_industries = (dataToSave.applicable_industries || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
      dataToSave.applicable_goals = (dataToSave.applicable_goals || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    }
    onSave(dataToSave)
  }

  const renderFormFields = () => {
    switch (category.key) {
      case "network-vendors":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Vendor Type</Label>
              <Select value={formData.type || "wired"} onValueChange={(v) => handleChange("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wired">Wired</SelectItem>
                  <SelectItem value="wireless">Wireless</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "security-vendors":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Vendor Category</Label>
              <Select value={formData.category || "firewall"} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="vpn">VPN</SelectItem>
                  <SelectItem value="edr_xdr">EDR/XDR</SelectItem>
                  <SelectItem value="siem">SIEM/SOAR/MDR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "device-types":
        return (
          <div className="space-y-2">
            <Label htmlFor="name">Device Type Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
        )
      case "checklist-items":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category || "MDM/UEM"} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MDM/UEM">MDM/UEM</SelectItem>
                  <SelectItem value="SSO/MFA">SSO/MFA</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </>
        )
      case "use-cases":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicable_industries">Applicable Industries (comma-separated)</Label>
              <Input
                id="applicable_industries"
                value={formData.applicable_industries || ""}
                onChange={(e) => handleChange("applicable_industries", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicable_goals">Applicable Goals (comma-separated)</Label>
              <Input
                id="applicable_goals"
                value={formData.applicable_goals || ""}
                onChange={(e) => handleChange("applicable_goals", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_baseline"
                checked={formData.is_baseline || false}
                onCheckedChange={(c) => handleChange("is_baseline", c)}
              />
              <Label htmlFor="is_baseline">Baseline Use Case (include in all new projects)</Label>
            </div>
          </>
        )
      case "test-matrix":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario</Label>
              <Input
                id="scenario"
                value={formData.scenario || ""}
                onChange={(e) => handleChange("scenario", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={formData.platform || ""}
                onChange={(e) => handleChange("platform", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <Input id="mode" value={formData.mode || ""} onChange={(e) => handleChange("mode", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" value={formData.type || ""} onChange={(e) => handleChange("type", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </>
        )
      default:
        return <p>Invalid category selected.</p>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">{renderFormFields()}</div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
