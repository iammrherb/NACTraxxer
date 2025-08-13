"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, User, Mail, GripVertical, Save, Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { storage, type User as UserType } from "@/lib/storage"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SortableUserItemProps {
  user: UserType
  onEdit: (user: UserType) => void
  onRemove: (id: string) => void
}

const SortableUserItem = ({ user, onEdit, onRemove }: SortableUserItemProps) => {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          {user.department && <p className="text-xs text-gray-500">{user.department}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={getRoleColor(user.role)} variant="outline">
          {user.role}
        </Badge>
        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="h-4 w-4" />
        </Button>
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
  const [users, setUsers] = useState<UserType[]>([])
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserType["role"],
    department: "",
    status: "active" as UserType["status"],
  })
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load users from storage
  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const loadedUsers = await storage.getUsers()
      setUsers(loadedUsers)
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

  const saveUsers = async (updatedUsers: UserType[]) => {
    try {
      await storage.saveUsers(updatedUsers)
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await storage.updateUser(editingUser.id, formData)
        if (updatedUser) {
          setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)))
          toast({
            title: "User updated",
            description: "The user has been updated successfully.",
          })
        }
      } else {
        // Create new user
        const newUser = await storage.createUser(formData)
        setUsers([...users, newUser])
        toast({
          title: "User created",
          description: "The user has been created successfully.",
        })
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "user",
        department: "",
        status: "active",
      })
      setEditingUser(null)
      setShowAddForm(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      status: user.status,
    })
    setShowAddForm(true)
  }

  const removeUser = async (id: string) => {
    try {
      const success = await storage.deleteUser(id)
      if (success) {
        setUsers(users.filter((u) => u.id !== id))
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully.",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = users.findIndex((item) => item.id === active.id)
      const newIndex = users.findIndex((item) => item.id === over.id)

      const newArray = [...users]
      const [removed] = newArray.splice(oldIndex, 1)
      newArray.splice(newIndex, 0, removed)

      setUsers(newArray)
      await saveUsers(newArray)
    }
  }

  const cancelForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      department: "",
      status: "active",
    })
    setEditingUser(null)
    setShowAddForm(false)
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
          {/* Add/Edit User Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingUser ? "Edit User" : "Add New User"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: UserType["role"]) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: UserType["status"]) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={cancelForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingUser ? "Update User" : "Create User"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Users ({users.length})</CardTitle>
              <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found. Add your first user to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext items={users.map((user) => user.id)} strategy={verticalListSortingStrategy}>
                      {users.map((user) => (
                        <SortableUserItem key={user.id} user={user} onEdit={handleEdit} onRemove={removeUser} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
