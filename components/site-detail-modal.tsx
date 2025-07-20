"use client"

import { Card } from "@/components/ui/card"

import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "./ui/use-toast"
import * as api from "@/lib/api"
import type { Site, User, UseCase, TestCase, LibraryData } from "@/lib/database"

interface SiteDetailModalProps {
  isOpen: boolean
  onClose: () => void
  site: Site
  onUpdate: () => void
  library: LibraryData
  users: User[]
}

const MultiSelectGrid = ({ title, options, selectedIds, onSelectionChange }: any) => (
  <div>
    <Label className="font-semibold">{title}</Label>
    <ScrollArea className="h-48 mt-2 border rounded p-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {options.map((option: any) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option.id}`}
              checked={selectedIds.includes(option.id)}
              onCheckedChange={(checked) => {
                const newSelection = checked
                  ? [...selectedIds, option.id]
                  : selectedIds.filter((id: number) => id !== option.id)
                onSelectionChange(newSelection)
              }}
            />
            <Label htmlFor={`${title}-${option.id}`} className="text-sm font-normal">
              {option.name}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
)

export function SiteDetailModal({ isOpen, onClose, site, onUpdate, library, users }: SiteDetailModalProps) {
  const [editedSite, setEditedSite] = useState<Site>(site)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditedSite(JSON.parse(JSON.stringify(site)))
  }, [site, isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.updateSite(editedSite.id, editedSite)
      toast({ title: "Success", description: "Site updated successfully." })
      onUpdate()
      onClose()
    } catch (error) {
      toast({ title: "Error", description: "Failed to update site.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUseCaseChange = (useCaseId: string, checked: boolean) => {
    const currentUseCaseIds = editedSite.use_case_ids || []
    const newUseCaseIds = checked
      ? [...currentUseCaseIds, useCaseId]
      : currentUseCaseIds.filter((id) => id !== useCaseId)
    setEditedSite((prev) => ({ ...prev, use_case_ids: newUseCaseIds }))
  }

  const handleTestCaseStatusChange = (testCaseId: string, newStatus: string) => {
    const statuses = [...(editedSite.test_case_statuses || [])]
    const statusIndex = statuses.findIndex((s) => s.test_case_id === testCaseId)
    if (statusIndex > -1) {
      statuses[statusIndex].status = newStatus as any
    } else {
      statuses.push({ test_case_id: testCaseId, status: newStatus as any })
    }
    setEditedSite((prev) => ({ ...prev, test_case_statuses: statuses }))
  }

  const siteTestCases = useMemo((): TestCase[] => {
    if (!editedSite.use_case_ids || !library.useCases || !library.testCases) return []

    // This is a simplified logic. A real application would have a direct link
    // between use cases and test cases in the database.
    const applicableTestCases = new Set<TestCase>()
    const selectedUseCases = library.useCases.filter((uc: UseCase) => editedSite.use_case_ids.includes(uc.id))

    selectedUseCases.forEach((uc: UseCase) => {
      library.testCases.forEach((tc: TestCase) => {
        if (uc.title.toLowerCase().includes("cert") && tc.name.toLowerCase().includes("cert")) {
          applicableTestCases.add(tc)
        }
        if (uc.title.toLowerCase().includes("mab") && tc.name.toLowerCase().includes("mab")) {
          applicableTestCases.add(tc)
        }
        if (uc.title.toLowerCase().includes("auth") && tc.name.toLowerCase().includes("cert")) {
          applicableTestCases.add(tc)
        }
      })
    })

    return applicableTestCases.size > 0 ? Array.from(applicableTestCases) : library.testCases
  }, [editedSite.use_case_ids, library.useCases, library.testCases])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Manage Site: {site.name}</DialogTitle>
          <DialogDescription>Edit details, manage assignments, and track progress.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-hidden">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="team_vendors">Team & Vendors</TabsTrigger>
              <TabsTrigger value="use_cases">Use Cases</TabsTrigger>
              <TabsTrigger value="test_plan">Test Plan</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh] p-1">
              <TabsContent value="details" className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Site Name</Label>
                    <Input
                      value={editedSite.name}
                      onChange={(e) => setEditedSite((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editedSite.status}
                      onValueChange={(v) => setEditedSite((p) => ({ ...p, status: v as Site["status"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Go-Live Date</Label>
                    <Input
                      type="date"
                      value={editedSite.planned_end}
                      onChange={(e) => setEditedSite((p) => ({ ...p, planned_end: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Users</Label>
                    <Input
                      type="number"
                      value={editedSite.users_count}
                      onChange={(e) =>
                        setEditedSite((p) => ({ ...p, users_count: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="team_vendors" className="p-4 grid grid-cols-2 gap-6">
                <MultiSelectGrid
                  title="Technical Owners"
                  options={users.filter((u) => u.user_type === "technical_owner")}
                  selectedIds={editedSite.technical_owner_ids || []}
                  onSelectionChange={(ids: number[]) => setEditedSite((p) => ({ ...p, technical_owner_ids: ids }))}
                />
                <MultiSelectGrid
                  title="Wired Vendors"
                  options={library.wiredVendors}
                  selectedIds={editedSite.vendor_ids || []}
                  onSelectionChange={(ids: number[]) => setEditedSite((p) => ({ ...p, vendor_ids: ids }))}
                />
                <MultiSelectGrid
                  title="IDP Vendors"
                  options={library.idpVendors}
                  selectedIds={editedSite.idp_vendor_ids || []}
                  onSelectionChange={(ids: number[]) => setEditedSite((p) => ({ ...p, idp_vendor_ids: ids }))}
                />
                <MultiSelectGrid
                  title="EDR/XDR Vendors"
                  options={library.edrXdrVendors}
                  selectedIds={editedSite.edr_xdr_vendor_ids || []}
                  onSelectionChange={(ids: number[]) => setEditedSite((p) => ({ ...p, edr_xdr_vendor_ids: ids }))}
                />
              </TabsContent>
              <TabsContent value="use_cases" className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {library.useCases.map((uc: UseCase) => (
                    <Card key={uc.id} className="p-3">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={`uc-${uc.id}`}
                          checked={(editedSite.use_case_ids || []).includes(uc.id)}
                          onCheckedChange={(c) => handleUseCaseChange(uc.id, c as boolean)}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={`uc-${uc.id}`} className="font-bold">
                            {uc.title}
                          </Label>
                          <p className="text-xs text-muted-foreground">{uc.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="test_plan" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Case</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteTestCases.map((tc: TestCase) => {
                      const status =
                        (editedSite.test_case_statuses || []).find((s) => s.test_case_id === tc.id)?.status ||
                        "Not Tested"
                      return (
                        <TableRow key={tc.id}>
                          <TableCell className="font-medium">{tc.name}</TableCell>
                          <TableCell className="text-xs">{tc.description}</TableCell>
                          <TableCell>
                            <Select value={status} onValueChange={(v) => handleTestCaseStatusChange(tc.id, v)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Not Tested">Not Tested</SelectItem>
                                <SelectItem value="WIP">WIP</SelectItem>
                                <SelectItem value="Pass">Pass</SelectItem>
                                <SelectItem value="Fail">Fail</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {siteTestCases.length === 0 && (
                  <div className="text-center text-muted-foreground p-8">
                    No test cases for selected use cases. Assign use cases in the 'Use Cases' tab.
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
