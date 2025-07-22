"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockCountries } from "@/lib/library-data"
import type { LibraryData, Vendor, BaseVendor, ScopingQuestionnaire as ScopingQuestionnaireType } from "@/lib/database"

interface ScopingQuestionnaireProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  library: LibraryData
  questionnaire: ScopingQuestionnaireType | null
}

interface CheckboxGridProps {
  title: string
  options: (Vendor | BaseVendor | { id: number; name: string })[] | undefined
  selected: string[]
  onSelectionChange: (newSelection: string[]) => void
}

const initialFormData = {
  organizationName: "",
  totalUsers: 1000,
  country: "United States",
  region: "North America",
  industry: "technology",
  projectGoals: [],
  legacySystems: [],
  idpVendors: [],
  mfaVendors: [],
  wiredVendors: [],
  wirelessVendors: [],
  mdmVendors: [],
  edrVendors: [],
  siemVendors: [],
  firewallVendors: [],
  vpnVendors: [],
  status: "Draft",
}

const CheckboxGrid = ({ title, options, selected, onSelectionChange }: CheckboxGridProps) => (
  <div>
    <Label className="font-semibold">{title}</Label>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 mt-2 border rounded p-3">
      {(options || []).map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${title}-${option.id}`}
            checked={selected.includes(option.name)}
            onCheckedChange={(checked) => {
              const newSelection = checked
                ? [...selected, option.name]
                : selected.filter((name: string) => name !== option.name)
              onSelectionChange(newSelection)
            }}
          />
          <Label htmlFor={`${title}-${option.id}`} className="text-sm font-normal">
            {option.name}
          </Label>
        </div>
      ))}
    </div>
  </div>
)

export function ScopingQuestionnaire({ isOpen, onClose, onSave, library, questionnaire }: ScopingQuestionnaireProps) {
  const [formData, setFormData] = useState<any>(initialFormData)

  useEffect(() => {
    if (questionnaire) {
      setFormData(questionnaire)
    } else {
      setFormData(initialFormData)
    }
  }, [questionnaire, isOpen])

  const handleSubmit = (status: "Draft" | "Completed") => {
    onSave({ ...formData, status })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {questionnaire ? `Edit: ${questionnaire.organizationName}` : "New Deployment Scoping"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] p-4">
          <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Organization & Project Drivers</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organization Name</Label>
                    <Input
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Total Users</Label>
                    <Input
                      type="number"
                      value={formData.totalUsers}
                      onChange={(e) => setFormData({ ...formData, totalUsers: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCountries.map((c) => (
                          <SelectItem key={c.code} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Region</Label>
                    <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {library.regions.map((r) => (
                          <SelectItem key={r.name} value={r.name}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CheckboxGrid
                  title="Project Goals"
                  options={[
                    { id: 1, name: "Zero Trust" },
                    { id: 2, name: "Legacy NAC Migration" },
                    { id: 3, name: "Compliance" },
                    { id: 4, name: "Incident Response" },
                    { id: 5, name: "IoT Security" },
                    { id: 6, name: "Guest Access" },
                    { id: 7, name: "Secure Remote Work" },
                  ]}
                  selected={formData.projectGoals}
                  onSelectionChange={(s: any) => setFormData({ ...formData, projectGoals: s })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Identity & Security Vendors</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <CheckboxGrid
                  title="Identity Providers (IDP)"
                  options={library.idpVendors}
                  selected={formData.idpVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, idpVendors: s })}
                />
                <CheckboxGrid
                  title="MFA Solutions"
                  options={library.mfaVendors}
                  selected={formData.mfaVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, mfaVendors: s })}
                />
                <CheckboxGrid
                  title="EDR/XDR Solutions"
                  options={library.edrXdrVendors}
                  selected={formData.edrVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, edrVendors: s })}
                />
                <CheckboxGrid
                  title="SIEM Solutions"
                  options={library.siemVendors}
                  selected={formData.siemVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, siemVendors: s })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Network & Endpoint Vendors</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <CheckboxGrid
                  title="Wired Vendors"
                  options={library.wiredVendors}
                  selected={formData.wiredVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, wiredVendors: s })}
                />
                <CheckboxGrid
                  title="Wireless Vendors"
                  options={library.wirelessVendors}
                  selected={formData.wirelessVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, wirelessVendors: s })}
                />
                <CheckboxGrid
                  title="Firewall Vendors"
                  options={library.firewallVendors}
                  selected={formData.firewallVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, firewallVendors: s })}
                />
                <CheckboxGrid
                  title="VPN Vendors"
                  options={library.vpnVendors}
                  selected={formData.vpnVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, vpnVendors: s })}
                />
                <CheckboxGrid
                  title="MDM/UEM Vendors"
                  options={library.mdmVendors}
                  selected={formData.mdmVendors}
                  onSelectionChange={(s: any) => setFormData({ ...formData, mdmVendors: s })}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <DialogFooter className="justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div>
            <Button variant="secondary" onClick={() => handleSubmit("Draft")}>
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit("Completed")} className="ml-2">
              Save and Mark as Completed
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
