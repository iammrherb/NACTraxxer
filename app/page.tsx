"use client"

import { useState, useEffect } from "react"
import { MainDashboard } from "@/components/main-dashboard"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/lib/api"
import type { Site, User, Vendor, DeviceType, UseCase, DashboardMetrics } from "@/lib/types"

interface DashboardData {
  sites: Site[]
  users: User[]
  vendors: Vendor[]
  deviceTypes: DeviceType[]
  useCases: UseCase[]
  metrics: DashboardMetrics
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true)
        setError(null)

        const [sites, users, vendors, deviceTypes, useCases, metrics] = await Promise.all([
          api.sites.getAll(),
          api.users.getAll(),
          api.vendors.getAll(),
          api.deviceTypes.getAll(),
          api.useCases.getAll(),
          api.dashboard.getMetrics(),
        ])

        setData({
          sites,
          users,
          vendors,
          deviceTypes,
          useCases,
          metrics,
        })
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return <LoadingSpinner />
  }

  return <MainDashboard {...data} />
}
