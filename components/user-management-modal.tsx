'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar'
import { Plus, Edit, Trash2, Mail, Phone, User } from 'lucide-react'

interface UserManagementModalProps {
  open: boolean
  onClose: () => void
}

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  phone?: string
  status: 'active' | 'inactive'
}

export default function UserManagementModal({ open, onClose }: UserManagementModalProps) {
  const [projectManagers, setProjectManagers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      email: 'alex.rivera@abm.com',
      role: 'Senior Project Manager',
      department: 'IT Operations',
      phone: '+1 (555) 123-4567',
      status: 'active'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus.chen@abm.com',
      role: 'Project Manager',
      department: 'IT Operations',
      phone: '+1 (555) 234-5678',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sofia Linden',
      email: 'sofia.linden@abm.com',
      role: 'Project Manager',
      department: 'IT Operations',
      phone: '+1 (555) 345-6789',
      status: 'active'
    }
  ])

  const [technicalOwners, setTechnicalOwners] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@abm.com',
      role: 'Network Administrator',
      department: 'Network Operations',
      phone: '+1 (555) 456-7890',
      status: 'active'
    },
    {
      id: '2',
      name: 'Mark Wilson',
      email: 'mark.wilson@abm.com',
      role: 'Security Engineer',
      department: 'Information Security',
      phone: '+1 (555) 567-8901',
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Jones',
      email: 'emily.jones@abm.com',
      role: 'Network Engineer',
      department: 'Network Operations',
      phone: '+1 (555) 678-9012',
      status: 'active'
    },
    {
      id: '4',
      name: 'Paul Davis',
      email: 'paul.davis@abm.com',
      role: 'IT Manager',
      department: 'IT Operations',
      phone: '+1 (555) 789-0123',
      status: 'active'
    }
  ])

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: ''
  })

  const [editingUser, setEditingUser] = useState<User | null>(null)

  const addProjectManager = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department || 'IT Operations',
      phone: newUser.phone,
      status: 'active'
    }

    setProjectManagers([...projectManagers, user])
    setNewUser({ name: '', email: '', role: '', department: '', phone: '' })
  }

  const addTechnicalOwner = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department || 'Network Operations',
      phone: newUser.phone,
      status: 'active'
    }

    setTechnicalOwners([...technicalOwners, user])
    setNewUser({ name: '', email: '', role: '', department: '', phone: '' })
  }

  const deleteUser = (id: string, type: 'pm' | 'to') => {
    if (type === 'pm') {
      setProjectManagers(projectManagers.filter(user => user.id !== id))
    } else {
      setTechnicalOwners(technicalOwners.filter(user => user.id !== id))
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const UserCard = ({ user, type, onEdit, onDelete }: { 
    user: User, 
    type: 'pm' | 'to', 
    onEdit: (user: User) => void, 
    onDelete: (id: string) => void 
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-muted-foreground">{user.role}</p>
          <div className="flex items-center space-x-4 mt-1">
            <span className="flex items-center text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                {user.phone}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
          {user.status}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(user.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="project-managers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="project-managers">Project Managers</TabsTrigger>
            <TabsTrigger value="technical-owners">Technical Owners</TabsTrigger>
          </TabsList>

          <TabsContent value="project-managers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Managers</h3>
              <Badge variant="outline">{projectManagers.length} users</Badge>
            </div>

            <div className="space-y-3">
              {projectManagers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type="pm"
                  onEdit={setEditingUser}
                  onDelete={(id) => deleteUser(id, 'pm')}
                />
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Add New Project Manager</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pm-name">Full Name</Label>
                  <Input
                    id="pm-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="pm-email">Email</Label>
                  <Input
                    id="pm-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="pm-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senior Project Manager">Senior Project Manager</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Associate Project Manager">Associate Project Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pm-phone">Phone (Optional)</Label>
                  <Input
                    id="pm-phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <Button onClick={addProjectManager} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Project Manager
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="technical-owners" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Technical Owners</h3>
              <Badge variant="outline">{technicalOwners.length} users</Badge>
            </div>

            <div className="space-y-3">
              {technicalOwners.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type="to"
                  onEdit={setEditingUser}
                  onDelete={(id) => deleteUser(id, 'to')}
                />
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Add New Technical Owner</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="to-name">Full Name</Label>
                  <Input
                    id="to-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="to-email">Email</Label>
                  <Input
                    id="to-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="to-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Network Administrator">Network Administrator</SelectItem>
                      <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                      <SelectItem value="Network Engineer">Network Engineer</SelectItem>
                      <SelectItem value="System Administrator">System Administrator</SelectItem>
                      <SelectItem value="IT Manager">IT Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to-phone">Phone (Optional)</Label>
                  <Input
                    id="to-phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <Button onClick={addTechnicalOwner} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Technical Owner
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
