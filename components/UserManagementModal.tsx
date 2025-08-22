"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { storage, type User } from "@/lib/storage"
import { Users, Plus, Edit, Trash2, Phone, Building, Award, UserCheck, UserX, Search, Filter } from "lucide-react"

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "viewer",
    department: "",
    phone: "",
    specialties: [],
    certifications: [],
    isActive: true,
  })

  const roles = [
    { value: "admin", label: "Administrator", color: "bg-red-100 text-red-800" },
    { value: "project-manager", label: "Project Manager", color: "bg-blue-100 text-blue-800" },
    { value: "technical-owner", label: "Technical Owner", color: "bg-purple-100 text-purple-800" },
    { value: "site-owner", label: "Site Owner", color: "bg-green-100 text-green-800" },
    { value: "systems-engineer", label: "Systems Engineer", color: "bg-yellow-100 text-yellow-800" },
    { value: "account-executive", label: "Account Executive", color: "bg-pink-100 text-pink-800" },
    { value: "technical-account-manager", label: "Technical Account Manager", color: "bg-indigo-100 text-indigo-800" },
    { value: "technician", label: "Technician", color: "bg-orange-100 text-orange-800" },
    { value: "viewer", label: "Viewer", color: "bg-gray-100 text-gray-800" },
  ]

  useEffect(() => {
    if (open) {
      loadUsers()
    }
  }, [open])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const loadUsers = async () => {
    try {
      const userData = await storage.getUsers()
      setUsers(userData)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleCreateUser = () => {
    setIsCreating(true)
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      role: "viewer",
      department: "",
      phone: "",
      specialties: [],
      certifications: [],
      isActive: true,
    })
  }

  const handleEditUser = (user: User) => {
    setIsCreating(false)
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || "",
      specialties: [...user.specialties],
      certifications: [...user.certifications],
      isActive: user.isActive,
    })
  }

  const handleSaveUser = async () => {
    try {
      if (!formData.name || !formData.email || !formData.role) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (isCreating) {
        await storage.createUser({
          name: formData.name!,
          email: formData.email!,
          role: formData.role as User["role"],
          department: formData.department!,
          phone: formData.phone,
          specialties: formData.specialties || [],
          certifications: formData.certifications || [],
          isActive: formData.isActive!,
        })
        toast({
          title: "User Created",
          description: `${formData.name} has been created successfully`,
        })
      } else if (editingUser) {
        await storage.updateUser(editingUser.id, {
          name: formData.name!,
          email: formData.email!,
          role: formData.role as User["role"],
          department: formData.department!,
          phone: formData.phone,
          specialties: formData.specialties || [],
          certifications: formData.certifications || [],
          isActive: formData.isActive!,
        })
        toast({
          title: "User Updated",
          description: `${formData.name} has been updated successfully`,
        })
      }

      setIsCreating(false)
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await storage.deleteUser(userId)
        toast({
          title: "User Deleted",
          description: `${userName} has been deleted successfully`,
        })
        loadUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      await storage.updateUser(user.id, { isActive: !user.isActive })
      toast({
        title: "Status Updated",
        description: `${user.name} is now ${!user.isActive ? "active" : "inactive"}`,
      })
      loadUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const getRoleInfo = (role: string) => {
    return roles.find((r) => r.value === role) || roles[roles.length - 1]
  }

  const handleSpecialtyAdd = (specialty: string) => {
    if (specialty.trim() && !formData.specialties?.includes(specialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...(formData.specialties || []), specialty.trim()],
      })
    }
  }

  const handleSpecialtyRemove = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties?.filter((s) => s !== specialty) || [],
    })
  }

  const handleCertificationAdd = (certification: string) => {
    if (certification.trim() && !formData.certifications?.includes(certification.trim())) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), certification.trim()],
      })
    }
  }

  const handleCertificationRemove = (certification: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications?.filter((c) => c !== certification) || [],
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>User Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="users" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Directory</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Search and Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
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
              </div>
              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* User List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role)
                return (
                  <Card key={user.id} className={`${!user.isActive ? "opacity-60" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-sm">{user.name}</h3>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleToggleUserStatus(user)}
                            size="sm"
                          />
                          {user.isActive ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <Building className="h-3 w-3 text-gray-400" />
                          <span>{user.department}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>

                      {user.specialties.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Specialties:</h4>
                          <div className="flex flex-wrap gap-1">
                            {user.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {user.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {user.certifications.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Certifications:</h4>
                          <div className="flex items-center space-x-1">
                            <Award className="h-3 w-3 text-yellow-600" />
                            <span className="text-xs">{user.certifications.length} certified</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* User Form Modal */}
            {(isCreating || editingUser) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                  <CardHeader>
                    <CardTitle>{isCreating ? "Create New User" : "Edit User"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john.smith@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}
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
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department || ""}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="IT Security"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Specialties</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.specialties?.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleSpecialtyRemove(specialty)}
                          >
                            {specialty} ×
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add specialty (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSpecialtyAdd(e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.certifications?.map((certification, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleCertificationRemove(certification)}
                          >
                            {certification} ×
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add certification (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCertificationAdd(e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label>Active User</Label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false)
                          setEditingUser(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUser}>{isCreating ? "Create User" : "Update User"}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const userCount = users.filter((u) => u.role === role.value).length
                return (
                  <Card key={role.value}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <Badge className={role.color}>{role.label}</Badge>
                        <span className="text-sm font-normal">{userCount} users</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {users
                          .filter((u) => u.role === role.value)
                          .slice(0, 3)
                          .map((user) => (
                            <div key={user.id} className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          ))}
                        {userCount > 3 && <div className="text-xs text-gray-500">+{userCount - 3} more</div>}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
