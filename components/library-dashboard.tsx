"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, BookCopy, CheckCircle, XCircle, PlusCircle } from "lucide-react"
import type { Vendor, DeviceType, ChecklistItem, UseCase, TestMatrixEntry, TestCase, Requirement } from "@/lib/database"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "./ui/scroll-area"
import { LibraryItemDialog } from "@/components/library-item-dialog"
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
  onUpdate: () => void
}

export function LibraryDashboard({ libraryData, onUpdate }: LibraryDashboardProps) {
  const [activeTab, setActiveTab] = useState("use-cases")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [itemType, setItemType] = useState("")

  const handleAddItem = (type: string) => {
    setItemType(type)
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEditItem = (item: any, type: string) => {
    setItemType(type)
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteItem = async (item: any, type: string) => {
    if (!item.is_custom) {
      toast({ title: "Action Denied", description: "Cannot delete baseline library items.", variant: "destructive" })
      return
    }
    if (confirm(`Are you sure you want to delete "${item.title || item.name || item.id}"?`)) {
      try {
        await api.deleteLibraryItem(item.id, type)
        toast({ title: "Success", description: "Item deleted successfully." })
        onUpdate()
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" })
      }
    }
  }

  const handleSaveItem = async (itemData: any, type: string) => {
    try {
      if (editingItem) {
        await api.updateLibraryItem(editingItem.id, itemData, type)
        toast({ title: "Success", description: "Item updated successfully." })
      } else {
        await api.createLibraryItem(itemData, type)
        toast({ title: "Success", description: "Item created successfully." })
      }
      onUpdate()
      setIsDialogOpen(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save item.", variant: "destructive" })
    }
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
            Master lists of vendors, devices, use cases, and other assets for all deployments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="use-cases" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
              <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="test-matrix">Test Matrix</TabsTrigger>
            </TabsList>
            <div className="flex justify-end my-2">
              <Button onClick={() => handleAddItem(activeTab)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New {activeTab.replace("-", " ")}
              </Button>
            </div>
            <ScrollArea className="h-[60vh] mt-4">
              <TabsContent value="use-cases">
                <ItemTable
                  title="Use Cases"
                  items={libraryData.useCases}
                  columns={["ID", "Title", "Scope", "Portnox Ready", "Actions"]}
                  renderRow={(item: UseCase) => (
                    <>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.scope}</TableCell>
                      <TableCell>
                        {item.portnox_status ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                    </>
                  )}
                  onEdit={(item) => handleEditItem(item, "use-cases")}
                  onDelete={(item) => handleDeleteItem(item, "use-cases")}
                />
              </TabsContent>

              <TabsContent value="test-cases">
                <ItemTable
                  title="Test Cases"
                  items={libraryData.testCases}
                  columns={["ID", "Name", "Status", "Actions"]}
                  renderRow={(item: TestCase) => (
                    <>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </>
                  )}
                  onEdit={(item) => handleEditItem(item, "test-cases")}
                  onDelete={(item) => handleDeleteItem(item, "test-cases")}
                />
              </TabsContent>

              <TabsContent value="requirements">
                <ItemTable
                  title="Requirements"
                  items={libraryData.requirements}
                  columns={["ID", "Type", "Description", "Status", "Actions"]}
                  renderRow={(item: Requirement) => (
                    <>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-xs">{item.description}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </>
                  )}
                  onEdit={(item) => handleEditItem(item, "requirements")}
                  onDelete={(item) => handleDeleteItem(item, "requirements")}
                />
              </TabsContent>

              <TabsContent value="test-matrix">
                <ItemTable
                  title="Platform Test Matrix"
                  items={libraryData.testMatrix}
                  columns={["Platform", "Mode", "Connection", "802.1X", "Notes", "Actions"]}
                  renderRow={(item: TestMatrixEntry) => (
                    <>
                      <TableCell>{item.platform}</TableCell>
                      <TableCell>{item.mode}</TableCell>
                      <TableCell>{item.connection_type}</TableCell>
                      <TableCell>{item.test_8021x || "N/A"}</TableCell>
                      <TableCell className="text-xs max-w-xs truncate">{item.notes}</TableCell>
                    </>
                  )}
                  onEdit={(item) => handleEditItem(item, "test-matrix")}
                  onDelete={(item) => handleDeleteItem(item, "test-matrix")}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
      {isDialogOpen && (
        <LibraryItemDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          item={editingItem}
          itemType={itemType}
          onSave={handleSaveItem}
        />
      )}
    </>
  )
}

function ItemTable({ title, items, columns, renderRow, onEdit, onDelete }: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col: string) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item)}
                disabled={!item.is_custom}
                title={!item.is_custom ? "Cannot delete baseline items" : "Delete item"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
