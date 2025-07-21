"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { DatabaseUser } from "@/lib/database"

interface UserManagementProps {
  users: DatabaseUser[]
  isOpen: boolean
  onClose: () => void
  onCreateUser: (userData: Omit<DatabaseUser, "id" | "created_at" | "updated_at">) => void
  onUpdateUser: (id: number, userData: Partial<DatabaseUser>) => void
  onDeleteUser: (id: number) => void
}

export function UserManagement({
  users,
  isOpen,
  onClose,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<"project_manager" | "technical_owner">("project_manager")
  const [editingUser, setEditingUser] = useState<DatabaseUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    user_type: "project_manager" as "project_manager" | "technical_owner",
  })

  const projectManagers = users.filter((user) => user.user_type === "project_manager")
  const technicalOwners = users.filter((user) => user.user_type === "technical_owner")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      onUpdateUser(editingUser.id, formData)
    } else {
      onCreateUser(formData)
    }

    setFormData({ name: "", email: "", role: "", user_type: activeTab })
    setEditingUser(null)
  }

  const handleEdit = (user: DatabaseUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      user_type: user.user_type,
    })
  }

  const handleDelete = (user: DatabaseUser) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDeleteUser(user.id)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "", user_type: activeTab })
    setEditingUser(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab("project_manager")
                resetForm()
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "project_manager"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Project Managers ({projectManagers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("technical_owner")
                resetForm()
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "technical_owner"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Technical Owners ({technicalOwners.length})
            </button>
          </div>

          {/* Add/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingUser ? "Edit" : "Add New"}{" "}
                {activeTab === "project_manager" ? "Project Manager" : "Technical Owner"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "project_manager" ? (
                        <>
                          <SelectItem value="Project Manager">Project Manager</SelectItem>
                          <SelectItem value="Senior Project Manager">Senior Project Manager</SelectItem>
                          <SelectItem value="Lead Project Manager">Lead Project Manager</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Network Administrator">Network Administrator</SelectItem>
                          <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                          <SelectItem value="Network Engineer">Network Engineer</SelectItem>
                          <SelectItem value="System Administrator">System Administrator</SelectItem>
                          <SelectItem value="IT Manager">IT Manager</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 flex justify-end space-x-2">
                  {editingUser && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingUser ? "Update" : "Add"} User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* User List */}
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === "project_manager" ? "Project Managers" : "Technical Owners"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(activeTab === "project_manager" ? projectManagers : technicalOwners).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {(activeTab === "project_manager" ? projectManagers : technicalOwners).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No {activeTab === "project_manager" ? "project managers" : "technical owners"} found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
