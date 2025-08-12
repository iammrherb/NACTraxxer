"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { UseCase } from "@/lib/types"

interface PocTrackerDashboardProps {
  useCases: UseCase[]
}

export function PocTrackerDashboard({ useCases }: PocTrackerDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Draft":
        return "secondary"
      case "Completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const totalUseCases = useCases.length
  const activeUseCases = useCases.filter((uc) => uc.status === "Active").length
  const completedUseCases = useCases.filter((uc) => uc.status === "Completed").length
  const avgCompletion = useCases.reduce((acc, uc) => acc + uc.completion_percentage, 0) / totalUseCases

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUseCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUseCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedUseCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgCompletion)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PoC Use Cases</CardTitle>
          <CardDescription>Track the progress of your proof of concept implementations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {useCases.map((useCase) => (
              <div key={useCase.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <h3 className="font-medium">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    <Badge variant="secondary">{useCase.category}</Badge>
                  </div>
                  <Badge variant={getStatusColor(useCase.status)}>{useCase.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{useCase.completion_percentage}%</span>
                  </div>
                  <Progress value={useCase.completion_percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
