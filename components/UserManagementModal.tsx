"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Building2,
  Shield,
  Download,
  UserPlus,
  BarChart3,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react"
import { storage, type Site, type User } from "@/lib/storage"

interface UserManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

const ROLES = [
  "Chief Information Officer",
  "Chief Technology Officer",
  "IT Director",
  "Security Director",
  "Network Director",
  "Senior Project Manager",
  "Project Manager",
  "Principal Architect",
  "Security Architect",
  "Network Architect",
  "Senior Network Engineer",
  "Security Engineer",
  "Systems Engineer",
  "DevOps Engineer",
  "Site Manager",
  "Technical Owner",
  "Compliance Specialist",
  "Identity Specialist",
  "Wireless Specialist",
  "Network Technician",
  "Security Analyst",
  "Systems Administrator",
  "Senior Consultant",
  "Implementation Consultant",
  "Security Consultant",
]

const DEPARTMENTS = [
  "Executive",
  "IT Operations",
  "Cybersecurity",
  "Infrastructure",
  "PMO",
  "Architecture",
  "Development",
  "Operations",
  "Risk & Compliance",
  "Support",
  "Professional Services",
  "Cloud Services",
  "Data Management",
  "Quality Assurance",
  "Learning & Development",
  "Documentation",
  "Procurement",
  "Business Analysis",
  "Risk Management",
  "Change Management",
  "Privacy",
  "Service Management",
  "Performance Management",
]

const TIMEZONES = ["EST", "CST", "MST", "PST", "AKST", "HST", "GMT", "CET", "EET", "JST", "AEST", "NZST"]

