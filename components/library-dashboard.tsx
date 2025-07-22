"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Edit, Trash2, BookCopy } from "lucide-react"
import type { Vendor, DeviceType, ChecklistItem, UseCase, TestMatrixEntry, TestCase, Requirement } from "@/lib/database"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"

interface LibraryDashboardProps {
  libraryData: {
    wiredVendors: Vendor[]
    wirelessVendors: Vendor[]
    idpVendors: Vendor[]
    deviceTypes: DeviceType[]
    checklistItems: ChecklistItem[]
    useCases: UseCase[]
    testMatrix: TestMatrixEntry[]
    testCases: TestCase[]
    requirements: Requirement[]
  }
  onUpdate: () => void // Callback to refresh data on the main page
}

// A simplified component to add new library items.
// In a real app, this would be a more complex form in a dialog.
const AddItemCard = ({ type, onAdd }: { type: string; onAdd: (type: string) => void }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Manage {type}</CardTitle>
      <CardDescription>View and add new custom {type.toLowerCase()} to the library.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={() => onAdd(type)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add New {type}
      </Button>
    </CardContent>
  </Card>
)

export function LibraryDashboard({ libraryData, onUpdate }: LibraryDashboardProps) {
  const [activeTab, setActiveTab] = useState("use-cases")

  // Add/Edit State
  const [isEdit, setIsEdit] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddNew = (tab: string) => {
    setIsEdit(false)
    setCurrentItem(null)
    setActiveTab(tab)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: any, tab: string) => {
    setIsEdit(true)
    setCurrentItem(item)
    setActiveTab(tab)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number | string, type: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return

    try {
      await api.deleteLibraryItem(id, type)
      toast({ title: "Success", description: "Item deleted successfully." })
      onUpdate()
    } catch (error) {
      toast({ title: "Error", description: `Failed to delete item: ${error}`, variant: "destructive" })
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (isEdit) {
        await api.updateLibraryItem(data.id, data, activeTab)
        toast({ title: "Success", description: "Item updated successfully." })
      } else {
        await api.createLibraryItem(data, activeTab)
        toast({ title: "Success", description: "Item created successfully." })
      }
      onUpdate()
      setIsDialogOpen(false)
    } catch (error) {
      toast({ title: "Error", description: `Failed to save item: ${error}`, variant: "destructive" })
    }
  }

  const handleAddItem = (type: string) => {
    // In a real app, this would open a dialog with a form.
    // For now, we'll just show an alert.
    alert(`This would open a form to add a new custom ${type}.`)
    // Example of how you might call an API:
    // const newItem = await api.addLibraryItem(type, { ...formData });
    // onUpdate();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookCopy className="mr-2" />
            Deployment Library Management
          </CardTitle>
          <CardDescription>
            Manage the master lists of vendors, devices, use cases, and other assets for all deployments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="use-cases" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
              <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>

            <TabsContent value="use-cases" className="space-y-4 pt-4">
              <AddItemCard type="Use Case" onAdd={handleAddItem} />
              <ItemTable
                title="Use Cases"
                items={libraryData.useCases}
                columns={["ID", "Title", "Category", "Priority", "Type"]}
                renderRow={(item: UseCase) => (
                  <>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>{item.is_custom ? "Custom" : "Default"}</TableCell>
                  </>
                )}
                onEdit={(item) => handleEdit(item, "use-cases")}
                onDelete={(id) => handleDelete(id, "useCase")}
              />
            </TabsContent>

            <TabsContent value="test-cases" className="space-y-4 pt-4">
              <AddItemCard type="Test Case" onAdd={handleAddItem} />
              <ItemTable
                title="Test Cases"
                items={libraryData.testCases}
                columns={["Name", "Expected Outcome"]}
                renderRow={(item: TestCase) => (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-xs">{item.expected_outcome}</TableCell>
                  </>
                )}
                onEdit={(item) => handleEdit(item, "test-cases")}
                onDelete={(id) => handleDelete(id, "testCase")}
              />
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 pt-4">
              <AddItemCard type="Requirement" onAdd={handleAddItem} />
              <ItemTable
                title="Requirements"
                items={libraryData.requirements}
                columns={["ID", "Description"]}
                renderRow={(item: Requirement) => (
                  <>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </>
                )}
                onEdit={(item) => handleEdit(item, "requirements")}
                onDelete={(id) => handleDelete(id, "requirement")}
              />
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4 pt-4">
              <Button onClick={() => handleAddNew("vendors")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Vendor
              </Button>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold mb-2">IDP</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {" "}
                    {libraryData.idpVendors.map((v: any) => (
                      <li key={v.id}>{v.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Wired</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {" "}
                    {libraryData.wiredVendors.map((v: any) => (
                      <li key={v.id}>{v.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Wireless</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {" "}
                    {libraryData.wirelessVendors.map((v: any) => (
                      <li key={v.id}>{v.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <LibraryItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        isEdit={isEdit}
        type={activeTab}
      />
    </>
  )
}

// Sub-components for the dashboard

function VendorTable({ title, vendors, onEdit, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor: Vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.is_custom ? "Custom" : "Default"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(vendor)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(vendor.id)} disabled={!vendor.is_custom}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ItemTable({ title, items, columns, renderRow, onEdit, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col: string) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                {renderRow(item)}
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} disabled={!item.is_custom}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Generic Dialog for Add/Edit
function LibraryItemDialog({ isOpen, onClose, onSave, item, isEdit, type }: any) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      // Set defaults for new items
      const defaults: any = {
        vendors: { name: "", type: "wired" },
        devices: { name: "" },
        checklist: { name: "", category: "" },
        "use-cases": {
          id: `UC-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
          title: "",
          category: "",
          description: "",
          priority: "optional",
        },
        "test-cases": {
          id: `TC-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
          name: "",
          expected_outcome: "",
        },
        requirements: {
          id: `R-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
          description: "",
        },
        "test-matrix": {
          id: `TM-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
          platform: "",
          mode: "",
          type: "",
          description: "",
        },
      }
      setFormData(defaults[type] || {})
    }
  }, [item, type, isOpen])

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const renderFormFields = () => {
    switch (type) {
      case "vendors":
        return (
          <>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type || "wired"} onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wired">Wired</SelectItem>
                <SelectItem value="wireless">Wireless</SelectItem>
              </SelectContent>
            </Select>
          </>
        )
      case "devices":
        return (
          <>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
          </>
        )
      case "checklist":
        return (
          <>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </>
        )
      case "use-cases":
        return (
          <>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title || ""} onChange={(e) => handleChange("title", e.target.value)} />
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority || "optional"} onValueChange={(v) => handleChange("priority", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
                <SelectItem value="nice-to-have">Nice to Have</SelectItem>
              </SelectContent>
            </Select>
          </>
        )
      case "test-cases":
        return (
          <>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
            <Label htmlFor="expected_outcome">Expected Outcome</Label>
            <Textarea
              id="expected_outcome"
              value={formData.expected_outcome || ""}
              onChange={(e) => handleChange("expected_outcome", e.target.value)}
            />
          </>
        )
      case "requirements":
        return (
          <>
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={formData.id || ""} onChange={(e) => handleChange("id", e.target.value)} />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </>
        )
      case "test-matrix":
        return (
          <>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform || ""}
              onChange={(e) => handleChange("platform", e.target.value)}
            />
            <Label htmlFor="mode">Mode</Label>
            <Input id="mode" value={formData.mode || ""} onChange={(e) => handleChange("mode", e.target.value)} />
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={formData.type || ""} onChange={(e) => handleChange("type", e.target.value)} />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </>
        )
      default:
        return <div>Form not implemented for this type.</div>
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Add"} {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderFormFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
