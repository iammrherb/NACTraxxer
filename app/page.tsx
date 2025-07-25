import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, AlertTriangle } from "lucide-react"
import type { Project } from "@/lib/database"

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // This log will appear in your server-side terminal
  console.log("Current user from server component:", user ? user.email : null)

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Database Connection Error
            </CardTitle>
            <CardDescription>The application could not fetch the list of projects from the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This error usually means the <code className="font-mono bg-muted p-1 rounded">projects</code> table is
                missing from your database schema.
              </p>
              <p className="font-semibold">
                Please ensure you have run the necessary SQL script in your Supabase project's SQL Editor.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold text-destructive">Error Details:</p>
                <code className="text-sm text-destructive">{error.message}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusVariant = (status: Project["status"]) => {
    switch (status) {
      case "Active":
        return "default"
      case "Completed":
        return "secondary"
      case "Planning":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">NAC Projects</h1>
          {user ? (
            <p className="text-muted-foreground">
              Logged in as: <span className="font-semibold">{user.email}</span>
            </p>
          ) : (
            <p className="text-muted-foreground">You are not logged in.</p>
          )}
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all NAC design and deployment projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!projects || projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No projects found. Start by creating one.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.customer}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
