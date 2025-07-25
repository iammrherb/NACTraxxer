import { UserManagement } from "@/components/user-management"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { User } from "@/lib/database"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

async function getUsers(): Promise<User[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("users").select("*")
  if (error) {
    console.error("Error fetching users:", error)
    return []
  }
  return data as User[]
}

async function getCurrentUserRole(userId: string): Promise<User["role"]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()
  if (error || !data) {
    return "viewer" // Default to least permissive role on error
  }
  return data.role as User["role"]
}

export default async function UserManagementPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const currentUserRole = await getCurrentUserRole(user.id)

  if (currentUserRole !== "admin") {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You must be an administrator to manage users.</AlertDescription>
      </Alert>
    )
  }

  const users = await getUsers()

  return <UserManagement initialUsers={users} />
}
