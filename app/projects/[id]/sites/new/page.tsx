import { NewSiteForm } from "@/components/new-site-form"

export default function NewSitePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-1 justify-center items-start p-4 md:p-8">
      <NewSiteForm projectId={params.id} />
    </div>
  )
}
