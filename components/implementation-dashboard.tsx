"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteWorkbook } from "./site-workbook"

interface ImplementationDashboardProps {
  siteId: string | null
}

export function ImplementationDashboard({ siteId }: ImplementationDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation & Onboarding</CardTitle>
        <CardDescription>
          Track detailed progress for all implementation phases, from planning to go-live.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {siteId ? (
          <SiteWorkbook siteId={siteId} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Please select a site to view its implementation workbook.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
