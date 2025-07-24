"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getSites } from "@/lib/api"
import type { Site } from "@/lib/types"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns"

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSites() {
      try {
        const fetchedSites = await getSites()
        setSites(fetchedSites)
      } catch (error) {
        console.error("Failed to fetch sites for calendar:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSites()
  }, [])

  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start, end })
  const startingDayIndex = getDay(start)

  const sitesByDate = sites.reduce(
    (acc, site) => {
      if (site.go_live_date) {
        const dateStr = format(new Date(site.go_live_date), "yyyy-MM-dd")
        if (!acc[dateStr]) {
          acc[dateStr] = []
        }
        acc[dateStr].push(site)
      }
      return acc
    },
    {} as Record<string, Site[]>,
  )

  if (loading) {
    return <div>Loading Calendar...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-muted-foreground text-sm">
              {day}
            </div>
          ))}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border rounded-md h-32 bg-muted/50" />
          ))}
          {daysInMonth.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const todaysSites = sitesByDate[dateStr] || []
            return (
              <div
                key={day.toString()}
                className={`border rounded-md h-32 p-2 flex flex-col ${isSameDay(day, new Date()) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              >
                <span className="font-medium">{format(day, "d")}</span>
                <div className="flex-grow overflow-y-auto">
                  {todaysSites.map((site) => (
                    <Badge key={site.id} variant="secondary" className="mt-1 w-full text-left flex items-center">
                      <Building className="h-3 w-3 mr-1.5" />
                      <span className="truncate">{site.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
