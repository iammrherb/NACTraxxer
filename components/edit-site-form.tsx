"use client"

import { useActionState } from "react"
import { updateSiteAction } from "@/app/actions/sites"
import type { Site } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

interface EditSiteFormProps {
  site: Site
  projectId: string
}

export function EditSiteForm({ site, projectId }: EditSiteFormProps) {
  const updateSiteActionWithIds = updateSiteAction.bind(null, site.id, projectId)
  const [state, formAction, isPending] = useActionState(updateSiteActionWithIds, {
    success: false,
    message: "",
    errors: {},
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input id="name" name="name" defaultValue={site.name} required />
              {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="users_count">Number of Users</Label>
              <Input id="users_count" name="users_count" type="number" defaultValue={site.users_count || 0} required />
              {state.errors?.users_count && <p className="text-sm text-red-500">{state.errors.users_count[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue={site.priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.priority && <p className="text-sm text-red-500">{state.errors.priority[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={site.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.status && <p className="text-sm text-red-500">{state.errors.status[0]}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" asChild>
              <Link href={`/projects/${projectId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