export default function UserManagementModal({ isOpen, onClose }: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [bulkAssignMode, setBulkAssignMode] = useState(false)
  const [selectedSites, setSelectedSites] = useState<string[]>([])

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    location: "",
    timezone: "",
    certifications: [] as string[],
    skills: [] as string[],
    globalAccess: false,
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter])

  const loadData = async () => {
    try {
      const [loadedUsers, loadedSites] = await Promise.all([storage.getUsers(), storage.getSites()])
      setUsers(loadedUsers)
      setSites(loadedSites)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const filterUsers = () => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        (user.firstName || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesDepartment = departmentFilter === "all" || (user.department || '') === departmentFilter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && (user.isActive ?? true)) ||
        (statusFilter === "inactive" && !(user.isActive ?? true))

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })

    setFilteredUsers(filtered)
  }

  const handleAddUser = async () => {
    try {
      const userId = `user-${Date.now()}`
      await storage.addUser({
        id: userId,
        name: `${newUser.firstName} ${newUser.lastName}`,
        sites: [],
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        department: newUser.department,
        location: newUser.location,
        timezone: newUser.timezone,
        certifications: newUser.certifications,
        skills: newUser.skills,
        globalAccess: newUser.globalAccess,
        assignedSites: [],
        createdAt: new Date().toISOString(),
        isActive: true,
      })

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        department: "",
        location: "",
        timezone: "",
        certifications: [],
        skills: [],
        globalAccess: false,
      })
      setShowAddUser(false)
      loadData()
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      await storage.updateUser(editingUser.id, editingUser)
      setEditingUser(null)
      loadData()
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await storage.deleteUser(userId)
        loadData()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleBulkSiteAssignment = async () => {
    if (selectedUsers.length === 0 || selectedSites.length === 0) return

    try {
      for (const userId of selectedUsers) {
        await storage.assignUserToSites(userId, selectedSites)
      }

      setSelectedUsers([])
      setSelectedSites([])
      setBulkAssignMode(false)
      loadData()
    } catch (error) {
      console.error("Error assigning users to sites:", error)
    }
  }

  const exportUsers = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Role",
      "Department",
      "Location",
      "Timezone",
      "Certifications",
      "Skills",
      "Global Access",
      "Assigned Sites",
      "Status",
      "Created",
      "Last Login",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.firstName,
          user.lastName,
          user.email,
          `"${user.role}"`,
          user.department,
          `"${user.location}"`,
          user.timezone,
          `"${user.certifications.join("; ")}"`,
          `"${user.skills.join("; ")}"`,
          user.globalAccess ? "Yes" : "No",
          user.assignedSites.length.toString(),
          user.isActive ? "Active" : "Inactive",
          new Date(user.createdAt).toLocaleDateString(),
          user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `users-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getUserInitials = (user: User) => {
    const firstName = user.firstName || user.name?.split(' ')[0] || 'U'
    const lastName = user.lastName || user.name?.split(' ')[1] || 'U'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const getRoleColor = (role: string) => {
    if (role.includes("Chief") || role.includes("Director")) return "bg-purple-100 text-purple-800"
    if (role.includes("Manager") || role.includes("Architect")) return "bg-blue-100 text-blue-800"
    if (role.includes("Senior") || role.includes("Principal")) return "bg-green-100 text-green-800"
    if (role.includes("Consultant")) return "bg-orange-100 text-orange-800"
    return "bg-gray-100 text-gray-800"
  }

  const renderUserAnalytics = () => {
    const roleDistribution = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const departmentDistribution = users.reduce(
      (acc, user) => {
        const dept = user.department || 'Unassigned'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const activeUsers = users.filter((u) => u.isActive ?? true).length
    const globalAccessUsers = users.filter((u) => u.globalAccess).length
    const avgSitesPerUser =
      users.length > 0 ? users.reduce((sum, u) => sum + (u.assignedSites?.length || 0), 0) / users.length : 0

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers} active ({Math.round((activeUsers / users.length) * 100)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Global Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalAccessUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((globalAccessUsers / users.length) * 100)}% of users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Avg Sites/User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSitesPerUser.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Site assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(departmentDistribution).length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(roleDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center">
                      <span className="text-sm truncate flex-1 mr-2">{role}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(departmentDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span className="text-sm truncate flex-1 mr-2">{dept}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderSiteAssignments = () => {
    const siteAssignments = sites.map((site) => {
      const assignedUsers = users.filter((user) => (user.assignedSites || []).includes(site.id))
      return {
        ...site,
        userCount: assignedUsers.length,
        users: assignedUsers,
      }
    })

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Site Coverage</h3>
          <Button onClick={() => setBulkAssignMode(!bulkAssignMode)} variant={bulkAssignMode ? "default" : "outline"}>
            <UserPlus className="h-4 w-4 mr-2" />
            Bulk Assign
          </Button>
        </div>

        {bulkAssignMode && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label>Select Users</Label>
                  <div className="mt-2 max-h-32 overflow-y-auto border rounded p-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, user.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                            }
                          }}
                        />
                        <span className="text-sm">
                          {user.firstName || user.name?.split(' ')[0] || 'User'} {user.lastName || user.name?.split(' ')[1] || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Select Sites</Label>
                  <div className="mt-2 max-h-32 overflow-y-auto border rounded p-2">
                    {sites.map((site) => (
                      <div key={site.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedSites.includes(site.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSites([...selectedSites, site.id])
                            } else {
                              setSelectedSites(selectedSites.filter((id) => id !== site.id))
                            }
                          }}
                        />
                        <span className="text-sm">{site.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleBulkSiteAssignment}
                    disabled={selectedUsers.length === 0 || selectedSites.length === 0}
                  >
                    Assign {selectedUsers.length} users to {selectedSites.length} sites
                  </Button>
                  <Button variant="outline" onClick={() => setBulkAssignMode(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {siteAssignments.map((site) => (
            <Card key={site.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{site.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {site.region} • {site.country}
                    </p>
                  </div>
                  <Badge variant="secondary">{site.userCount} users</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {site.users.slice(0, 6).map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {user.firstName || user.name?.split(' ')[0] || 'User'} {user.lastName || user.name?.split(' ')[1] || ''}
                      </span>
                    </div>
                  ))}
                  {site.users.length > 6 && (
                    <div className="flex items-center justify-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-600">+{site.users.length - 6} more</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Site Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full overflow-hidden flex flex-col">
              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={exportUsers} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setShowAddUser(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Users Table */}
              <div className="flex-1 overflow-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-semibold">User</th>
                      <th className="text-left p-3 font-semibold">Role</th>
                      <th className="text-left p-3 font-semibold">Department</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Sites</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.firstName || user.name?.split(' ')[0] || 'User'} {user.lastName || user.name?.split(' ')[1] || ''}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.globalAccess && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Global Access
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="p-3 text-sm">{user.department || 'N/A'}</td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {user.location || 'N/A'}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {user.timezone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{(user.assignedSites || []).length}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={(user.isActive ?? true) ? "default" : "secondary"}>
                            {(user.isActive ?? true) ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 overflow-auto">
            {renderUserAnalytics()}
          </TabsContent>

          <TabsContent value="assignments" className="flex-1 overflow-auto">
            {renderSiteAssignments()}
          </TabsContent>
        </Tabs>

        {/* Add User Modal */}
        {showAddUser && (
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={newUser.department}
                    onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newUser.location}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    placeholder="City, State/Country"
                  />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={newUser.timezone}
                    onValueChange={(value) => setNewUser({ ...newUser, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={newUser.globalAccess}
                      onCheckedChange={(checked) => setNewUser({ ...newUser, globalAccess: !!checked })}
                    />
                    <Label>Global Access (can access all sites)</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={editingUser.firstName || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={editingUser.lastName || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={editingUser.department}
                    onValueChange={(value) => setEditingUser({ ...editingUser, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={editingUser.location || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={editingUser.timezone || ''}
                    onValueChange={(value) => setEditingUser({ ...editingUser, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={editingUser.globalAccess ?? false}
                      onCheckedChange={(checked) => setEditingUser({ ...editingUser, globalAccess: !!checked })}
                    />
                    <Label>Global Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={editingUser.isActive ?? true}
                      onCheckedChange={(checked) => setEditingUser({ ...editingUser, isActive: !!checked })}
                    />
                    <Label>Active User</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
