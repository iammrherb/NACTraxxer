"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import type { LibraryData, ScopingQuestionnaire } from "@/lib/database"

const formSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required."),
  totalUsers: z.coerce.number().min(1, "At least one user is required."),
  siteCount: z.coerce.number().min(1, "At least one site is required."),
  country: z.string().optional(),
  region: z.string().optional(),
  industry: z.string().optional(),
  projectGoals: z.array(z.string()).optional(),
  legacySystems: z.array(z.object({ name: z.string() })).optional(),
  wiredVendors: z.array(z.string()).optional(),
  wirelessVendors: z.array(z.string()).optional(),
  // Add other vendor types as needed
})

type QuestionnaireFormValues = z.infer<typeof formSchema>

interface IntelligentQuestionnaireProps {
  libraryData: LibraryData | null
  onSave: (data: Partial<ScopingQuestionnaire>) => void
  onCancel: () => void
  questionnaire?: ScopingQuestionnaire
}

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Project Scope" },
  { id: 3, title: "Technology Stack" },
  { id: 4, title: "Review & Submit" },
]

export function IntelligentQuestionnaire({
  libraryData,
  onSave,
  onCancel,
  questionnaire,
}: IntelligentQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: questionnaire?.organizationName || "",
      totalUsers: questionnaire?.totalUsers || 100,
      siteCount: questionnaire?.siteCount || 1,
      country: questionnaire?.country || "",
      region: questionnaire?.region || "",
      industry: questionnaire?.industry || "",
      projectGoals: questionnaire?.projectGoals || [],
      legacySystems: questionnaire?.legacySystems || [],
      wiredVendors: questionnaire?.wiredVendors || [],
      wirelessVendors: questionnaire?.wirelessVendors || [],
    },
  })

  const onSubmit = (data: QuestionnaireFormValues) => {
    onSave({ ...questionnaire, ...data, status: "Completed" })
  }

  const handleNext = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Scoping & Discovery</CardTitle>
        <CardDescription>
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Users</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="siteCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Sites</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Project Goals</h3>
                <FormField
                  control={form.control}
                  name="projectGoals"
                  render={() => (
                    <FormItem className="grid grid-cols-2 gap-4">
                      {[
                        "Improve Security Posture",
                        "Enhance User Experience",
                        "Gain Network Visibility",
                        "Meet Compliance Requirements",
                        "Reduce IT Overhead",
                        "Enable BYOD",
                      ].map((goal) => (
                        <FormField
                          key={goal}
                          control={form.control}
                          name="projectGoals"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(goal)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), goal])
                                      : field.onChange(field.value?.filter((value) => value !== goal))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{goal}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Technology Stack</h3>
                <FormField
                  control={form.control}
                  name="wiredVendors"
                  render={() => (
                    <FormItem>
                      <FormLabel>Wired Network Vendors</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {libraryData?.wiredVendors.map((vendor) => (
                          <FormField
                            key={vendor.id}
                            control={form.control}
                            name="wiredVendors"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(vendor.name)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), vendor.name])
                                        : field.onChange(field.value?.filter((value) => value !== vendor.name))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{vendor.name}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                {/* Add more vendor sections here (wireless, firewall, etc.) */}
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Review Your Selections</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Organization:</strong> {form.getValues("organizationName")}
                  </p>
                  <p>
                    <strong>Total Users:</strong> {form.getValues("totalUsers")}
                  </p>
                  <p>
                    <strong>Goals:</strong> {form.getValues("projectGoals")?.join(", ")}
                  </p>
                  <p>
                    <strong>Wired Vendors:</strong> {form.getValues("wiredVendors")?.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              {currentStep < steps.length && (
                <Button type="button" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === steps.length && (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save & Complete
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
