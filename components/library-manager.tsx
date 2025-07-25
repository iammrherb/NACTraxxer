"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { LibraryItemForm } from "./library-item-form"

export interface LibraryCategory {
  key: "network-vendors" | "security-vendors" | "device-types" | "checklist-items" | "use-cases" | "test-matrix"
  label: string
  columns: { key: string; label: string }[]
}

const libraryCategories: LibraryCategory[] = [
  {
    key: "network-vendors",
    label: "Network Vendors",
    columns: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
    ],
  },
  {
    key: "security-vendors",
    label: "Security Vendors",
    columns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
    ],
  },
  { key: "device-types", label: "Device Types", columns: [{ key: "name", label: "Name" }] },
  {
    key: "checklist-items",
    label: "Checklist Items",
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
    ],
  },
  {
    key: "use-cases",
    label: "Use Cases",
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "is_baseline", label: "Baseline" },
    ],
  },
  {
    key: "test-matrix",
    label: "Test Matrix",
    columns: [
      { key: "scenario", label: "Scenario" },
      { key: "platform", label: "Platform" },
      { key: "type", label: "Type" },
    ],
  },
]

export default function LibraryManager() {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>(libraryCategories[0])
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const fetchData = useCallback(
    async (categoryKey: string) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/library/${categoryKey}`)
        if (!response.ok) throw new Error(`Failed to fetch ${categoryKey}`)
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: `Could not load ${activeCategory.label}.`, variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    },
    [activeCategory],
  )

  useEffect(() => {
    fetchData(activeCategory.key)
  }, [activeCategory, fetchData])

  const handleOpenDialog = (item: any | null = null) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleSaveItem = async (itemData: any) => {
    setIsSaving(true)
    const url = editingItem
      ? `/api/library/${activeCategory.key}/${editingItem.id}`
      : `/api/library/${activeCategory.key}`
    const method = editingItem ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...itemData, is_custom: true }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save item.")
      }

      toast({ title: "Success", description: `${activeCategory.label.slice(0, -1)} saved successfully.` })
      handleCloseDialog()
      fetchData(activeCategory.key)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (
      !confirm(
        `Are you sure you want to delete this custom ${activeCategory.label.slice(0, -1)}? Default items cannot be deleted.`,
      )
    )
      return

    try {
      const response = await fetch(`/api/library/${activeCategory.key}/${id}`, { method: "DELETE" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete item.")
      }
      toast({ title: "Success", description: "Item deleted successfully." })
      fetchData(activeCategory.key)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const renderCellContent = (item: any, columnKey: string) => {
    const value = item[columnKey]
    if (typeof value === "boolean") {
      return value ? <Badge variant="outline">Yes</Badge> : <Badge variant="secondary">No</Badge>
    }
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    return value
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {libraryCategories.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory.key === cat.key ? "secondary" : "ghost"}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New {activeCategory.label.slice(0, -1)}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {activeCategory.columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead>Custom</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {activeCategory.columns.map((col) => (
                    <TableCell key={col.key}>{renderCellContent(item, col.key)}</TableCell>
                  ))}
                  <TableCell>
                    {item.is_custom ? <Badge>Custom</Badge> : <Badge variant="secondary">Default</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {item.is_custom && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No {activeCategory.label.toLowerCase()} found.</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} {activeCategory.label.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          <LibraryItemForm
            item={editingItem}
            category={activeCategory}
            onSave={handleSaveItem}
            onCancel={handleCloseDialog}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
