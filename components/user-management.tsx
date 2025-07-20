"use client"

import { useState, useMemo } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import type { User } from "@/lib/database"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"

interface UserManagementProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  onUpdate: () => void
}

export function UserManagement({ isOpen, onClose, users, onUpdate }: UserManagementProps) {
  const [isEditing, setIsEditing] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", role: "", user_type: "technical_owner" })

  const projectManagers = useMemo(() => users.filter((u) => u.user_type === "project_manager"), [users])
  const technicalOwners = useMemo(() => users.filter((u) => u.user_type === "technical_owner"), [users])

  const handleEdit = (user: User) => {
    setIsEditing(user)
    setFormData({ name: user.name, email: user.email, role: user.role, user_type: user.user_type })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await api.deleteUser(id)
      toast({ title: "Success", description: "User deleted." })
      onUpdate()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.updateUser(isEditing.id, formData)
        toast({ title: "Success", description: "User updated." })
      } else {
        await api.createUser(formData as Omit<User, "id">)
        toast({ title: "Success", description: "User created." })
      }
      onUpdate()
      resetForm()
    } catch (error) {
      toast({ title: "Error", description: "Failed to save user.", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setIsEditing(null)
    setFormData({ name: "", email: "", role: "", user_type: "technical_owner" })
  }

  const renderUserTable = (title: string, userList: User[]) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ScrollArea className="h-48 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>Manage project managers and technical owners for all sites.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {renderUserTable("Project Managers", projectManagers)}
          {renderUserTable("Technical Owners", technicalOwners)}
        </div>
        <div className="p-4 border-t">
          <h3 className="text-lg font-semibold mb-4">{isEditing ? `Editing ${isEditing.name}` : "Add New User"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="user_type">User Type</Label>
              <Select value={formData.user_type} onValueChange={(v: any) => setFormData({ ...formData, user_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="technical_owner">Technical Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                placeholder="e.g., Senior Network Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          {isEditing && (
            <Button variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
          <Button onClick={handleSave}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isEditing ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
