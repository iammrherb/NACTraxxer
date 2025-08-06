'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, User, Mail } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [projectManagers, setProjectManagers] = useState<User[]>([
    { id: '1', name: 'Alex Rivera', email: 'alex.rivera@abm.com', role: 'Senior Project Manager' },
    { id: '2', name: 'Marcus Chen', email: 'marcus.chen@abm.com', role: 'Project Manager' },
    { id: '3', name: 'Sofia Linden', email: 'sofia.linden@abm.com', role: 'Project Manager' },
    { id: '4', name: 'Michael Zhang', email: 'michael.zhang@abm.com', role: 'Project Manager' },
    { id: '5', name: 'Maria Rodriguez', email: 'maria.rodriguez@abm.com', role: 'Project Manager' },
    { id: '6', name: 'James Wilson', email: 'james.wilson@abm.com', role: 'Project Manager' }
  ])

  const [technicalOwners, setTechnicalOwners] = useState<User[]>([
    { id: '1', name: 'John Smith', email: 'john.smith@abm.com', role: 'Network Administrator' },
    { id: '2', name: 'Mark Wilson', email: 'mark.wilson@abm.com', role: 'Security Engineer' },
    { id: '3', name: 'Emily Jones', email: 'emily.jones@abm.com', role: 'Network Engineer' },
    { id: '4', name: 'Paul Davis', email: 'paul.davis@abm.com', role: 'IT Manager' },
    { id: '5', name: 'Sarah Thompson', email: 'sarah.thompson@abm.com', role: 'Network Administrator' },
    { id: '6', name: 'Carlos Mendez', email: 'carlos.mendez@abm.com', role: 'Network Engineer' },
    { id: '7', name: 'Diego Ruiz', email: 'diego.ruiz@abm.com', role: 'Security Engineer' },
    { id: '8', name: 'Jennifer Lee', email: 'jennifer.lee@abm.com', role: 'System Administrator' }
  ])

  const [newPMName, setNewPMName] = useState('')
  const [newPMEmail, setNewPMEmail] = useState('')
  const [newTOName, setNewTOName] = useState('')
  const [newTOEmail, setNewTOEmail] = useState('')
  const [newTORole, setNewTORole] = useState('')

  const addProjectManager = () => {
    if (newPMName && newPMEmail) {
      const newPM: User = {
        id: Date.now().toString(),
        name: newPMName,
        email: newPMEmail,
        role: 'Project Manager'
      }
      setProjectManagers([...projectManagers, newPM])
      setNewPMName('')
      setNewPMEmail('')
    }
  }

  const addTechnicalOwner = () => {
    if (newTOName && newTOEmail && newTORole) {
      const newTO: User = {
        id: Date.now().toString(),
        name: newTOName,
        email: newTOEmail,
        role: newTORole
      }
      setTechnicalOwners([...technicalOwners, newTO])
      setNewTOName('')
      setNewTOEmail('')
      setNewTORole('')
    }
  }

  const removeProjectManager = (id: string) => {
    setProjectManagers(projectManagers.filter(pm => pm.id !== id))
  }

  const removeTechnicalOwner = (id: string) => {
    setTechnicalOwners(technicalOwners.filter(to => to.id !== id))
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
            <CardHeader>
              <CardTitle className="text-lg">Project Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Project Managers */}
                <div className="space-y-3">
                  {projectManagers.map((pm) => (
                    <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {getUserInitials(pm.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{pm.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {pm.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{pm.role}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProjectManager(pm.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
            <CardHeader>
              <CardTitle className="text-lg">Technical Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Technical Owners */}
                <div className="space-y-3">
                  {technicalOwners.map((to) => (
                    <div key={to.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {getUserInitials(to.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{to.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {to.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{to.role}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTechnicalOwner(to.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
