'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Plus, Edit, Trash2, Mail, Phone, Shield, UserCheck, UserX } from 'lucide-react'

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'project-manager' | 'engineer' | 'viewer'
  department: string
  phone?: string
  status: 'active' | 'inactive'
  lastLogin?: string
  permissions: string[]
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      email: 'alex.rivera@company.com',
      role: 'admin',
      department: 'IT Security',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastLogin: '2024-02-15T10:30:00Z',
      permissions: ['full-access', 'user-management', 'site-management', 'policy-management']
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'project-manager',
      department: 'Network Operations',
      phone: '+1 (555) 234-5678',
      status: 'active',
      lastLogin: '2024-02-14T16:45:00Z',
      permissions: ['site-management', 'progress-tracking', 'workbook-access']
    },
    {
      id: '3',
      name: 'Emily Jones',
      email: 'emily.jones@company.com',
      role: 'engineer',
      department: 'Network Engineering',
      phone: '+1 (555) 345-6789',
      status: 'active',
      lastLogin: '2024-02-15T09:15:00Z',
      permissions: ['site-management', 'policy-management', 'workbook-access']
    },
    {
      id: '4',
      name: 'Michael Zhang',
      email: 'michael.zhang@company.com',
      role: 'project-manager',
      department: 'Infrastructure',
      phone: '+1 (555) 456-7890',
      status: 'active',
      lastLogin: '2024-02-13T14:20:00Z',
      permissions: ['site-management', 'progress-tracking']
    },
    {
      id: '5',
      name: 'Sarah Thompson',
      email: 'sarah.thompson@company.com',
      role: 'viewer',
      department: 'Management',
      status: 'inactive',
      lastLogin: '2024-02-10T11:30:00Z',
      permissions: ['read-only']
    }
  ])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'viewer',
    department: '',
    phone: '',
    status: 'active',
    permissions: []
  })

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'bg-red-100 text-red-800' },
    { value: 'project-manager', label: 'Project Manager', color: 'bg-blue-100 text-blue-800' },
    { value: 'engineer', label: 'Engineer', color: 'bg-green-100 text-green-800' },
    { value: 'viewer', label: 'Viewer', color: 'bg-gray-100 text-gray-800' }
  ]

  const permissions = [
    { id: 'full-access', label: 'Full Access', description: 'Complete system access' },
    { id: 'user-management', label: 'User Management', description: 'Manage users and permissions' },
    { id: 'site-management', label: 'Site Management', description: 'Manage sites and configurations' },
    { id: 'policy-management', label: 'Policy Management', description: 'Create and modify policies' },
    { id: 'progress-tracking', label: 'Progress Tracking', description: 'View deployment progress' },
    { id: 'workbook-access', label: 'Workbook Access', description: 'Access site workbooks' },
    { id: 'read-only', label: 'Read Only', description: 'View-only access to all features' }
  ]

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as User['role'],
      department: newUser.department || '',
      phone: newUser.phone,
      status: newUser.status as User['status'],
      permissions: newUser.permissions || [],
      lastLogin: undefined
    }

    setUsers([...users, user])
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      department: '',
      phone: '',
      status: 'active',
      permissions: []
    })
    showNotification('User added successfully!', 'success')
  }

  const handleUpdateUser = () => {
    if (!selectedUser) return

    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ))
    setIsEditing(false)
    setSelectedUser(null)
    showNotification('User updated successfully!', 'success')
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
    if (selectedUser?.id === userId) {
      setSelectedUser(null)
      setIsEditing(false)
    }
    showNotification('User deleted successfully!', 'success')
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.value === role)
    return roleData?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' 
      ? <UserCheck className="h-4 w-4 text-green-500" />
      : <UserX className="h-4 w-4 text-red-500" />
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#00c8d7]" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Directory</TabsTrigger>
            <TabsTrigger value="add-user">Add User</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {roles.find(r => r.value === user.role)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditing(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === 'active' ? (
                              <UserX className="h-4 w-4 text-red-500" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
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
          </TabsContent>

          <TabsContent value="add-user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Full Name *</Label>
                    <Input
                      id="new-name"
                      value={newUser.name || ''}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email Address *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email || ''}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <Select
                      value={newUser.role || 'viewer'}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value as User['role'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-department">Department</Label>
                    <Input
                      id="new-department"
                      value={newUser.department || ''}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-phone">Phone Number</Label>
                  <Input
                    id="new-phone"
                    value={newUser.phone || ''}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={newUser.permissions?.includes(permission.id) || false}
                          onChange={(e) => {
                            const currentPermissions = newUser.permissions || []
                            if (e.target.checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [...currentPermissions, permission.id]
                              })
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: currentPermissions.filter(p => p !== permission.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setNewUser({
                      name: '',
                      email: '',
                      role: 'viewer',
                      department: '',
                      phone: '',
                      status: 'active',
                      permissions: []
                    })}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email}
                    className="bg-[#00c8d7] hover:bg-[#0099cc]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit User: {selectedUser.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as User['role'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-department">Department</Label>
                    <Input
                      id="edit-department"
                      value={selectedUser.department}
                      onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-${permission.id}`}
                          checked={selectedUser.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUser({
                                ...selectedUser,
                                permissions: [...selectedUser.permissions, permission.id]
                              })
                            } else {
                              setSelectedUser({
                                ...selectedUser,
                                permissions: selectedUser.permissions.filter(p => p !== permission.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedUser(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateUser}
                    className="bg-[#00c8d7] hover:bg-[#0099cc]"
                  >
                    Update User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
