"use client"

import { useState } from "react"
import { UserManagement } from "@/components/user-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { User } from "@/lib/database"
import { Database, Dna, Trash2 } from "lucide-react"

interface SettingsDashboardProps {
  users: User[]
  onUpdate: () => void
}

export function SettingsDashboard({ users, onUpdate }: SettingsDashboardProps) {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const handleSeedData = async () => {
    if (!confirm("Are you sure you want to seed the database with mock data? This will add sample sites and users.")) {
      return
    }
    setIsSeeding(true)
    try {
      await api.seedDatabase()
      toast({
        title: "Success",
        description: "Database has been seeded with mock data.",
      })
      onUpdate() // Refresh data on the main page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Failed to seed database:", error)
      toast({
        title: "Error",
        description: `Failed to seed database: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all site data? This action cannot be undone.")) {
      return
    }
    setIsClearing(true)
    try {
      await api.clearDatabase()
      toast({
        title: "Success",
        description: "All site data has been cleared.",
      })
      onUpdate() // Refresh data on the main page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Failed to clear database:", error)
      toast({
        title: "Error",
        description: `Failed to clear the database: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleCreateUser = async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
    try {
      // This would call an API function like api.createUser(userData)
      toast({ title: "Success", description: "User created successfully." })
      onUpdate()
      setIsUserManagementOpen(false)
    } catch (error) {
      console.error("Failed to create user:", error)
      toast({ title: "Error", description: "Failed to create user.", variant: "destructive" })
    }
  }

  const handleUpdateUser = async (id: number, userData: Partial<User>) => {
    try {
      // This would call an API function like api.updateUser(id, userData)
      toast({ title: "Success", description: "User updated successfully." })
      onUpdate()
      setIsUserManagementOpen(false)
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" })
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      // This would call an API function like api.deleteUser(id)
      toast({ title: "Success", description: "User deleted successfully." })
      onUpdate()
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" })
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Add, edit, or remove project managers and technical owners.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsUserManagementOpen(true)}>
            <Dna className="mr-2 h-4 w-4" /> Manage Users
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>
            Use these actions to manage the application's data. This is useful for testing or resetting the environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSeedData} disabled={isSeeding || isClearing}>
            <Database className="mr-2 h-4 w-4" />
            {isSeeding ? "Seeding..." : "Seed Mock Data"}
          </Button>
          <Button variant="destructive" onClick={handleClearData} disabled={isSeeding || isClearing}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "Clearing..." : "Clear All Site Data"}
          </Button>
        </CardContent>
      </Card>

      {isUserManagementOpen && (
        <UserManagement
          isOpen={isUserManagementOpen}
          onClose={() => setIsUserManagementOpen(false)}
          users={users}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  )
}
