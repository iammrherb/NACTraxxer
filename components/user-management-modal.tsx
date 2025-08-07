'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Mail, Phone, Building, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'project-manager' | 'technical-owner' | 'viewer'
  department: string
  status: 'active' | 'inactive'
  lastLogin: string
}

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      department: 'IT Security',
      status: 'active',
      lastLogin: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'technical-owner',
      department: 'Network Operations',
      status: 'active',
      lastLogin: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      phone: '+1 (555) 345-6789',
      role: 'project-manager',
      department: 'IT Projects',
      status: 'active',
      lastLogin: '2024-01-13'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      email: 'lisa.chen@company.com',
      phone: '+1 (555) 456-7890',
      role: 'viewer',
      department: 'Business Operations',
      status: 'inactive',
      lastLogin: '2024-01-10'
    }
  ])

  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', variant: 'default' as const, color: 'bg-red-100 text-red-800' },
      'project-manager': { label: 'Project Manager', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'technical-owner': { label: 'Technical Owner', variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
      viewer: { label: 'Viewer', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: (users.length + 1).toString()
    }
    setUsers([...users, user])
    setShowAddUser(false)
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>User Management</span>
          </DialogTitle>
          <DialogDescription>
            Manage user access and permissions for the NAC Architecture Designer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="text-sm">
                <span className="font-medium">Total Users:</span> {users.length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Active:</span> {users.filter(u => u.status === 'active').length}
              </div>
            </div>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{user.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <AddUserForm onSubmit={handleAddUser} onCancel={() => setShowAddUser(false)} />
          </div>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <EditUserForm 
              user={editingUser} 
              onSubmit={handleEditUser} 
              onCancel={() => setEditingUser(null)} 
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Add User Form Component
function AddUserForm({ onSubmit, onCancel }: { onSubmit: (user: Omit<User, 'id'>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer' as const,
    department: '',
    status: 'active' as const,
    lastLogin: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Input
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={formData.role} onValueChange={(value: 'admin' | 'project-manager' | 'technical-owner' | 'viewer') => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="project-manager">Project Manager</SelectItem>
              <SelectItem value="technical-owner">Technical Owner</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add User
        </Button>
      </div>
    </form>
  )
}

// Edit User Form Component
function EditUserForm({ user, onSubmit, onCancel }: { user: User, onSubmit: (user: User) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(user)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Input
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={formData.role} onValueChange={(value: 'admin' | 'project-manager' | 'technical-owner' | 'viewer') => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="project-manager">Project Manager</SelectItem>
              <SelectItem value="technical-owner">Technical Owner</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update User
        </Button>
      </div>
    </form>
  )
}
