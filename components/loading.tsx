import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
        <p className="text-gray-600">Please wait while we load your deployment data...</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-32 mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      </div>
    </div>
  )
}

export function LoadingTable() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-200 rounded h-8 w-full"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded h-12 w-full"></div>
      ))}
    </div>
  )
}

export default function Loading() {
  return <LoadingSpinner />
}
