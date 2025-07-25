"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold mt-6 mb-2 border-b pb-2">{children}</h3>
)

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
    <Label className="md:text-right md:pr-4">{label}</Label>
    <div className="md:col-span-2">{children}</div>
  </div>
)

export function ScopingQuestionnaire() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({}) // In a real app, this would be a complex typed object

  const handleSave = () => {
    console.log("Saving form data:", formData)
    toast({
      title: "Scoping Saved",
      description: "Your scoping questionnaire has been saved successfully.",
    })
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          // Based on PRD Section 3.2: Business & Organizational Discovery
          <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">Organization Profile</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Company Legal Name">
                  <Input placeholder="e.g., Acme Corporation" />
                </FormField>
                <FormField label="Industry Classification">
                  <Input placeholder="e.g., Healthcare, Finance, Retail" />
                </FormField>
                <FormField label="Number of Employees">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-500">1-500</SelectItem>
                      <SelectItem value="501-5000">501 - 5,000</SelectItem>
                      <SelectItem value="5001-20000">5,001 - 20,000</SelectItem>
                      <SelectItem value="20001+">20,001+</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl">Stakeholder Mapping</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Executive Sponsor">
                  <Input placeholder="Name & Title" />
                </FormField>
                <FormField label="IT Leadership">
                  <Input placeholder="Name(s) & Title(s)" />
                </FormField>
                <FormField label="Security Team Lead">
                  <Input placeholder="Name & Title" />
                </FormField>
                <FormField label="Network Team Lead">
                  <Input placeholder="Name & Title" />
                </FormField>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl">Business Drivers</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Primary Business Objectives">
                  <Textarea placeholder="Describe the main goals for this project..." />
                </FormField>
                <FormField label="Key Security Concerns">
                  <Textarea placeholder="e.g., Ransomware, insider threats, data exfiltration..." />
                </FormField>
                <FormField label="Compliance Requirements">
                  <div className="grid grid-cols-2 gap-2">
                    {["PCI-DSS", "HIPAA", "SOX", "GDPR", "NIST", "CMMC"].map((c) => (
                      <div key={c} className="flex items-center space-x-2">
                        <Checkbox id={`compliance-${c}`} />
                        <Label htmlFor={`compliance-${c}`} className="font-normal">
                          {c}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      case 2:
        return (
          // Based on PRD Section 3.2: Technical Infrastructure Discovery
          <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">Network Architecture</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Number of Sites/Locations">
                  <Input type="number" placeholder="e.g., 50" />
                </FormField>
                <FormField label="WAN Connectivity">
                  <Input placeholder="e.g., MPLS, SD-WAN, VPN" />
                </FormField>
                <FormField label="Network Segmentation Strategy">
                  <Textarea placeholder="Describe current VLANs, subnets, or segmentation approach..." />
                </FormField>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl">Endpoint Inventory</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Total Endpoint Count">
                  <Input type="number" placeholder="Approximate number of devices" />
                </FormField>
                <FormField label="Windows Workstations">
                  <Input type="number" placeholder="Count" />
                </FormField>
                <FormField label="Mac Workstations">
                  <Input type="number" placeholder="Count" />
                </FormField>
                <FormField label="Mobile Devices (iOS/Android)">
                  <Input type="number" placeholder="Count" />
                </FormField>
                <FormField label="IoT Devices">
                  <Textarea placeholder="Describe types and approximate counts of IoT devices..." />
                </FormField>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl">Security Infrastructure</AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <FormField label="Firewall Vendor(s)">
                  <Input placeholder="e.g., Palo Alto, Fortinet, Cisco ASA" />
                </FormField>
                <FormField label="SIEM Platform">
                  <Input placeholder="e.g., Splunk, QRadar, Sentinel" />
                </FormField>
                <FormField label="EDR/XDR Solution">
                  <Input placeholder="e.g., CrowdStrike, SentinelOne, Defender" />
                </FormField>
                <FormField label="Certificate Authority">
                  <Input placeholder="e.g., Microsoft CA, DigiCert, Self-signed" />
                </FormField>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligent Scoping Questionnaire</CardTitle>
        <CardDescription>
          Complete this discovery questionnaire to automatically generate project requirements and use cases. Step{" "}
          {step} of 2: {step === 1 ? "Business Discovery" : "Technical Discovery"}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
      <div className="flex justify-between p-6 border-t">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Progress
          </Button>
          {step === 2 ? (
            <Button onClick={handleSave}>Finish & Generate Report</Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
