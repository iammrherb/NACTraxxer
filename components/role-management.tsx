"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Permission {
  id: number
  name: string
  description: string
  category: string
}

interface Role {
  id: number
  name: string
  description: string
  is_system_role: boolean
  permissions?: Permission[]
}

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        fetch("/api/rbac/roles"),
        fetch("/api/rbac/permissions"),
        fetch("/api/rbac/users"),
      ])

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json()
        setRoles(rolesData)
      }

      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json()
        setPermissions(permissionsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load roles and permissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async (formData: FormData) => {
    try {
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const selectedPermissions = formData.getAll("permissions").map(Number)

      const response = await fetch("/api/rbac/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          permissionIds: selectedPermissions,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role created successfully",
        })
        setShowCreateRole(false)
        loadData()
      } else {
        throw new Error("Failed to create role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (roleId: number, formData: FormData) => {
    try {
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const selectedPermissions = formData.getAll("permissions").map(Number)

      const response = await fetch(`/api/rbac/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          permissionIds: selectedPermissions,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
        setEditingRole(null)
        loadData()
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      const response = await fetch(`/api/rbac/roles/${roleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        })
        loadData()
      } else {
        throw new Error("Failed to delete role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  const handleAssignRole = async (userId: string, roleId: number) => {
    try {
      const response = await fetch("/api/rbac/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role assigned successfully",
        })
        loadData()
      } else {
        throw new Error("Failed to assign role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      })
    }
  }

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {} as Record<string, Permission[]>,
    )
  }

  const RoleForm = ({ role, onSubmit }: { role?: Role; onSubmit: (formData: FormData) => void }) => {
    const groupedPermissions = groupPermissionsByCategory(permissions)

    return (
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" name="name" defaultValue={role?.name} required disabled={role?.is_system_role} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={role?.description}
              disabled={role?.is_system_role}
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <ScrollArea className="h-96 border rounded-md p-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          name="permissions"
                          value={permission.id}
                          defaultChecked={role?.permissions?.some((p) => p.id === permission.id)}
                          disabled={role?.is_system_role}
                        />
                        <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal cursor-pointer">
                          {permission.name}
                        </Label>
                        <span className="text-xs text-muted-foreground">{permission.description}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {!role?.is_system_role && (
          <div className="flex justify-end space-x-2">
            <Button type="submit">{role ? "Update Role" : "Create Role"}</Button>
          </div>
        )}
      </form>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role & Permission Management</h2>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <RoleForm onSubmit={handleCreateRole} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">User Assignments</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>{role.name}</span>
                    </CardTitle>
                    <div className="flex space-x-1">
                      {role.is_system_role && <Badge variant="secondary">System</Badge>}
                      {!role.is_system_role && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="text-sm">
                    <strong>Permissions:</strong> {role.permissions?.length || 0}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Role Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex space-x-1 mt-2">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(roleId) => handleAssignRole(user.id, Number.parseInt(roleId))}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assign role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(groupPermissionsByCategory(permissions)).map(([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold mb-3">{category}</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
          </DialogHeader>
          {editingRole?.is_system_role && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a system role. You can view its permissions but cannot modify them.
              </AlertDescription>
            </Alert>
          )}
          {editingRole && (
            <RoleForm role={editingRole} onSubmit={(formData) => handleUpdateRole(editingRole.id, formData)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
