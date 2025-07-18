"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Network,
  Shield,
  Users,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"

interface ScopingData {
  // Organization Information
  organizationName: string
  contactPerson: string
  email: string
  phone: string
  industry: string
  companySize: string

  // Network Infrastructure
  networkVendors: string[]
  switchModels: string[]
  wirelessVendors: string[]
  accessPointModels: string[]
  firewallVendors: string[]
  routerVendors: string[]

  // Identity Providers
  identityProviders: string[]
  activeDirectory: boolean
  entraId: boolean
  ldapServers: string[]

  // MDM Solutions
  mdmSolutions: string[]
  intuneDeployment: boolean
  jamfDeployment: boolean

  // Security Solutions
  siemSolutions: string[]
  mdrSolutions: string[]
  xdrSolutions: string[]
  edrSolutions: string[]

  // Authentication Workflows
  currentAuthMethods: string[]
  certificateAuthority: string
  mfaRequirements: string[]

  // Access Control Policies
  vlanSegmentation: boolean
  networkSegments: string[]
  accessPolicies: string[]

  // Risk Assessment
  complianceFrameworks: string[]
  riskTolerance: string
  securityRequirements: string[]

  // Timeline and Budget
  projectTimeline: string
  budgetRange: string
  keyStakeholders: string[]
}

const initialData: ScopingData = {
  organizationName: "",
  contactPerson: "",
  email: "",
  phone: "",
  industry: "",
  companySize: "",
  networkVendors: [],
  switchModels: [],
  wirelessVendors: [],
  accessPointModels: [],
  firewallVendors: [],
  routerVendors: [],
  identityProviders: [],
  activeDirectory: false,
  entraId: false,
  ldapServers: [],
  mdmSolutions: [],
  intuneDeployment: false,
  jamfDeployment: false,
  siemSolutions: [],
  mdrSolutions: [],
  xdrSolutions: [],
  edrSolutions: [],
  currentAuthMethods: [],
  certificateAuthority: "",
  mfaRequirements: [],
  vlanSegmentation: false,
  networkSegments: [],
  accessPolicies: [],
  complianceFrameworks: [],
  riskTolerance: "",
  securityRequirements: [],
  projectTimeline: "",
  budgetRange: "",
  keyStakeholders: [],
}

interface ScopingQuestionnaireProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: ScopingData) => void
}

