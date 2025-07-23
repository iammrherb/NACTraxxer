"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSites } from "@/lib/api"
import type { Site } from "@/lib/types"

interface SiteSelectorProps {
  onSiteChange: (siteId: string | null) => void
  selectedSiteId: string | null
}

export function SiteSelector({ onSiteChange, selectedSiteId }: SiteSelectorProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSites() {
      try {
        const fetchedSites = await getSites()
        setSites(fetchedSites)
        if (fetchedSites.length > 0 && !selectedSiteId) {
          onSiteChange(fetchedSites[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch sites:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSites()
  }, [])

  if (loading) {
    return <div>Loading sites...</div>
  }

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={(value) => onSiteChange(value)} value={selectedSiteId ?? undefined}>
        <SelectTrigger>
          <SelectValue placeholder="Select a deployment site..." />
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
