import { NewSiteForm } from "@/components/new-site-form"

interface NewSitePageProps {
  params: {
    id: string
  }
}

export default function NewSitePage({ params }: NewSitePageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Site</h1>
        <p className="text-muted-foreground">Create a new site for this project.</p>
      </div>

      <NewSiteForm projectId={params.id} />
    </div>
  )
}