export function ScopingQuestionnaire({ isOpen, onClose, onComplete }: ScopingQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ScopingData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    {
      title: "Organization Information",
      icon: <Building className="h-5 w-5" />,
      description: "Basic company and contact details",
    },
    {
      title: "Network Infrastructure",
      icon: <Network className="h-5 w-5" />,
      description: "Current network equipment and vendors",
    },
    {
      title: "Identity Providers",
      icon: <Users className="h-5 w-5" />,
      description: "Authentication and directory services",
    },
    {
      title: "MDM Solutions",
      icon: <Settings className="h-5 w-5" />,
      description: "Mobile device management platforms",
    },
    {
      title: "Security Solutions",
      icon: <Shield className="h-5 w-5" />,
      description: "SIEM, MDR, XDR, and EDR solutions",
    },
    {
      title: "Authentication Workflows",
      icon: <Shield className="h-5 w-5" />,
      description: "Current authentication methods and requirements",
    },
    {
      title: "Access Control Policies",
      icon: <Settings className="h-5 w-5" />,
      description: "Network segmentation and access policies",
    },
    {
      title: "Risk Assessment",
      icon: <AlertCircle className="h-5 w-5" />,
      description: "Compliance and security requirements",
    },
    {
      title: "Timeline & Budget",
      icon: <Clock className="h-5 w-5" />,
      description: "Project timeline and budget considerations",
    },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!formData.organizationName) newErrors.organizationName = "Organization name is required"
        if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.industry) newErrors.industry = "Industry is required"
        break
      case 1:
        if (formData.networkVendors.length === 0) newErrors.networkVendors = "At least one network vendor is required"
        break
      case 2:
        if (formData.identityProviders.length === 0)
          newErrors.identityProviders = "At least one identity provider is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete(formData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCheckboxChange = (field: keyof ScopingData, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Portnox NAC Scoping Questionnaire</h2>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {steps[currentStep].icon}
            <div>
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                    className={errors.organizationName ? "border-red-500" : ""}
                  />
                  {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
                </div>

                <div>
                  <Label htmlFor="contactPerson">Primary Contact *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    className={errors.contactPerson ? "border-red-500" : ""}
                  />
                  {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                      <SelectItem value="5000+">5000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Please select all network vendors and equipment models currently deployed in your environment.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">Network Switch Vendors *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {["Cisco", "Aruba", "Juniper", "HP/HPE", "Dell", "Extreme", "Ubiquiti", "Other"].map((vendor) => (
                    <div key={vendor} className="flex items-center space-x-2">
                      <Checkbox
                        id={`switch-${vendor}`}
                        checked={formData.networkVendors.includes(vendor)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("networkVendors", vendor, checked as boolean)
                        }
                      />
                      <Label htmlFor={`switch-${vendor}`}>{vendor}</Label>
                    </div>
                  ))}
                </div>
                {errors.networkVendors && <p className="text-red-500 text-sm mt-1">{errors.networkVendors}</p>}
              </div>

              <div>
                <Label htmlFor="switchModels">Switch Models (specify models for selected vendors)</Label>
                <Textarea
                  id="switchModels"
                  value={formData.switchModels.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, switchModels: e.target.value.split(", ").filter(Boolean) }))
                  }
                  placeholder="e.g., Cisco Catalyst 9300, Aruba 6300M, etc."
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Wireless Vendors</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {["Cisco", "Aruba", "Ruckus", "Ubiquiti", "Meraki", "Extreme", "Mist", "Other"].map((vendor) => (
                    <div key={vendor} className="flex items-center space-x-2">
                      <Checkbox
                        id={`wireless-${vendor}`}
                        checked={formData.wirelessVendors.includes(vendor)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("wirelessVendors", vendor, checked as boolean)
                        }
                      />
                      <Label htmlFor={`wireless-${vendor}`}>{vendor}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="accessPointModels">Access Point Models</Label>
                <Textarea
                  id="accessPointModels"
                  value={formData.accessPointModels.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accessPointModels: e.target.value.split(", ").filter(Boolean) }))
                  }
                  placeholder="e.g., Cisco 9130AXI, Aruba AP-515, etc."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Identity providers are crucial for NAC integration. Please select all that apply to your environment.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">Identity Providers *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Microsoft Entra ID (Azure AD)",
                    "Active Directory (On-premises)",
                    "LDAP",
                    "RADIUS",
                    "SAML Identity Provider",
                    "Google Workspace",
                    "Okta",
                    "Ping Identity",
                    "Other",
                  ].map((provider) => (
                    <div key={provider} className="flex items-center space-x-2">
                      <Checkbox
                        id={`idp-${provider}`}
                        checked={formData.identityProviders.includes(provider)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("identityProviders", provider, checked as boolean)
                        }
                      />
                      <Label htmlFor={`idp-${provider}`}>{provider}</Label>
                    </div>
                  ))}
                </div>
                {errors.identityProviders && <p className="text-red-500 text-sm mt-1">{errors.identityProviders}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="activeDirectory"
                    checked={formData.activeDirectory}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, activeDirectory: checked as boolean }))
                    }
                  />
                  <Label htmlFor="activeDirectory">Active Directory Domain Services</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entraId"
                    checked={formData.entraId}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, entraId: checked as boolean }))}
                  />
                  <Label htmlFor="entraId">Microsoft Entra ID Integration</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="ldapServers">LDAP Server Details (if applicable)</Label>
                <Textarea
                  id="ldapServers"
                  value={formData.ldapServers.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ldapServers: e.target.value.split(", ").filter(Boolean) }))
                  }
                  placeholder="LDAP server addresses, ports, and configuration details"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  MDM solutions help with device compliance and posture assessment in NAC deployments.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">MDM/UEM Solutions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Microsoft Intune",
                    "JAMF Pro",
                    "VMware Workspace ONE",
                    "Citrix Endpoint Management",
                    "IBM MaaS360",
                    "BlackBerry UEM",
                    "Google Workspace",
                    "Kandji",
                    "Other",
                  ].map((solution) => (
                    <div key={solution} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mdm-${solution}`}
                        checked={formData.mdmSolutions.includes(solution)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("mdmSolutions", solution, checked as boolean)
                        }
                      />
                      <Label htmlFor={`mdm-${solution}`}>{solution}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="intuneDeployment"
                    checked={formData.intuneDeployment}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, intuneDeployment: checked as boolean }))
                    }
                  />
                  <Label htmlFor="intuneDeployment">Microsoft Intune Fully Deployed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jamfDeployment"
                    checked={formData.jamfDeployment}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, jamfDeployment: checked as boolean }))
                    }
                  />
                  <Label htmlFor="jamfDeployment">JAMF Pro Fully Deployed</Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Security solutions integration enhances NAC visibility and threat response capabilities.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">SIEM Solutions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {["Splunk", "IBM QRadar", "Microsoft Sentinel", "LogRhythm", "ArcSight", "Elastic SIEM", "Other"].map(
                    (solution) => (
                      <div key={solution} className="flex items-center space-x-2">
                        <Checkbox
                          id={`siem-${solution}`}
                          checked={formData.siemSolutions.includes(solution)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("siemSolutions", solution, checked as boolean)
                          }
                        />
                        <Label htmlFor={`siem-${solution}`}>{solution}</Label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">MDR/MSSP Solutions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "CrowdStrike Falcon Complete",
                    "Microsoft Defender for Business",
                    "SentinelOne Vigilance",
                    "Rapid7 MDR",
                    "Arctic Wolf",
                    "Other",
                  ].map((solution) => (
                    <div key={solution} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mdr-${solution}`}
                        checked={formData.mdrSolutions.includes(solution)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("mdrSolutions", solution, checked as boolean)
                        }
                      />
                      <Label htmlFor={`mdr-${solution}`}>{solution}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">XDR Solutions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Microsoft Defender XDR",
                    "CrowdStrike Falcon",
                    "SentinelOne Singularity",
                    "Palo Alto Cortex XDR",
                    "Trend Micro Vision One",
                    "Other",
                  ].map((solution) => (
                    <div key={solution} className="flex items-center space-x-2">
                      <Checkbox
                        id={`xdr-${solution}`}
                        checked={formData.xdrSolutions.includes(solution)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("xdrSolutions", solution, checked as boolean)
                        }
                      />
                      <Label htmlFor={`xdr-${solution}`}>{solution}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">EDR Solutions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Microsoft Defender for Endpoint",
                    "CrowdStrike Falcon",
                    "SentinelOne",
                    "Carbon Black",
                    "Cylance",
                    "Other",
                  ].map((solution) => (
                    <div key={solution} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edr-${solution}`}
                        checked={formData.edrSolutions.includes(solution)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("edrSolutions", solution, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edr-${solution}`}>{solution}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Understanding current authentication methods helps design the optimal NAC deployment strategy.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">Current Authentication Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "802.1X with User Certificates",
                    "802.1X with Machine Certificates",
                    "802.1X with Username/Password",
                    "MAC Address Authentication",
                    "Web Portal Authentication",
                    "Pre-shared Keys (PSK)",
                    "Guest Network Access",
                    "Other",
                  ].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`auth-${method}`}
                        checked={formData.currentAuthMethods.includes(method)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("currentAuthMethods", method, checked as boolean)
                        }
                      />
                      <Label htmlFor={`auth-${method}`}>{method}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="certificateAuthority">Certificate Authority (if using certificates)</Label>
                <Select
                  value={formData.certificateAuthority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, certificateAuthority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Certificate Authority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="microsoft-ca">Microsoft Certificate Authority</SelectItem>
                    <SelectItem value="openssl">OpenSSL</SelectItem>
                    <SelectItem value="digicert">DigiCert</SelectItem>
                    <SelectItem value="verisign">VeriSign</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold">MFA Requirements</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Microsoft Authenticator",
                    "Google Authenticator",
                    "RSA SecurID",
                    "Duo Security",
                    "Okta Verify",
                    "SMS/Text Messages",
                    "Hardware Tokens",
                    "Biometric Authentication",
                  ].map((mfa) => (
                    <div key={mfa} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mfa-${mfa}`}
                        checked={formData.mfaRequirements.includes(mfa)}
                        onCheckedChange={(checked) => handleCheckboxChange("mfaRequirements", mfa, checked as boolean)}
                      />
                      <Label htmlFor={`mfa-${mfa}`}>{mfa}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Access control policies define how users and devices are granted network access based on their
                  identity and posture.
                </AlertDescription>
              </Alert>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vlanSegmentation"
                  checked={formData.vlanSegmentation}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, vlanSegmentation: checked as boolean }))
                  }
                />
                <Label htmlFor="vlanSegmentation" className="text-base font-semibold">
                  VLAN Segmentation Currently Implemented
                </Label>
              </div>

              <div>
                <Label className="text-base font-semibold">Network Segments/VLANs</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Corporate/Employee Network",
                    "Guest Network",
                    "BYOD Network",
                    "IoT/OT Network",
                    "Server Network",
                    "DMZ Network",
                    "Management Network",
                    "Quarantine Network",
                  ].map((segment) => (
                    <div key={segment} className="flex items-center space-x-2">
                      <Checkbox
                        id={`segment-${segment}`}
                        checked={formData.networkSegments.includes(segment)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("networkSegments", segment, checked as boolean)
                        }
                      />
                      <Label htmlFor={`segment-${segment}`}>{segment}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Access Control Policies</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {[
                    "Role-based Access Control (RBAC)",
                    "Time-based Access Control",
                    "Location-based Access Control",
                    "Device Compliance Policies",
                    "Application-based Access Control",
                    "Zero Trust Network Access",
                  ].map((policy) => (
                    <div key={policy} className="flex items-center space-x-2">
                      <Checkbox
                        id={`policy-${policy}`}
                        checked={formData.accessPolicies.includes(policy)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("accessPolicies", policy, checked as boolean)
                        }
                      />
                      <Label htmlFor={`policy-${policy}`}>{policy}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Risk assessment and compliance requirements help determine the appropriate security controls and
                  policies.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-base font-semibold">Compliance Frameworks</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "HIPAA",
                    "PCI DSS",
                    "SOX",
                    "GDPR",
                    "NIST Cybersecurity Framework",
                    "ISO 27001",
                    "FISMA",
                    "CMMC",
                  ].map((framework) => (
                    <div key={framework} className="flex items-center space-x-2">
                      <Checkbox
                        id={`compliance-${framework}`}
                        checked={formData.complianceFrameworks.includes(framework)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("complianceFrameworks", framework, checked as boolean)
                        }
                      />
                      <Label htmlFor={`compliance-${framework}`}>{framework}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance Level</Label>
                <RadioGroup
                  value={formData.riskTolerance}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, riskTolerance: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low">Low - Maximum security, minimal risk acceptance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium">Medium - Balanced security and usability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high">High - Prioritize usability over strict security</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">Security Requirements</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {[
                    "Data Loss Prevention (DLP)",
                    "Endpoint Detection and Response (EDR)",
                    "Network Traffic Analysis",
                    "User Behavior Analytics (UBA)",
                    "Threat Intelligence Integration",
                    "Incident Response Automation",
                  ].map((requirement) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <Checkbox
                        id={`security-${requirement}`}
                        checked={formData.securityRequirements.includes(requirement)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("securityRequirements", requirement, checked as boolean)
                        }
                      />
                      <Label htmlFor={`security-${requirement}`}>{requirement}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Final step! Please provide timeline and budget information to complete the scoping assessment.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="projectTimeline">Project Timeline</Label>
                <Select
                  value={formData.projectTimeline}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, projectTimeline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (0-30 days)</SelectItem>
                    <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                    <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                    <SelectItem value="long">Long-term (6-12 months)</SelectItem>
                    <SelectItem value="planning">Planning phase (12+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budgetRange">Budget Range</Label>
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
                    <SelectItem value="over-500k">Over $500,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keyStakeholders">Key Stakeholders</Label>
                <Textarea
                  id="keyStakeholders"
                  value={formData.keyStakeholders.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, keyStakeholders: e.target.value.split(", ").filter(Boolean) }))
                  }
                  placeholder="List key stakeholders and their roles (e.g., CISO, Network Manager, etc.)"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Assessment
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
