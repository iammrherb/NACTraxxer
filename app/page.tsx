'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/session-provider'

export default function HomePage() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text">
          NAC Designer
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Network Access Control Architecture Designer
        </p>
      </div>
    </div>
  )
}