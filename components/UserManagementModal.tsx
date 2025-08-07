'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, Edit, Trash2, Shield, UserCheck, UserX, Search, Filter } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'engineer' | 'viewer' | 'manager'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  permissions: string[]
  department: string
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
      email: 'john.smith@abm.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20T10:30:00Z',
      permissions: ['full_access', 'user_management', 'system_config'],
      department: 'IT Operations'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@abm.com',
      role: 'engineer',
      status: 'active',
      lastLogin: '2024-01-19T15:45:00Z',
      permissions: ['site_management', 'policy_config', 'deployment'],
      department: 'Network Engineering'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@abm.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-18T09:15:00Z',
      permissions: ['reporting', 'site_management', 'user_view'],
      department: 'IT Management'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      email: 'lisa.chen@abm.com',
      role: 'viewer',
      status: 'active',
      lastLogin: '2024-01-17T14:20:00Z',
      permissions: ['read_only', 'reporting'],
      department: 'Security'
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.wilson@abm.com',
      role: 'engineer',
      status: 'pending',
      lastLogin: 'Never',
      permissions: ['site_management', 'policy_config'],
      department: 'Network Engineering'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const roles = [
    { id: 'admin', label: 'Administrator', color: 'bg-red-500', permissions: ['full_access', 'user_management', 'system_config'] },
    { id: 'manager', label: 'Manager', color: 'bg-blue-500', permissions: ['reporting', 'site_management', 'user_view'] },
    { id: 'engineer', label: 'Engineer', color: 'bg-green-500', permissions: ['site_management', 'policy_config', 'deployment'] },
    { id: 'viewer', label: 'Viewer', color: 'bg-gray-500', permissions: ['read_only', 'reporting'] }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    const roleInfo = roles.find(r => r.id === role)
    return roleInfo?.color || 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4" />
      case 'inactive': return <UserX className="w-4 h-4" />
      case 'pending': return <Shield className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const handleAddUser = () => {
    setSelectedUser({
      id: '',
      name: '',
      email: '',
      role: 'viewer',
      status: 'pending',
      lastLogin: 'Never',
      permissions: ['read_only'],
      department: ''
    })
    setIsEditing(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser({ ...user })
    setIsEditing(true)
  }

  const handleSaveUser = () => {
    if (!selectedUser) return

    if (selectedUser.id) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
    } else {
      // Add new user
      const newUser = { ...selectedUser, id: Date.now().toString() }
      setUsers([...users, newUser])
    }

    setSelectedUser(null)
    setIsEditing(false)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  const handleRoleChange = (role: string) => {
    if (!selectedUser) return
    
    const roleInfo = roles.find(r => r.id === role)
    if (roleInfo) {
      setSelectedUser({
        ...selectedUser,
        role: role as User['role'],
        permissions: roleInfo.permissions
      })
    }
  }

  const activeUsers = users.filter(u => u.status === 'active').length
  const pendingUsers = users.filter(u => u.status === 'pending').length
  const totalUsers = users.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="p-2 bg-[#00c8d7] rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-[#00c8d7]">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-[#00c8d7]">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#00c8d7]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Users</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingUsers}</p>
                  </div>
                  <Shield className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Directory</TabsTrigger>
              <TabsTrigger value="roles">Role Management</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {/* Filters and Search */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAddUser}
                  className="bg-[#00c8d7] hover:bg-[#0099cc]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
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
                          <TableCell className="font-semibold">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getRoleColor(user.role)} text-white`}>
                              {roles.find(r => r.id === user.role)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusColor(user.status)} text-white`}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1 capitalize">{user.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
