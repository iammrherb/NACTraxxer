"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Building2, Users, Shield, DollarSign, Clock, CheckCircle } from "lucide-react"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

interface DemoDataModalProps {
  isOpen: boolean
  onClose: () => void
}

const INDUSTRY_SCENARIOS = {
  healthcare: {
    name: "Healthcare Deployment",
    industry: "healthcare",
    description: "Comprehensive demo data for a healthcare environment with realistic users, sites, and policies.",
    userCount: 2500,
    siteCount: 5,
    budget: 1500000,
    timeline: "6 months",
    compliance: ["HIPAA", "HITRUST"],
    specialties: ["Medical Device Security", "Patient Data Protection", "Compliance Automation"],
  },
  financial: {
    name: "Financial Services",
    industry: "financial services",
    description: "Demo data for a financial institution with detailed user profiles and security policies.",
    userCount: 1800,
    siteCount: 3,
    budget: 1200000,
    timeline: "4 months",
    compliance: ["PCI DSS", "SOX"],
    specialties: ["Transaction Security", "Fraud Detection", "Compliance Reporting"],
  },
  manufacturing: {
    name: "Manufacturing OT/IT",
    industry: "manufacturing",
    description: "Demo data for a manufacturing environment with OT/IT convergence and industrial control systems.",
    userCount: 1200,
    siteCount: 2,
    budget: 900000,
    timeline: "5 months",
    compliance: ["IEC 62443", "NIST 800-82"],
    specialties: ["OT Security", "Industrial Control Systems", "Network Segmentation"],
  },
  technology: {
    name: "Technology Startup",
    industry: "technology",
    description: "Demo data for a fast-growing tech startup with cloud-based infrastructure and agile security.",
    userCount: 800,
    siteCount: 1,
    budget: 600000,
    timeline: "3 months",
    compliance: ["SOC 2", "GDPR"],
    specialties: ["Cloud Security", "Agile Development", "Data Privacy"],
  },
  retail: {
    name: "Retail Chain",
    industry: "retail",
    description: "Demo data for a retail chain with point-of-sale systems and customer data protection.",
    userCount: 1500,
    siteCount: 10,
    budget: 1000000,
    timeline: "4 months",
    compliance: ["PCI DSS", "CCPA"],
    specialties: ["POS Security", "Customer Data Protection", "Compliance Automation"],
  },
  education: {
    name: "Education Campus",
    industry: "education",
    description: "Demo data for a university campus with student BYOD and research networks.",
    userCount: 3000,
    siteCount: 4,
    budget: 1800000,
    timeline: "6 months",
    compliance: ["FERPA", "CIPA"],
    specialties: ["BYOD Security", "Research Network", "Compliance Reporting"],
  },
  government: {
    name: "Government Agency",
    industry: "government",
    description: "Demo data for a government agency with classified networks and FISMA compliance.",
    userCount: 1000,
    siteCount: 2,
    budget: 2000000,
    timeline: "8 months",
    compliance: ["FISMA", "NIST 800-53"],
    specialties: ["Classified Security", "Data Protection", "Compliance Automation"],
  },
}

export default function DemoDataModal({ isOpen, onClose }: DemoDataModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const handleGenerateData = async (scenarioKey: string) => {
    setSelectedScenario(scenarioKey)
    setIsGenerating(true)
    setGenerationProgress(0)
    setIsComplete(false)

    const steps = [
      { step: "Initializing scenario...", progress: 10 },
      { step: "Generating user profiles...", progress: 25 },
      { step: "Creating site configurations...", progress: 50 },
      { step: "Building event timeline...", progress: 75 },
      { step: "Setting up policies...", progress: 90 },
      { step: "Finalizing data...", progress: 100 },
    ]

    try {
      for (const { step, progress } of steps) {
        setGenerationStep(step)
        setGenerationProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Generate and save demo data
      await storage.generateDemoData(scenarioKey)

      setIsComplete(true)

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
      setIsGenerating(false)
      setIsComplete(false)
      toast({
        title: "Error",
        description: "Failed to generate demo data. Please try again.",
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
      case "technology startup":
        return "🚀"
      default:
        return "🏢"
    }
  }

  if (isGenerating) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {isComplete ? "Generation Complete!" : "Generating Demo Data"}
            </DialogTitle>
            <DialogDescription>
              {isComplete
                ? "Your demo environment is ready. Redirecting..."
                : "Creating a comprehensive demo environment with realistic data..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{generationStep}</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>

            {selectedScenario && (
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
                        {INDUSTRY_SCENARIOS[selectedScenario as keyof typeof INDUSTRY_SCENARIOS].userCount} Users
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
          <DialogTitle>Load Demo Data</DialogTitle>
          <DialogDescription>
            Choose an industry scenario to generate comprehensive demo data with realistic users, sites, events, and
            policies.
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
                    <span>{scenario.userCount} Users</span>
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
