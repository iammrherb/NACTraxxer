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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>
        <div className="text-center py-12 text-muted-foreground">
          User management functionality will be implemented here
        </div>
      </DialogContent>
    </Dialog>
  )
}
