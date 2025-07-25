"use client"

import { useState, useEffect, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface ChecklistItem {
  id: number
  text: string
  completed: boolean
}

interface Vendor {
  id: number
  name: string
}

interface DeviceType {
  id: number
  name: string
}

interface SiteWorkbookData {
  checklist: ChecklistItem[]
  selectedVendorId: number | null
  selectedDeviceTypeId: number | null
}

interface SiteWorkbookProps {
  siteId: number
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [workbookData, setWorkbookData] = useState<SiteWorkbookData | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkbookData = useCallback(async () => {
    // This endpoint needs to be created. For now, it's a placeholder.
    // It should return data in SiteWorkbookData format.
    // As a fallback, we can mock it.
    console.log(`Fetching workbook data for site ${siteId}`)
    // Mocking data since the endpoint likely doesn't exist yet.
    const mockChecklist = [
      { id: 1, text: "Verify network connectivity", completed: true },
      { id: 2, text: "Configure RADIUS server", completed: false },
      { id: 3, text: "Integrate with Active Directory", completed: false },
    ]
    setWorkbookData({
      checklist: mockChecklist,
      selectedVendorId: null,
      selectedDeviceTypeId: null,
    })
  }, [siteId])

  const fetchLibraryItems = useCallback(async () => {
    try {
      const [vendorsRes, deviceTypesRes] = await Promise.all([
        fetch("/api/library/vendors"),
        fetch("/api/library/device-types"),
      ])
      if (!vendorsRes.ok || !deviceTypesRes.ok) throw new Error("Failed to fetch library items.")
      const vendorsData = await vendorsRes.json()
      const deviceTypesData = await deviceTypesRes.json()
      setVendors(vendorsData)
      setDeviceTypes(deviceTypesData)
    } catch (err) {
      throw err
    }
  }, [])

  const loadAllData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await Promise.all([fetchWorkbookData(), fetchLibraryItems()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchWorkbookData, fetchLibraryItems])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const handleChecklistItemChange = async (itemId: number, completed: boolean) => {
    if (!workbookData) return

    const updatedChecklist = workbookData.checklist.map((item) => (item.id === itemId ? { ...item, completed } : item))
    setWorkbookData({ ...workbookData, checklist: updatedChecklist })

    try {
      const response = await fetch(`/api/checklist-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })
      if (!response.ok) throw new Error("Failed to update checklist item.")
      toast({ title: "Success", description: "Checklist updated." })
    } catch (err) {
      toast({ title: "Error", description: "Could not save checklist update.", variant: "destructive" })
      loadAllData()
    }
  }

  const handleSelectChange = async (type: "vendor" | "device-type", value: string) => {
    if (!workbookData) return
    const id = Number.parseInt(value, 10)
    const key = type === "vendor" ? "selectedVendorId" : "selectedDeviceTypeId"

    setWorkbookData({ ...workbookData, [key]: id })

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type === "vendor" ? "vendor_id" : "device_type_id"]: id }),
      })
      if (!response.ok) throw new Error(`Failed to update site ${type}.`)
      toast({ title: "Success", description: `Site ${type} updated.` })
    } catch (err) {
      toast({ title: "Error", description: `Could not save site ${type}.`, variant: "destructive" })
      loadAllData()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!workbookData) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Deployment Checklist</h3>
        <div className="space-y-2">
          {workbookData.checklist.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`checklist-${item.id}`}
                checked={item.completed}
                onCheckedChange={(checked) => handleChecklistItemChange(item.id, !!checked)}
              />
              <label
                htmlFor={`checklist-${item.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.text}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Device Vendor</h3>
          <Select
            value={workbookData.selectedVendorId?.toString()}
            onValueChange={(value) => handleSelectChange("vendor", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id.toString()}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Primary Device Type</h3>
          <Select
            value={workbookData.selectedDeviceTypeId?.toString()}
            onValueChange={(value) => handleSelectChange("device-type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a device type" />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
