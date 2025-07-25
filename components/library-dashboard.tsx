"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface Vendor {
  id: number
  name: string
}

interface DeviceType {
  id: number
  name: string
}

type LibraryItem = Vendor | DeviceType
type LibraryCategory = "vendors" | "device-types"

export default function LibraryDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newItemName, setNewItemName] = useState("")
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("vendors")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchData = useCallback(async (category: LibraryCategory) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/library/${category}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category}`)
      }
      const data = await response.json()
      if (category === "vendors") {
        setVendors(data)
      } else {
        setDeviceTypes(data)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: `Could not load ${category}.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(activeCategory)
  }, [activeCategory, fetchData])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    try {
      const response = await fetch(`/api/library/${activeCategory}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create ${activeCategory}`)
      }

      toast({
        title: "Success",
        description: `${activeCategory.slice(0, -1)} created successfully.`,
      })
      setNewItemName("")
      setIsDialogOpen(false)
      fetchData(activeCategory) // Refresh data
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: `Could not create ${activeCategory.slice(0, -1)}.`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${activeCategory.slice(0, -1)}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/library/${activeCategory}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${activeCategory}`)
      }

      toast({
        title: "Success",
        description: `${activeCategory.slice(0, -1)} deleted successfully.`,
      })
      fetchData(activeCategory) // Refresh data
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: `Could not delete ${activeCategory.slice(0, -1)}.`,
        variant: "destructive",
      })
    }
  }

  const currentItems = useMemo(() => {
    return activeCategory === "vendors" ? vendors : deviceTypes
  }, [activeCategory, vendors, deviceTypes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Library</CardTitle>
        <div className="flex justify-between items-center pt-2">
          <div className="flex space-x-1 rounded-md bg-muted p-1">
            <Button
              variant={activeCategory === "vendors" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("vendors")}
            >
              Vendors
            </Button>
            <Button
              variant={activeCategory === "device-types" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("device-types")}
            >
              Device Types
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New {activeCategory === "vendors" ? "Vendor" : "Device Type"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New {activeCategory === "vendors" ? "Vendor" : "Device Type"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item: LibraryItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && currentItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No {activeCategory.replace("-", " ")} found.</div>
        )}
      </CardContent>
    </Card>
  )
}
