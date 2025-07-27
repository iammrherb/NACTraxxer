"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { createSiteAction } from "@/app/actions/sites"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const initialState = {
  message: "",
  errors: {} as Record<string, string[]>,
  success: false,
}

export function NewSiteForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const createSiteActionWithProjectId = createSiteAction.bind(null, projectId)
  const [state, formAction, isPending] = useActionState(createSiteActionWithProjectId, initialState)

  return (
    <form action={formAction}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Site</CardTitle>
          <CardDescription>Fill in the details for the new site. The status will default to "Planned".</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Site Name</Label>
            <Input id="name" name="name" placeholder="e.g., New York Headquarters" required />
            {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="Medium">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.priority && (
                <p className="text-sm font-medium text-destructive">{state.errors.priority[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="users">Number of Users</Label>
              <Input id="users" name="users" type="number" placeholder="e.g., 500" required />
              {state?.errors?.users && <p className="text-sm font-medium text-destructive">{state.errors.users[0]}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Site"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
