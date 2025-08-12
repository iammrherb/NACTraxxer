"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building2,
  Users,
  Network,
  Shield,
  Key,
  Globe,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Plus,
  X,
} from "lucide-react"
import type { ScopingData } from "@/lib/types"

interface ScopingQuestionnaireProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ScopingData) => void
  existingData?: ScopingData
}

export function ScopingQuestionnaire({ isOpen, onClose, onSave, existingData }: ScopingQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ScopingData>({
    organizationName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    totalSites: 0,
    totalUsers: 0,
    networkVendors: [],
    switchModels: [],
    wirelessModels: [],
    identityProviders: [],
    mdmSolutions: [],
    siemSolutions: [],
    mdrSolutions: [],
    xdrSolutions: [],
    edrSolutions: [],
    authMethods: [],
    certificateRequirements: [],
    guestAccessRequirements: { enabled: false, duration: 24, sponsorship: false },
    byodRequirements: { enabled: false, platforms: [], restrictions: [] },
    vlanSegmentation: [],
    accessPolicies: [],
    complianceRequirements: [],
    riskTolerance: "medium",
    securityPriorities: [],
    complianceFrameworks: [],
    targetDeploymentDate: "",
    budgetRange: "",
    projectTimelineMonths: 6,
    highAvailabilityRequired: false,
    disasterRecoveryRequired: false,
    multiRegionDeployment: false,
  })

  const steps = [
    { id: "organization", title: "Organization", icon: Building2 },
    { id: "infrastructure", title: "Infrastructure", icon: Network },
    { id: "identity", title: "Identity & MDM", icon: Users },
    { id: "security", title: "Security Solutions", icon: Shield },
    { id: "authentication", title: "Authentication", icon: Key },
    { id: "access-control", title: "Access Control", icon: Globe },
    { id: "risk", title: "Risk Assessment", icon: AlertTriangle },
    { id: "timeline", title: "Timeline & Budget", icon: Calendar },
    { id: "review", title: "Review", icon: CheckCircle },
  ]

  useEffect(() => {
    if (existingData) {
      setFormData(existingData)
    }
  }, [existingData])

  const progress = ((currentStep + 1) / steps.length) * 100

  const addNetworkVendor = () => {
    setFormData((prev) => ({
      ...prev,
      networkVendors: [...prev.networkVendors, { name: "", type: "switch", models: [] }],
    }))
  }

  const removeNetworkVendor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      networkVendors: prev.networkVendors.filter((_, i) => i !== index),
    }))
  }

  const addIdentityProvider = () => {
    setFormData((prev) => ({
      ...prev,
      identityProviders: [...prev.identityProviders, { name: "", type: "cloud", userCount: 0 }],
    }))
  }

  const addVlanSegment = () => {
    setFormData((prev) => ({
      ...prev,
      vlanSegmentation: [...prev.vlanSegmentation, { name: "", purpose: "", userGroups: [] }],
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSave(formData)
    onClose()
  }

  const renderOrganizationStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            value={formData.organizationName}
            onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
            placeholder="Enter organization name"
          />
        </div>
        <div>
          <Label htmlFor="contactPerson">Primary Contact *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
            placeholder="Contact person name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Email Address *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
            placeholder="contact@organization.com"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Phone Number</Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalSites">Total Sites *</Label>
          <Input
            id="totalSites"
            type="number"
            value={formData.totalSites}
            onChange={(e) => setFormData((prev) => ({ ...prev, totalSites: Number.parseInt(e.target.value) || 0 }))}
            placeholder="Number of sites"
          />
        </div>
        <div>
          <Label htmlFor="totalUsers">Total Users *</Label>
          <Input
            id="totalUsers"
            type="number"
            value={formData.totalUsers}
            onChange={(e) => setFormData((prev) => ({ ...prev, totalUsers: Number.parseInt(e.target.value) || 0 }))}
            placeholder="Number of users"
          />
        </div>
      </div>
    </div>
  )

  const renderInfrastructureStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Network Vendors</Label>
          <Button onClick={addNetworkVendor} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {formData.networkVendors.map((vendor, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div>
                  <Label>Vendor Name</Label>
                  <Select
                    value={vendor.name}
                    onValueChange={(value) => {
                      const updated = [...formData.networkVendors]
                      updated[index].name = value
                      setFormData((prev) => ({ ...prev, networkVendors: updated }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cisco">Cisco</SelectItem>
                      <SelectItem value="meraki">Cisco Meraki</SelectItem>
                      <SelectItem value="aruba">Aruba</SelectItem>
                      <SelectItem value="juniper">Juniper</SelectItem>
                      <SelectItem value="extreme">Extreme Networks</SelectItem>
                      <SelectItem value="ubiquiti">Ubiquiti</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={vendor.type}
                    onValueChange={(value) => {
                      const updated = [...formData.networkVendors]
                      updated[index].type = value
                      setFormData((prev) => ({ ...prev, networkVendors: updated }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="switch">Switch</SelectItem>
                      <SelectItem value="wireless">Wireless</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNetworkVendor(index)} className="ml-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderIdentityStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Identity Providers</Label>
          <Button onClick={addIdentityProvider} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {formData.identityProviders.map((provider, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Provider</Label>
                <Select
                  value={provider.name}
                  onValueChange={(value) => {
                    const updated = [...formData.identityProviders]
                    updated[index].name = value
                    setFormData((prev) => ({ ...prev, identityProviders: updated }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entra-id">Microsoft Entra ID</SelectItem>
                    <SelectItem value="active-directory">Active Directory</SelectItem>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="ping">Ping Identity</SelectItem>
                    <SelectItem value="auth0">Auth0</SelectItem>
                    <SelectItem value="ldap">LDAP</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={provider.type}
                  onValueChange={(value) => {
                    const updated = [...formData.identityProviders]
                    updated[index].type = value
                    setFormData((prev) => ({ ...prev, identityProviders: updated }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="on-premises">On-Premises</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>User Count</Label>
                <Input
                  type="number"
                  value={provider.userCount}
                  onChange={(e) => {
                    const updated = [...formData.identityProviders]
                    updated[index].userCount = Number.parseInt(e.target.value) || 0
                    setFormData((prev) => ({ ...prev, identityProviders: updated }))
                  }}
                  placeholder="Number of users"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <Label className="text-lg font-semibold">MDM Solutions</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            "Microsoft Intune",
            "JAMF",
            "VMware Workspace ONE",
            "MobileIron",
            "Citrix Endpoint Management",
            "Other",
          ].map((mdm) => (
            <div key={mdm} className="flex items-center space-x-2">
              <Checkbox
                id={mdm}
                checked={formData.mdmSolutions.some((m) => m.name === mdm)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData((prev) => ({
                      ...prev,
                      mdmSolutions: [...prev.mdmSolutions, { name: mdm, deviceCount: 0, platforms: [] }],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      mdmSolutions: prev.mdmSolutions.filter((m) => m.name !== mdm),
                    }))
                  }
                }}
              />
              <Label htmlFor={mdm}>{mdm}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecurityStep = () => (
    <div className="space-y-6">
      <Tabs defaultValue="siem" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="siem">SIEM</TabsTrigger>
          <TabsTrigger value="mdr">MDR</TabsTrigger>
          <TabsTrigger value="xdr">XDR</TabsTrigger>
          <TabsTrigger value="edr">EDR</TabsTrigger>
        </TabsList>

        <TabsContent value="siem" className="space-y-4">
          <Label className="text-lg font-semibold">SIEM Solutions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Splunk", "Microsoft Sentinel", "IBM QRadar", "LogRhythm", "ArcSight", "Elastic Security", "Other"].map(
              (siem) => (
                <div key={siem} className="flex items-center space-x-2">
                  <Checkbox
                    id={siem}
                    checked={formData.siemSolutions.some((s) => s.name === siem)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData((prev) => ({
                          ...prev,
                          siemSolutions: [...prev.siemSolutions, { name: siem, version: "", integration: "api" }],
                        }))
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          siemSolutions: prev.siemSolutions.filter((s) => s.name !== siem),
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={siem}>{siem}</Label>
                </div>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="mdr" className="space-y-4">
          <Label className="text-lg font-semibold">MDR Solutions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "CrowdStrike Falcon Complete",
              "Microsoft Defender for Business",
              "SentinelOne Vigilance",
              "Rapid7 MDR",
              "Arctic Wolf",
              "Red Canary",
              "Other",
            ].map((mdr) => (
              <div key={mdr} className="flex items-center space-x-2">
                <Checkbox
                  id={mdr}
                  checked={formData.mdrSolutions.some((m) => m.name === mdr)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        mdrSolutions: [...prev.mdrSolutions, { name: mdr, vendor: "" }],
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        mdrSolutions: prev.mdrSolutions.filter((m) => m.name !== mdr),
                      }))
                    }
                  }}
                />
                <Label htmlFor={mdr}>{mdr}</Label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="xdr" className="space-y-4">
          <Label className="text-lg font-semibold">XDR Solutions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Microsoft Defender XDR",
              "CrowdStrike Falcon",
              "SentinelOne Singularity",
              "Palo Alto Cortex XDR",
              "Trend Micro Vision One",
              "Cisco SecureX",
              "Other",
            ].map((xdr) => (
              <div key={xdr} className="flex items-center space-x-2">
                <Checkbox
                  id={xdr}
                  checked={formData.xdrSolutions.some((x) => x.name === xdr)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        xdrSolutions: [...prev.xdrSolutions, { name: xdr, vendor: "" }],
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        xdrSolutions: prev.xdrSolutions.filter((x) => x.name !== xdr),
                      }))
                    }
                  }}
                />
                <Label htmlFor={xdr}>{xdr}</Label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="edr" className="space-y-4">
          <Label className="text-lg font-semibold">EDR Solutions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "CrowdStrike Falcon",
              "Microsoft Defender for Endpoint",
              "SentinelOne",
              "Carbon Black",
              "Cylance",
              "Symantec EDR",
              "Other",
            ].map((edr) => (
              <div key={edr} className="flex items-center space-x-2">
                <Checkbox
                  id={edr}
                  checked={formData.edrSolutions.some((e) => e.name === edr)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        edrSolutions: [...prev.edrSolutions, { name: edr, vendor: "", coverage: 0 }],
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        edrSolutions: prev.edrSolutions.filter((e) => e.name !== edr),
                      }))
                    }
                  }}
                />
                <Label htmlFor={edr}>{edr}</Label>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderAuthenticationStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Authentication Methods</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            "802.1X (EAP-TLS)",
            "802.1X (PEAP)",
            "MAC Authentication Bypass (MAB)",
            "Web Authentication",
            "Certificate-based",
            "Multi-Factor Authentication",
            "SAML SSO",
            "OAuth/OIDC",
          ].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={method}
                checked={formData.authMethods.includes(method)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData((prev) => ({
                      ...prev,
                      authMethods: [...prev.authMethods, method],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      authMethods: prev.authMethods.filter((m) => m !== method),
                    }))
                  }
                }}
              />
              <Label htmlFor={method}>{method}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold">Guest Access Requirements</Label>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="guestEnabled"
              checked={formData.guestAccessRequirements.enabled}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  guestAccessRequirements: { ...prev.guestAccessRequirements, enabled: checked as boolean },
                }))
              }}
            />
            <Label htmlFor="guestEnabled">Enable Guest Access</Label>
          </div>

          {formData.guestAccessRequirements.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <Label>Session Duration (hours)</Label>
                <Input
                  type="number"
                  value={formData.guestAccessRequirements.duration}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      guestAccessRequirements: {
                        ...prev.guestAccessRequirements,
                        duration: Number.parseInt(e.target.value) || 24,
                      },
                    }))
                  }}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="sponsorship"
                  checked={formData.guestAccessRequirements.sponsorship}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      guestAccessRequirements: {
                        ...prev.guestAccessRequirements,
                        sponsorship: checked as boolean,
                      },
                    }))
                  }}
                />
                <Label htmlFor="sponsorship">Require Sponsorship</Label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold">BYOD Requirements</Label>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="byodEnabled"
              checked={formData.byodRequirements.enabled}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  byodRequirements: { ...prev.byodRequirements, enabled: checked as boolean },
                }))
              }}
            />
            <Label htmlFor="byodEnabled">Enable BYOD</Label>
          </div>

          {formData.byodRequirements.enabled && (
            <div className="ml-6">
              <Label>Supported Platforms</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {["Windows", "macOS", "iOS", "Android", "Linux", "ChromeOS"].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={formData.byodRequirements.platforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData((prev) => ({
                            ...prev,
                            byodRequirements: {
                              ...prev.byodRequirements,
                              platforms: [...prev.byodRequirements.platforms, platform],
                            },
                          }))
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            byodRequirements: {
                              ...prev.byodRequirements,
                              platforms: prev.byodRequirements.platforms.filter((p) => p !== platform),
                            },
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={platform}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderAccessControlStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg font-semibold">VLAN Segmentation</Label>
          <Button onClick={addVlanSegment} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add VLAN
          </Button>
        </div>

        {formData.vlanSegmentation.map((vlan, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>VLAN Name</Label>
                <Input
                  value={vlan.name}
                  onChange={(e) => {
                    const updated = [...formData.vlanSegmentation]
                    updated[index].name = e.target.value
                    setFormData((prev) => ({ ...prev, vlanSegmentation: updated }))
                  }}
                  placeholder="e.g., Corporate, Guest, IoT"
                />
              </div>
              <div>
                <Label>Purpose</Label>
                <Input
                  value={vlan.purpose}
                  onChange={(e) => {
                    const updated = [...formData.vlanSegmentation]
                    updated[index].purpose = e.target.value
                    setFormData((prev) => ({ ...prev, vlanSegmentation: updated }))
                  }}
                  placeholder="e.g., Employee access, Guest internet"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      vlanSegmentation: prev.vlanSegmentation.filter((_, i) => i !== index),
                    }))
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <Label className="text-lg font-semibold">Compliance Requirements</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {["SOX", "HIPAA", "PCI-DSS", "GDPR", "SOC 2", "ISO 27001", "NIST", "FedRAMP", "FISMA", "Other"].map(
            (framework) => (
              <div key={framework} className="flex items-center space-x-2">
                <Checkbox
                  id={framework}
                  checked={formData.complianceRequirements.includes(framework)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        complianceRequirements: [...prev.complianceRequirements, framework],
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        complianceRequirements: prev.complianceRequirements.filter((f) => f !== framework),
                      }))
                    }
                  }}
                />
                <Label htmlFor={framework}>{framework}</Label>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )

  const renderRiskStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Risk Tolerance</Label>
        <Select
          value={formData.riskTolerance}
          onValueChange={(value: "low" | "medium" | "high") => {
            setFormData((prev) => ({ ...prev, riskTolerance: value }))
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select risk tolerance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Maximum security, minimal risk acceptance</SelectItem>
            <SelectItem value="medium">Medium - Balanced security and usability</SelectItem>
            <SelectItem value="high">High - Prioritize usability over strict security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-lg font-semibold">Security Priorities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            "Data Loss Prevention",
            "Insider Threat Protection",
            "Advanced Persistent Threats",
            "Compliance Adherence",
            "Zero Trust Implementation",
            "Incident Response",
            "Vulnerability Management",
            "Identity Governance",
          ].map((priority) => (
            <div key={priority} className="flex items-center space-x-2">
              <Checkbox
                id={priority}
                checked={formData.securityPriorities.includes(priority)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData((prev) => ({
                      ...prev,
                      securityPriorities: [...prev.securityPriorities, priority],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      securityPriorities: prev.securityPriorities.filter((p) => p !== priority),
                    }))
                  }
                }}
              />
              <Label htmlFor={priority}>{priority}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTimelineStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetDate">Target Deployment Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDeploymentDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, targetDeploymentDate: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="timeline">Project Timeline (Months)</Label>
          <Input
            id="timeline"
            type="number"
            value={formData.projectTimelineMonths}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, projectTimelineMonths: Number.parseInt(e.target.value) || 6 }))
            }
            placeholder="6"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="budget">Budget Range</Label>
        <Select
          value={formData.budgetRange}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, budgetRange: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-50k">Under $50,000</SelectItem>
            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
            <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
            <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
            <SelectItem value="over-1m">Over $1,000,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Additional Requirements</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ha"
            checked={formData.highAvailabilityRequired}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, highAvailabilityRequired: checked as boolean }))
            }
          />
          <Label htmlFor="ha">High Availability Required</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dr"
            checked={formData.disasterRecoveryRequired}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, disasterRecoveryRequired: checked as boolean }))
            }
          />
          <Label htmlFor="dr">Disaster Recovery Required</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="multiRegion"
            checked={formData.multiRegionDeployment}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, multiRegionDeployment: checked as boolean }))
            }
          />
          <Label htmlFor="multiRegion">Multi-Region Deployment</Label>
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Organization</h3>
          <p>
            <strong>Name:</strong> {formData.organizationName}
          </p>
          <p>
            <strong>Contact:</strong> {formData.contactPerson}
          </p>
          <p>
            <strong>Sites:</strong> {formData.totalSites}
          </p>
          <p>
            <strong>Users:</strong> {formData.totalUsers}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Timeline & Budget</h3>
          <p>
            <strong>Target Date:</strong> {formData.targetDeploymentDate}
          </p>
          <p>
            <strong>Timeline:</strong> {formData.projectTimelineMonths} months
          </p>
          <p>
            <strong>Budget:</strong> {formData.budgetRange}
          </p>
          <p>
            <strong>Risk Tolerance:</strong> {formData.riskTolerance}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Identity & Security</h3>
          <p>
            <strong>Identity Providers:</strong> {formData.identityProviders.length}
          </p>
          <p>
            <strong>MDM Solutions:</strong> {formData.mdmSolutions.length}
          </p>
          <p>
            <strong>SIEM Solutions:</strong> {formData.siemSolutions.length}
          </p>
          <p>
            <strong>Auth Methods:</strong> {formData.authMethods.length}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Requirements</h3>
          <p>
            <strong>VLAN Segments:</strong> {formData.vlanSegmentation.length}
          </p>
          <p>
            <strong>Compliance:</strong> {formData.complianceRequirements.length} frameworks
          </p>
          <p>
            <strong>High Availability:</strong> {formData.highAvailabilityRequired ? "Yes" : "No"}
          </p>
          <p>
            <strong>Multi-Region:</strong> {formData.multiRegionDeployment ? "Yes" : "No"}
          </p>
        </Card>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderOrganizationStep()
      case 1:
        return renderInfrastructureStep()
      case 2:
        return renderIdentityStep()
      case 3:
        return renderSecurityStep()
      case 4:
        return renderAuthenticationStep()
      case 5:
        return renderAccessControlStep()
      case 6:
        return renderRiskStep()
      case 7:
        return renderTimelineStep()
      case 8:
        return renderReviewStep()
      default:
        return renderOrganizationStep()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span>Portnox NAC Scoping Questionnaire</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-grow overflow-y-auto pr-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2 pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Button
                  key={step.id}
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStep(index)}
                  className="whitespace-nowrap"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {step.title}
                </Button>
              )
            })}
          </div>

          {/* Current Step Content */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                <span>{steps[currentStep].title}</span>
              </h2>
            </div>

            {renderCurrentStep()}
          </Card>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>

          <div className="space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>Submit Questionnaire</Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
