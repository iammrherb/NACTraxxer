"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, User, Mail, GripVertical, Save } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { toast } from "@/components/ui/use-toast"

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SortableUserItemProps {
  user: any
  onRemove: (id: string) => void
}

const SortableUserItem = ({ user, onRemove }: SortableUserItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: user.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 group"
    >
      <div className="flex items-center space-x-3">
        <div
          className="cursor-move touch-none flex items-center justify-center p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
          {getUserInitials(user.name)}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <Mail className="h-3 w-3 mr-1" />
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline">{user.role}</Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(user.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [projectManagers, setProjectManagers] = useState<any[]>([])
  const [technicalOwners, setTechnicalOwners] = useState<any[]>([])
  const [newPMName, setNewPMName] = useState("")
  const [newPMEmail, setNewPMEmail] = useState("")
  const [newTOName, setNewTOName] = useState("")
  const [newTOEmail, setNewTOEmail] = useState("")
  const [newTORole, setNewTORole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load users from API
  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use localStorage as a temporary solution
      const storedPMs = localStorage.getItem("projectManagers")
      const storedTOs = localStorage.getItem("technicalOwners")

      if (storedPMs) {
        setProjectManagers(JSON.parse(storedPMs))
      } else {
        // Default data if nothing is stored
        setProjectManagers([
          { id: "1", name: "Alex Rivera", email: "alex.rivera@abm.com", role: "Senior Project Manager" },
          { id: "2", name: "Marcus Chen", email: "marcus.chen@abm.com", role: "Project Manager" },
          { id: "3", name: "Sofia Linden", email: "sofia.linden@abm.com", role: "Project Manager" },
          { id: "4", name: "Michael Zhang", email: "michael.zhang@abm.com", role: "Project Manager" },
        ])
      }

      if (storedTOs) {
        setTechnicalOwners(JSON.parse(storedTOs))
      } else {
        // Default data if nothing is stored
        setTechnicalOwners([
          { id: "1", name: "John Smith", email: "john.smith@abm.com", role: "Network Administrator" },
          { id: "2", name: "Mark Wilson", email: "mark.wilson@abm.com", role: "Security Engineer" },
          { id: "3", name: "Emily Jones", email: "emily.jones@abm.com", role: "Network Engineer" },
          { id: "4", name: "Paul Davis", email: "paul.davis@abm.com", role: "IT Manager" },
          { id: "5", name: "Sarah Thompson", email: "sarah.thompson@abm.com", role: "Network Administrator" },
          { id: "6", name: "Carlos Mendez", email: "carlos.mendez@abm.com", role: "Network Engineer" },
        ])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveUsers = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use localStorage as a temporary solution
      localStorage.setItem("projectManagers", JSON.stringify(projectManagers))
      localStorage.setItem("technicalOwners", JSON.stringify(technicalOwners))

      toast({
        title: "Success",
        description: "User data saved successfully",
      })
    } catch (error) {
      console.error("Error saving users:", error)
      toast({
        title: "Error",
        description: "Failed to save users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addProjectManager = () => {
    if (newPMName && newPMEmail) {
      const newPM = {
        id: Date.now().toString(),
        name: newPMName,
        email: newPMEmail,
        role: "Project Manager",
      }
      setProjectManagers([...projectManagers, newPM])
      setNewPMName("")
      setNewPMEmail("")
    }
  }

  const addTechnicalOwner = () => {
    if (newTOName && newTOEmail && newTORole) {
      const newTO = {
        id: Date.now().toString(),
        name: newTOName,
        email: newTOEmail,
        role: newTORole,
      }
      setTechnicalOwners([...technicalOwners, newTO])
      setNewTOName("")
      setNewTOEmail("")
      setNewTORole("")
    }
  }

  const removeProjectManager = (id: string) => {
    setProjectManagers(projectManagers.filter((pm) => pm.id !== id))
  }

  const removeTechnicalOwner = (id: string) => {
    setTechnicalOwners(technicalOwners.filter((to) => to.id !== id))
  }

  const handlePMDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setProjectManagers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newArray = [...items]
        const [removed] = newArray.splice(oldIndex, 1)
        newArray.splice(newIndex, 0, removed)

        return newArray
      })
    }
  }

  const handleTODragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setTechnicalOwners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newArray = [...items]
        const [removed] = newArray.splice(oldIndex, 1)
        newArray.splice(newIndex, 0, removed)

        return newArray
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Managers Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Project Managers</CardTitle>
              <div className="text-sm text-gray-500">{projectManagers.length} users</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Project Managers */}
                <div className="space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handlePMDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext items={projectManagers.map((pm) => pm.id)} strategy={verticalListSortingStrategy}>
                      {projectManagers.map((pm) => (
                        <SortableUserItem key={pm.id} user={pm} onRemove={removeProjectManager} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Add New Project Manager */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Project Manager</h4>
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Full Name"
                      value={newPMName}
                      onChange={(e) => setNewPMName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={newPMEmail}
                      onChange={(e) => setNewPMEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addProjectManager} disabled={!newPMName || !newPMEmail}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Owners Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Technical Owners</CardTitle>
              <div className="text-sm text-gray-500">{technicalOwners.length} users</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Technical Owners */}
                <div className="space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleTODragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext items={technicalOwners.map((to) => to.id)} strategy={verticalListSortingStrategy}>
                      {technicalOwners.map((to) => (
                        <SortableUserItem key={to.id} user={to} onRemove={removeTechnicalOwner} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Add New Technical Owner */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Technical Owner</h4>
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Full Name"
                      value={newTOName}
                      onChange={(e) => setNewTOName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={newTOEmail}
                      onChange={(e) => setNewTOEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={newTORole} onValueChange={setNewTORole}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Network Administrator">Network Administrator</SelectItem>
                        <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                        <SelectItem value="IT Manager">IT Manager</SelectItem>
                        <SelectItem value="System Administrator">System Administrator</SelectItem>
                        <SelectItem value="Network Engineer">Network Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addTechnicalOwner} disabled={!newTOName || !newTOEmail || !newTORole}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              saveUsers()
              onOpenChange(false)
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
