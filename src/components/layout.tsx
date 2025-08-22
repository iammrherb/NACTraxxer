import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSession } from "@/components/session-provider"
import Header from "@/components/Header"

export default function Layout() {
  const { user, isLoading } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}