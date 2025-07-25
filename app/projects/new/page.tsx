"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createProject, type FormState } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating Project..." : "Create Project"}
    </Button>
  )
}

export default function NewProjectPage() {
  const initialState: FormState = { message: "", errors: {} }
  const [state, formAction] = useFormState(createProject, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (
      state.message &&
      (state.errors || state.message.startsWith("Database error") || state.message.startsWith("Authentication error"))
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      })
    }
  }, [state, toast])

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Project</CardTitle>
            <CardDescription>Fill out the details below to start a new NAC project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" placeholder="e.g., Global Office Refresh" required />
              {state.errors?.name && (
                <p className="text-sm font-medium text-destructive">{state.errors.name.join(", ")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" name="customer" placeholder="e.g., Acme Corporation" required />
              {state.errors?.customer && (
                <p className="text-sm font-medium text-destructive">{state.errors.customer.join(", ")}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
