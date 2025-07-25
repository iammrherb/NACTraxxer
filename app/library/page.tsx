import LibraryManager from "@/components/library-manager"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function LibraryPage() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Library</CardTitle>
          <CardDescription>
            Manage all shared configuration items for your projects, such as vendors, device types, and deployment
            checklists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <LibraryManager />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
