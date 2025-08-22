"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Building2, Users, Shield, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { storage } from "@/lib/storage"
import { toast } from "@/hooks/use-toast"

interface DemoDataModalProps {
  isOpen: boolean
  onClose: () => void
}

const INDUSTRY_SCENARIOS = {
  healthcare: {
    name: "Regional Healthcare System",
    industry: "healthcare",
    description: "Multi-facility healthcare system with HIPAA compliance requirements and medical device integration",
    userCount: 2500,
    siteCount: 5,
    budget: 1500000,
    timeline: "6 months",
    compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11", "Joint Commission"],
    specialties: [
      "Medical Device Security",
      "Patient Data Protection",
      "Compliance Automation",
      "Telemedicine Support",
    ],
  },
  financial: {
    name: "Global Investment Bank",
    industry: "financial services",
    description: "International banking institution with strict regulatory compliance and high-frequency trading",
    userCount: 1800,
    siteCount: 3,
    budget: 1200000,
    timeline: "4 months",
    compliance: ["PCI DSS", "SOX", "GDPR", "MiFID II", "FFIEC"],
    specialties: ["Trading Floor Security", "Fraud Detection", "Regulatory Compliance", "High-Frequency Trading"],
  },
  manufacturing: {
    name: "Advanced Manufacturing Corp",
    industry: "manufacturing",
    description: "Industrial manufacturing with OT/IT convergence and smart factory initiatives",
    userCount: 1200,
    siteCount: 4,
    budget: 900000,
    timeline: "5 months",
    compliance: ["IEC 62443", "NIST 800-82", "ISO 27001", "OSHA"],
    specialties: ["OT Security", "Industrial Control Systems", "Smart Factory", "Predictive Maintenance"],
  },
  technology: {
    name: "Cloud-Native Tech Startup",
    industry: "technology",
    description: "Fast-growing technology company with cloud-first architecture and global remote workforce",
    userCount: 800,
    siteCount: 2,
    budget: 600000,
    timeline: "3 months",
    compliance: ["SOC 2", "GDPR", "ISO 27001", "FedRAMP"],
    specialties: ["Cloud Security", "DevSecOps", "Zero Trust", "Remote Work Security"],
  },
  retail: {
    name: "Omnichannel Retail Chain",
    industry: "retail",
    description: "Multi-location retail chain with e-commerce integration and customer data analytics",
    userCount: 1500,
    siteCount: 8,
    budget: 1000000,
    timeline: "4 months",
    compliance: ["PCI DSS", "CCPA", "GDPR", "SOX"],
    specialties: ["POS Security", "Customer Data Protection", "Omnichannel Integration", "Loss Prevention"],
  },
  education: {
    name: "State University System",
    industry: "education",
    description: "Large university campus with research facilities, student housing, and administrative buildings",
    userCount: 25000,
    siteCount: 6,
    budget: 1800000,
    timeline: "8 months",
    compliance: ["FERPA", "CIPA", "FISMA", "HIPAA"],
    specialties: ["Student Privacy", "Research Security", "BYOD Management", "Campus Safety"],
  },
  government: {
    name: "Federal Agency",
    industry: "government",
    description: "Federal government agency with classified and unclassified networks",
    userCount: 2000,
    siteCount: 3,
    budget: 2500000,
    timeline: "12 months",
    compliance: ["FISMA", "NIST 800-53", "FedRAMP", "CJIS"],
    specialties: ["Classified Security", "FISMA Compliance", "Continuous Monitoring", "Insider Threat"],
  },
}

export default function DemoDataModal({ isOpen, onClose }: DemoDataModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleGenerateData = async (scenarioKey: string) => {
    setSelectedScenario(scenarioKey)
    setIsGenerating(true)
    setGenerationProgress(0)
    setIsComplete(false)
    setHasError(false)
    setErrorMessage("")

    const steps = [
      { step: "Initializing scenario configuration...", progress: 10 },
      { step: "Generating comprehensive site data...", progress: 25 },
      { step: "Creating realistic user profiles...", progress: 40 },
      { step: "Building detailed event timeline...", progress: 60 },
      { step: "Configuring security policies...", progress: 80 },
      { step: "Finalizing demo environment...", progress: 100 },
    ]

    try {
      for (const { step, progress } of steps) {
        setGenerationStep(step)
        setGenerationProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      // Generate and save demo data
      await storage.generateDemoData()

      setIsComplete(true)

      toast({
        title: "Demo Data Generated Successfully!",
        description: `Created comprehensive ${INDUSTRY_SCENARIOS[scenarioKey as keyof typeof INDUSTRY_SCENARIOS].name} environment with sites, users, events, and policies.`,
      })

      // Show completion for 2 seconds then close and refresh
      setTimeout(() => {
        setIsGenerating(false)
        setIsComplete(false)
        onClose()
        // Trigger a custom event to refresh the parent components
        window.dispatchEvent(new CustomEvent("demoDataLoaded"))
      }, 2000)
    } catch (error) {
      console.error("Error generating demo data:", error)
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      setIsGenerating(false)
      setIsComplete(false)

      toast({
        title: "Error Generating Demo Data",
        description: "Failed to generate demo data. Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const getScenarioIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "technology":
        return "💻"
      case "healthcare":
        return "🏥"
      case "education":
        return "🎓"
      case "financial services":
        return "🏦"
      case "manufacturing":
        return "🏭"
      case "retail":
        return "🛍️"
      case "government":
        return "🏛️"
      default:
        return "🏢"
    }
  }

  if (isGenerating || isComplete || hasError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : hasError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {isComplete ? "Generation Complete!" : hasError ? "Generation Failed" : "Generating Demo Data"}
            </DialogTitle>
            <DialogDescription>
              {isComplete
                ? "Your comprehensive demo environment is ready. Redirecting..."
                : hasError
                  ? "An error occurred while generating the demo data."
                  : "Creating a comprehensive demo environment with realistic industry-specific data..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!hasError && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{generationStep}</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            {hasError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Error Details:</p>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-transparent"
                  onClick={() => {
                    setHasError(false)
                    setIsGenerating(false)
                    setSelectedScenario(null)
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}

            {selectedScenario && !hasError && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">
                      {getScenarioIcon(
                        INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].industry,
                      )}
                    </span>
                    {INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>
                        {INDUSTRY_SCENARIOS[
                          selectedScenario as keyof typeof INDUSTRY_SCENARIOS
                        ].userCount.toLocaleString()}{" "}
                        Users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-green-500" />
                      <span>
                        {INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].siteCount} Sites
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span>
                        $
                        {(
                          INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].budget / 1000000
                        ).toFixed(1)}
                        M Budget
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>{INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].timeline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Comprehensive Demo Data</DialogTitle>
          <DialogDescription>
            Choose an industry scenario to generate comprehensive demo data with realistic users, sites, events, and
            policies. Each scenario includes industry-specific configurations, compliance requirements, and detailed
            infrastructure.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(INDUSTRY_SCENARIOS).map(([key, scenario]) => (
            <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{getScenarioIcon(scenario.industry)}</span>
                  {scenario.name}
                </CardTitle>
                <CardDescription className="text-sm">{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{scenario.userCount.toLocaleString()} Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span>{scenario.siteCount} Sites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span>${(scenario.budget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span>{scenario.timeline}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Compliance:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scenario.compliance.map((comp) => (
                      <Badge key={comp} variant="secondary" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Key Features:</span>
                  <div className="flex flex-wrap gap-1">
                    {scenario.specialties.slice(0, 2).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {scenario.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{scenario.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button onClick={() => handleGenerateData(key)} className="w-full" size="sm">
                  Generate {scenario.industry} Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
