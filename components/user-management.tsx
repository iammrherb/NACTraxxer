"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/database"

interface UserManagementProps {
  initialUsers: User[]
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({})

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    setIsSubmitting((prev) => ({ ...prev, [userId]: true }))

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update role.")
      }

      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[180px]">Change Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as User["role"])}
                  disabled={isSubmitting[user.id]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
