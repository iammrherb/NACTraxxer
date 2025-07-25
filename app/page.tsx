import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("Current user from server component:", user?.email)

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error.message)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p>Could not fetch projects. The database table might be missing.</p>
          <p className="text-sm text-muted-foreground">Please ensure you have run all the migration scripts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">An overview of all your NAC design projects.</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {user ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="truncate">{project.name}</CardTitle>
                  <CardDescription>{project.customer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Status</span>
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Phase</span>
                    <Badge variant="outline">{project.implementation_phase}</Badge>
                  </div>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {project.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <h3 className="text-xl font-semibold">No projects yet</h3>
              <p className="text-muted-foreground">Click "New Project" to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p>Please log in to view projects.</p>
        </div>
      )}
    </div>
  )
}
