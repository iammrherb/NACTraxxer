import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { SiteTabs } from "@/components/site-tabs"

async function getSite(siteId: string) {
  const supabase = createClient()
  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()
  if (error) {
    console.error("Error fetching site for layout:", error)
    notFound()
  }
  return site
}

export default async function SiteDetailLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { projectId: string; siteId: string }
}) {
  const site = await getSite(params.siteId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={`/projects/${params.projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Site: <span className="text-muted-foreground">{site.name}</span>
          </h1>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Site
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{site.name}</CardTitle>
          <CardDescription>
            {site.region} - {site.country}
          </CardDescription>
        </CardHeader>
      </Card>

      <SiteTabs projectId={params.projectId} siteId={params.siteId} />

      <main>{children}</main>
    </div>
  )
}
