'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Users, Plus, Edit, Trash2, Mail, Phone, UserCheck, Settings } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  avatar?: string
}

interface UserManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserManagementModal({ isOpen, onClose }: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState('project-managers')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)

  const [projectManagers, setProjectManagers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Senior Project Manager',
      department: 'IT Operations'
    },
    {
      id: '2',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'Project Manager',
      department: 'Network Engineering'
    }
  ])

  const [technicalOwners, setTechnicalOwners] = useState<User[]>([
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      role: 'Network Administrator',
      department: 'IT Infrastructure'
    },
    {
      id: '4',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      phone: '+1 (555) 456-7890',
      role: 'Security Engineer',
      department: 'Information Security'
    },
    {
      id: '5',
      name: 'Tom Rodriguez',
      email: 'tom.rodriguez@company.com',
      phone: '+1 (555) 567-8901',
      role: 'Systems Engineer',
      department: 'IT Infrastructure'
    },
    {
      id: '6',
      name: 'Jennifer Kim',
      email: 'jennifer.kim@company.com',
      phone: '+1 (555) 678-9012',
      role: 'Cloud Architect',
      department: 'Cloud Services'
    }
  ])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const handleAddUser = (userType: 'project-managers' | 'technical-owners') => {
    const newUser: User = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      role: userType === 'project-managers' ? 'Project Manager' : 'Technical Lead',
      department: ''
    }
    setEditingUser(newUser)
    setIsAddingUser(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setIsAddingUser(false)
  }

  const handleSaveUser = () => {
    if (!editingUser) return

    if (isAddingUser) {
      if (editingUser.role.includes('Project Manager')) {
        setProjectManagers(prev => [...prev, editingUser])
      } else {
        setTechnicalOwners(prev => [...prev, editingUser])
      }
    } else {
      if (editingUser.role.includes('Project Manager')) {
        setProjectManagers(prev => prev.map(user => 
          user.id === editingUser.id ? editingUser : user
        ))
      } else {
        setTechnicalOwners(prev => prev.map(user => 
          user.id === editingUser.id ? editingUser : user
        ))
      }
    }

    setEditingUser(null)
    setIsAddingUser(false)
  }

  const handleDeleteUser = (userId: string, userType: 'project-managers' | 'technical-owners') => {
    if (userType === 'project-managers') {
      setProjectManagers(prev => prev.filter(user => user.id !== userId))
    } else {
      setTechnicalOwners(prev => prev.filter(user => user.id !== userId))
    }
  }

  const UserCard = ({ user, userType, onEdit, onDelete }: { 
    user: User
    userType: 'project-managers' | 'technical-owners'
    onEdit: (user: User) => void
    onDelete: (userId: string, userType: 'project-managers' | 'technical-owners') => void
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(user.name)}`}>
            {getInitials(user.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(user.id, userType)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Badge variant="secondary" className="mb-2">{user.role}</Badge>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-3 w-3" />
                <span>{user.department}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="project-managers" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Project Managers</span>
            </TabsTrigger>
            <TabsTrigger value="technical-owners" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Technical Owners</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project-managers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Managers</h3>
              <Button onClick={() => handleAddUser('project-managers')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project Manager
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectManagers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  userType="project-managers"
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical-owners" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Technical Owners</h3>
              <Button onClick={() => handleAddUser('technical-owners')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Technical Owner
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalOwners.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  userType="technical-owners"
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {isAddingUser ? 'Add New User' : 'Edit User'}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senior Project Manager">Senior Project Manager</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Network Administrator">Network Administrator</SelectItem>
                      <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                      <SelectItem value="Systems Engineer">Systems Engineer</SelectItem>
                      <SelectItem value="Cloud Architect">Cloud Architect</SelectItem>
                      <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                      <SelectItem value="Infrastructure Engineer">Infrastructure Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editingUser.department}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    placeholder="Enter department"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => {
                  setEditingUser(null)
                  setIsAddingUser(false)
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  {isAddingUser ? 'Add User' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
