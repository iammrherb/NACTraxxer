"use client"

import { Gantt, type Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type GanttTask = Task

interface ProjectTimelineProps {
  tasks: GanttTask[]
}

export function ProjectTimeline({ tasks }: ProjectTimelineProps) {
  const [view, setView] = useState<ViewMode>(ViewMode.Week)

  const columnWidth = useMemo(() => {
    switch (view) {
      case ViewMode.Day:
        return 60
      case ViewMode.Week:
        return 150
      case ViewMode.Month:
        return 250
      default:
        return 150
    }
  }, [view])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Timeline</CardTitle>
        <div className="w-[180px]">
          <Select onValueChange={(value) => setView(value as ViewMode)} defaultValue={view}>
            <SelectTrigger>
              <SelectValue placeholder="Select View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ViewMode.Day}>Day</SelectItem>
              <SelectItem value={ViewMode.Week}>Week</SelectItem>
              <SelectItem value={ViewMode.Month}>Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Gantt
              tasks={tasks}
              viewMode={view}
              listCellWidth={tasks.some((t) => t.type === "project") ? "200px" : ""}
              columnWidth={columnWidth}
              ganttHeight={400}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              No sites with planned dates found. Add start and end dates to sites to see them here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
