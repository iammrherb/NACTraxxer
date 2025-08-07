'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Plus, Edit, Trash2, Save, X, Download, Upload, UserPlus, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  phone?: string
  active: boolean
  lastLogin?: string
  permissions: string[]
}

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [projectManagers, setProjectManagers] = useState<User[]>([])
  const [technicalOwners, setTechnicalOwners] = useState<User[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [activeTab, setActiveTab] = useState('project-managers')

  // Sample initial data
  const initialProjectManagers: User[] = [
    {
      id: '1',
      name: 'Alex Rivera',
      email: 'alex.rivera@abm.com',
      role: 'Senior Project Manager',
      department: 'IT Operations',
      phone: '+1-555-0101',
      active: true,
      lastLogin: '2025-01-15T10:30:00Z',
      permissions: ['site-management', 'user-management', 'reporting']
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus.chen@abm.com',
      role: 'Project Manager',
      department: 'Network Engineering',
      phone: '+1-555-0102',
      active: true,
      lastLogin: '2025-01-14T15:45:00Z',
      permissions: ['site-management', 'reporting']
    },
    {
      id: '3',
      name: 'Sofia Linden',
      email: 'sofia.linden@abm.com',
      role: 'Project Manager',
      department: 'EMEA Operations',
      phone: '+49-30-12345678',
      active: true,
      lastLogin: '2025-01-13T09:15:00Z',
      permissions: ['site-management', 'reporting']
    },
    {
      id: '4',
      name: 'Michael Zhang',
      email: 'michael.zhang@abm.com',
      role: 'Project Manager',
      department: 'APAC Operations',
      phone: '+65-6123-4567',
      active: true,
      lastLogin: '2025-01-12T14:20:00Z',
      permissions: ['site-management', 'reporting']
    }
  ]

  const initialTechnicalOwners: User[] = [
    {
      id: '5',
      name: 'John Smith',
      email: 'john.smith@abm.com',
      role: 'Lead Network Engineer',
      department: 'Network Engineering',
      phone: '+1-555-0201',
      active: true,
      lastLogin: '2025-01-15T11:00:00Z',
      permissions: ['technical-implementation', 'troubleshooting']
    },
    {
      id: '6',
      name: 'Mark Wilson',
      email: 'mark.wilson@abm.com',
      role: 'Security Architect',
      department: 'Information Security',
      phone: '+1-555-0202',
      active: true,
      lastLogin: '2025-01-15T08:30:00Z',
      permissions: ['security-policies', 'technical-implementation']
    },
    {
      id: '7',
      name: 'Emily Jones',
      email: 'emily.jones@abm.com',
      role: 'Network Engineer',
      department: 'Network Engineering',
      phone: '+1-555-0203',
      active: true,
      lastLogin: '2025-01-14T16:45:00Z',
      permissions: ['technical-implementation', 'monitoring']
    },
    {
      id: '8',
      name: 'Paul Davis',
      email: 'paul.davis@abm.com',
      role: 'Senior Network Engineer',
      department: 'Network Engineering',
      phone: '+1-555-0204',
      active: true,
      lastLogin: '2025-01-14T12:15:00Z',
      permissions: ['technical-implementation', 'troubleshooting', 'monitoring']
    },
    {
      id: '9',
      name: 'Sarah Thompson',
      email: 'sarah.thompson@abm.com',
      role: 'Network Administrator',
      department: 'EMEA Operations',
      phone: '+49-30-87654321',
      active: true,
      lastLogin: '2025-01-13T10:30:00Z',
      permissions: ['technical-implementation', 'monitoring']
    },
    {
      id: '10',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@abm.com',
      role: 'Network Engineer',
      department: 'LATAM Operations',
      phone: '+52-55-1234-5678',
      active: true,
      lastLogin: '2025-01-12T13:45:00Z',
      permissions: ['technical-implementation', 'troubleshooting']
    }
  ]

  const availablePermissions = [
    'site-management',
    'user-management',
    'reporting',
    'technical-implementation',
    'troubleshooting',
    'monitoring',
    'security-policies',
    'configuration-export',
    'diagram-editing'
  ]

  const departments = [
    'IT Operations',
    'Network Engineering',
    'Information Security',
    'EMEA Operations',
    'APAC Operations',
    'LATAM Operations'
  ]

  useEffect(() => {
    // Load users from localStorage or use initial data
    const savedPMs = localStorage.getItem('portnox-project-managers')
    const savedTOs = localStorage.getItem('portnox-technical-owners')

    if (savedPMs) {
      try {
        setProjectManagers(JSON.parse(savedPMs))
      } catch (error) {
        console.error('Failed to load project managers:', error)
        setProjectManagers(initialProjectManagers)
      }
    } else {
      setProjectManagers(initialProjectManagers)
    }

    if (savedTOs) {
      try {
        setTechnicalOwners(JSON.parse(savedTOs))
      } catch (error) {
        console.error('Failed to load technical owners:', error)
        setTechnicalOwners(initialTechnicalOwners)
      }
    } else {
      setTechnicalOwners(initialTechnicalOwners)
    }
  }, [])

  useEffect(() => {
    // Save users to localStorage whenever they change
    localStorage.setItem('portnox-project-managers', JSON.stringify(projectManagers))
    localStorage.setItem('portnox-technical-owners', JSON.stringify(technicalOwners))
  }, [projectManagers, technicalOwners])

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || '',
        phone: newUser.phone || '',
        active: true,
        permissions: newUser.permissions || [],
        lastLogin: new Date().toISOString()
      }

      if (activeTab === 'project-managers') {
        setProjectManagers([...projectManagers, user])
      } else {
        setTechnicalOwners([...technicalOwners, user])
      }

      setNewUser({})
      setShowAddUser(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdateUser = () => {
    if (editingUser) {
      if (activeTab === 'project-managers') {
        setProjectManagers(projectManagers.map(pm => pm.id === editingUser.id ? editingUser : pm))
      } else {
        setTechnicalOwners(technicalOwners.map(to => to.id === editingUser.id ? editingUser : to))
      }
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      if (activeTab === 'project-managers') {
        setProjectManagers(projectManagers.filter(pm => pm.id !== userId))
      } else {
        setTechnicalOwners(technicalOwners.filter(to => to.id !== userId))
      }
    }
  }

  const toggleUserActive = (userId: string) => {
    if (activeTab === 'project-managers') {
      setProjectManagers(projectManagers.map(pm => 
        pm.id === userId ? { ...pm, active: !pm.active } : pm
      ))
    } else {
      setTechnicalOwners(technicalOwners.map(to => 
        to.id === userId ? { ...to, active: !to.active } : to
      ))
    }
  }

  const exportUsers = () => {
    const allUsers = [...projectManagers, ...technicalOwners]
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Phone', 'Active', 'Last Login', 'Permissions'].join(','),
      ...allUsers.map(user => [
        `"${user.name}"`,
        user.email,
        `"${user.role}"`,
        `"${user.department || ''}"`,
        `"${user.phone || ''}"`,
        user.active ? 'Yes' : 'No',
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '',
        `"${user.permissions.join('; ')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-users-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string
          const lines = csv.split('\n')
          const headers = lines[0].split(',')
          
          // Parse CSV and import users (simplified implementation)
          console.log('Importing users from CSV:', headers)
          // In a real implementation, this would parse the CSV and add users
        } catch (error) {
          console.error('Failed to import users:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handlePermissionToggle = (user: User, permission: string) => {
    const updatedPermissions = user.permissions.includes(permission)
      ? user.permissions.filter(p => p !== permission)
      : [...user.permissions, permission]
    
    const updatedUser = { ...user, permissions: updatedPermissions }
    
    if (activeTab === 'project-managers') {
      setProjectManagers(projectManagers.map(pm => pm.id === user.id ? updatedUser : pm))
    } else {
      setTechnicalOwners(technicalOwners.map(to => to.id === user.id ? updatedUser : to))
    }
  }

  const currentUsers = activeTab === 'project-managers' ? projectManagers : technicalOwners

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button onClick={() => setShowAddUser(true)} size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button onClick={exportUsers} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importUsers}
                  style={{ display: 'none' }}
                  id="import-users"
                />
                <Button
                  onClick={() => document.getElementById('import-users')?.click()}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
              </div>
            </div>
          </div>

          {/* User Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="project-managers">
                Project Managers ({projectManagers.length})
              </TabsTrigger>
              <TabsTrigger value="technical-owners">
                Technical Owners ({technicalOwners.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="project-managers" className="space-y-4">
              <div className="grid gap-4">
                {projectManagers.map((user) => (
                  <Card key={user.id} className={!user.active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.role}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.department && (
                              <p className="text-xs text-gray-500">{user.department}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.active ? 'default' : 'secondary'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserActive(user.id)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
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
                        </div>
                      </div>
                      {user.permissions.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical-owners" className="space-y-4">
              <div className="grid gap-4">
                {technicalOwners.map((user) => (
                  <Card key={user.id} className={!user.active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-lg">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.role}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.department && (
                              <p className="text-xs text-gray-500">{user.department}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.active ? 'default' : 'secondary'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserActive(user.id)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
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
                        </div>
                      </div>
                      {user.permissions.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Add User Modal */}
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New {activeTab === 'project-managers' ? 'Project Manager' : 'Technical Owner'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Full Name *</Label>
                    <Input
                      id="new-name"
                      value={newUser.name || ''}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email || ''}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="john.doe@abm.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role">Role *</Label>
                    <Input
                      id="new-role"
                      value={newUser.role || ''}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      placeholder="Network Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-department">Department</Label>
                    <Select
                      value={newUser.department || ''}
                      onValueChange={(value) => setNewUser({...newUser, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-phone">Phone</Label>
                    <Input
                      id="new-phone"
                      value={newUser.phone || ''}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`new-perm-${permission}`}
                          checked={newUser.permissions?.includes(permission) || false}
                          onChange={(e) => {
                            const currentPermissions = newUser.permissions || []
                            const updatedPermissions = e.target.checked
                              ? [...currentPermissions, permission]
                              : currentPermissions.filter(p => p !== permission)
                            setNewUser({...newUser, permissions: updatedPermissions})
                          }}
                        />
                        <Label htmlFor={`new-perm-${permission}`} className="text-sm">
                          {permission.replace('-', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    <Save className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Modal */}
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
              </DialogHeader>
              {editingUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-role">Role</Label>
                      <Input
                        id="edit-role"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-department">Department</Label>
                      <Select
                        value={editingUser.department || ''}
                        onValueChange={(value) => setEditingUser({...editingUser, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        value={editingUser.phone || ''}
                        onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {availablePermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`edit-perm-${permission}`}
                            checked={editingUser.permissions.includes(permission)}
                            onChange={() => handlePermissionToggle(editingUser, permission)}
                          />
                          <Label htmlFor={`edit-perm-${permission}`} className="text-sm">
                            {permission.replace('-', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingUser(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateUser}>
                      <Save className="h-4 w-4 mr-2" />
                      Update User
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}
