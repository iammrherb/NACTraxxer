import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function UserManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage users and permissions (Authentication removed)</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Authentication has been removed from this application. User management is not available.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>This feature requires authentication to be enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To enable user management, you would need to implement authentication using a service like NextAuth.js,
            Supabase Auth, or similar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
