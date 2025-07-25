"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { createProject, type FormState } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Creating Project..." : "Create Project"}
    </Button>
  )
}

export default function NewProjectPage() {
  const initialState: FormState = { message: "", errors: {} }
  const [state, formAction] = useActionState(createProject, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: "destructive",
        title: "Error Creating Project",
        description: "Please review the form for errors.",
      })
    }
  }, [state, toast])

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Comprehensive Project</CardTitle>
            <CardDescription>Fill out the details below. Fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
              {/* Section 1: Project Details */}
              <AccordionItem value="item-1">
                <AccordionTrigger>Project Details</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name *</Label>
                      <Input id="name" name="name" placeholder="e.g., Global Office Refresh" required />
                      {state.errors?.name && (
                        <p className="text-sm font-medium text-destructive">{state.errors.name.join(", ")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer Name *</Label>
                      <Input id="customer" name="customer" placeholder="e.g., Acme Corporation" required />
                      {state.errors?.customer && (
                        <p className="text-sm font-medium text-destructive">{state.errors.customer.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="A brief summary of the project's purpose."
                    />
                    {state.errors?.description && (
                      <p className="text-sm font-medium text-destructive">{state.errors.description.join(", ")}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: Scoping & Discovery */}
              <AccordionItem value="item-2">
                <AccordionTrigger>Scoping & Discovery</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_goal">Project Goal</Label>
                    <Textarea
                      id="project_goal"
                      name="project_goal"
                      placeholder="Describe the primary objectives and desired outcomes."
                    />
                    {state.errors?.project_goal && (
                      <p className="text-sm font-medium text-destructive">{state.errors.project_goal.join(", ")}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="in_scope">In Scope</Label>
                      <Textarea
                        id="in_scope"
                        name="in_scope"
                        placeholder="List all items, locations, and services that are in scope."
                      />
                      {state.errors?.in_scope && (
                        <p className="text-sm font-medium text-destructive">{state.errors.in_scope.join(", ")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="out_of_scope">Out of Scope</Label>
                      <Textarea
                        id="out_of_scope"
                        name="out_of_scope"
                        placeholder="List all items explicitly out of scope to avoid ambiguity."
                      />
                      {state.errors?.out_of_scope && (
                        <p className="text-sm font-medium text-destructive">{state.errors.out_of_scope.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="estimated_users">Estimated Users</Label>
                      <Input id="estimated_users" name="estimated_users" type="number" placeholder="e.g., 5000" />
                      {state.errors?.estimated_users && (
                        <p className="text-sm font-medium text-destructive">
                          {state.errors.estimated_users.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated_devices">Estimated Devices</Label>
                      <Input id="estimated_devices" name="estimated_devices" type="number" placeholder="e.g., 7500" />
                      {state.errors?.estimated_devices && (
                        <p className="text-sm font-medium text-destructive">
                          {state.errors.estimated_devices.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key_personnel">Key Personnel (JSON format)</Label>
                    <Textarea
                      id="key_personnel"
                      name="key_personnel"
                      placeholder='e.g., [{"name": "John Doe", "role": "Project Manager", "email": "john.doe@example.com"}]'
                      rows={4}
                    />
                    {state.errors?.key_personnel && (
                      <p className="text-sm font-medium text-destructive">{state.errors.key_personnel.join(", ")}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 3: Implementation Plan */}
              <AccordionItem value="item-3">
                <AccordionTrigger>Implementation Plan</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="network_diagram_link">Network Diagram Link</Label>
                    <Input
                      id="network_diagram_link"
                      name="network_diagram_link"
                      type="url"
                      placeholder="https://example.com/diagram.png"
                    />
                    {state.errors?.network_diagram_link && (
                      <p className="text-sm font-medium text-destructive">
                        {state.errors.network_diagram_link.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="planned_start_date">Planned Start Date</Label>
                      <Input type="date" id="planned_start_date" name="planned_start_date" className="block w-full" />
                      {state.errors?.planned_start_date && (
                        <p className="text-sm font-medium text-destructive">
                          {state.errors.planned_start_date.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planned_end_date">Planned End Date</Label>
                      <Input type="date" id="planned_end_date" name="planned_end_date" className="block w-full" />
                      {state.errors?.planned_end_date && (
                        <p className="text-sm font-medium text-destructive">
                          {state.errors.planned_end_date.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col items-end gap-4 sm:flex-row sm:justify-end">
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
