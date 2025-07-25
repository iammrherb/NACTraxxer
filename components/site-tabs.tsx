"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SiteTabs({ projectId, siteId }: { projectId: string; siteId: string }) {
  const pathname = usePathname()
  const basePath = `/projects/${projectId}/sites/${siteId}`

  const getTabValue = () => {
    if (pathname === `${basePath}/checklist`) return "checklist"
    if (pathname === `${basePath}/notes`) return "notes"
    return "overview"
  }

  return (
    <Tabs value={getTabValue()}>
      <TabsList>
        <TabsTrigger value="overview" asChild>
          <Link href={basePath}>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="checklist" asChild>
          <Link href={`${basePath}/checklist`}>Checklist</Link>
        </TabsTrigger>
        <TabsTrigger value="notes" asChild>
          <Link href={`${basePath}/notes`}>Notes</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
