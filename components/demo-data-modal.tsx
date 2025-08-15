"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { storage } from "@/lib/storage"
import {
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  Loader2,
  Database,
  Settings,
  Banknote,
  Factory,
  Smartphone,
  ShoppingBag,
} from "lucide-react"

interface DemoDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDataLoaded?: () => void
}

export default function DemoDataModal({ open, onOpenChange, onDataLoaded }: DemoDataModalProps) {
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [progress, setProgress] = useState(0)
  const [selectedScenario, setSelectedScenario] = useState<
    "corporate" | "education" | "healthcare" | "financial" | "manufacturing" | "retail" | "technology" | null
  >(null)

  const scenarios = [
    {
      id: "corporate" as const,
      title: "GlobalTech Industries",
      subtitle: "Multi-National Corporation",
      description: "Enterprise deployment across 12 global offices with 8,750 users and 15,200 devices",
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      stats: {
        sites: 12,
        users: 8750,
        devices: 15200,
        policies: 8,
        events: 15,
      },
      features: [
        "Executive VIP policies",
        "Multi-site RADIUS deployment",
        "Global policy management",
        "BYOD quarantine workflows",
        "Cisco/Aruba infrastructure",
      ],
    },
    {
      id: "financial" as const,
      title: "SecureBank Financial Group",
      subtitle: "Banking & Financial Services",
      description: "Financial services deployment across 18 branches with 3,200 employees and 8,950 devices",
      icon: <Banknote className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 border-green-200",
      stats: {
        sites: 18,
        users: 3200,
        devices: 8950,
        policies: 12,
        events: 22,
      },
      features: [
        "PCI-DSS compliance policies",
        "Trading floor network isolation",
        "High-security certificate auth",
        "Regulatory audit trails",
        "Zero-trust architecture",
      ],
    },
    {
      id: "healthcare" as const,
      title: "Metropolitan Health Network",
      subtitle: "Healthcare Organization",
      description: "Clinical deployment across 8 facilities with 2,850 staff and 6,200 medical devices",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      color: "bg-red-50 border-red-200",
      stats: {
        sites: 8,
        users: 2850,
        devices: 6200,
        policies: 6,
        events: 12,
      },
      features: [
        "Medical device prioritization",
        "HIPAA compliance policies",
        "Critical care zero-latency",
        "Patient guest networks",
        "Clinical workflow integration",
      ],
    },
    {
      id: "education" as const,
      title: "Riverside University System",
      subtitle: "Higher Education Institution",
      description: "Campus-wide deployment across 6 locations with 28,600 students and 52,400 devices",
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      stats: {
        sites: 6,
        users: 28600,
        devices: 52400,
        policies: 5,
        events: 9,
      },
      features: [
        "Student BYOD management",
        "Faculty research networks",
        "Dormitory high-density WiFi",
        "Guest access for events",
        "FERPA compliance policies",
      ],
    },
    {
      id: "manufacturing" as const,
      title: "Advanced Manufacturing Corp",
      subtitle: "Industrial & Manufacturing",
      description: "Industrial deployment across 14 facilities with 4,200 workers and 18,500 IoT devices",
      icon: <Factory className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
      stats: {
        sites: 14,
        users: 4200,
        devices: 18500,
        policies: 10,
        events: 18,
      },
      features: [
        "Industrial IoT segmentation",
        "OT/IT network isolation",
        "Machine-to-machine auth",
        "Safety system prioritization",
        "Predictive maintenance",
      ],
    },
    {
      id: "technology" as const,
      title: "InnovateTech Solutions",
      subtitle: "Technology Company",
      description: "Tech company deployment across 9 offices with 6,400 employees and 12,800 devices",
      icon: <Smartphone className="h-8 w-8 text-cyan-600" />,
      color: "bg-cyan-50 border-cyan-200",
      stats: {
        sites: 9,
        users: 6400,
        devices: 12800,
        policies: 7,
        events: 14,
      },
      features: [
        "Developer environment isolation",
        "Cloud-first architecture",
        "Container network policies",
        "Remote worker support",
        "DevOps integration",
      ],
    },
    {
      id: "retail" as const,
      title: "Premium Retail Chain",
      subtitle: "Retail & Hospitality",
      description: "Retail deployment across 25 stores with 1,850 staff and 4,200 POS/IoT devices",
      icon: <ShoppingBag className="h-8 w-8 text-pink-600" />,
      color: "bg-pink-50 border-pink-200",
      stats: {
        sites: 25,
        users: 1850,
        devices: 4200,
        policies: 4,
        events: 8,
      },
      features: [
        "Point-of-sale security",
        "Customer guest WiFi",
        "Inventory system protection",
        "Seasonal traffic handling",
        "Multi-location management",
      ],
    },
  ]

  const loadingSteps = [
    "Initializing demo environment...",
    "Creating user accounts and roles...",
    "Setting up site configurations...",
    "Deploying network infrastructure...",
    "Configuring global policies...",
    "Scheduling deployment events...",
    "Applying device configurations...",
    "Generating compliance reports...",
    "Finalizing security settings...",
    "Demo data loaded successfully!",
  ]

  const handleLoadDemoData = async (
    scenario: "corporate" | "education" | "healthcare" | "financial" | "manufacturing" | "retail" | "technology",
  ) => {
    setLoading(true)
    setProgress(0)
    setSelectedScenario(scenario)

    try {
      for (let i = 0; i < loadingSteps.length; i++) {
        setLoadingStep(loadingSteps[i])
        setProgress((i / (loadingSteps.length - 1)) * 100)

        // Simulate realistic loading time for each step
        await new Promise((resolve) => setTimeout(resolve, i === loadingSteps.length - 1 ? 500 : 900))

        // Actually load the data on the last step
        if (i === loadingSteps.length - 2) {
          console.log("[v0] Loading demo data for scenario:", scenario)
          await storage.generateDemoData(scenario)
          window.dispatchEvent(new CustomEvent("demoDataLoaded", { detail: { scenario } }))
        }
      }

      toast({
        title: "Demo Data Loaded",
        description: `${scenarios.find((s) => s.id === scenario)?.title} scenario has been loaded successfully.`,
      })

      // Close modal and refresh data
      setTimeout(() => {
        onDataLoaded?.()
        onOpenChange(false)
        setLoading(false)
        setSelectedScenario(null)
        setProgress(0)
        setLoadingStep("")

        // Force a page refresh to ensure all components reload with new data
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error loading demo data:", error)
      toast({
        title: "Error",
        description: "Failed to load demo data. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
      setSelectedScenario(null)
      setProgress(0)
      setLoadingStep("")
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all existing data? This action cannot be undone.")) {
      return
    }

    try {
      setLoading(true)
      setLoadingStep("Clearing existing data...")
      setProgress(50)

      console.log("[v0] Clearing all data")
      await storage.clearAllData()
      window.dispatchEvent(new CustomEvent("demoDataLoaded", { detail: { scenario: "cleared" } }))

      setLoadingStep("Data cleared successfully!")
      setProgress(100)

      toast({
        title: "Data Cleared",
        description: "All existing data has been cleared successfully.",
      })

      setTimeout(() => {
        onDataLoaded?.()
        onOpenChange(false)
        setLoading(false)
        setProgress(0)
        setLoadingStep("")

        // Force a page refresh to ensure all components reload with new data
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error clearing data:", error)
      toast({
        title: "Error",
        description: "Failed to clear data. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
      setProgress(0)
      setLoadingStep("")
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <span>Loading Demo Data</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {selectedScenario && (
              <div className="text-center">
                <div className="flex justify-center mb-4">{scenarios.find((s) => s.id === selectedScenario)?.icon}</div>
                <h3 className="text-lg font-semibold mb-2">
                  {scenarios.find((s) => s.id === selectedScenario)?.title}
                </h3>
                <p className="text-gray-600">{scenarios.find((s) => s.id === selectedScenario)?.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{loadingStep}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Please wait while we set up your demo environment...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <span>Industry Demo Data Scenarios</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Choose an industry-specific demo scenario to populate the application with realistic data including users,
              sites, policies, and deployment timelines.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Complete user profiles</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Multi-site configurations</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Deployment timelines</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-orange-600" />
                <span>Security policies</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className={`cursor-pointer transition-all hover:shadow-lg ${scenario.color}`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">{scenario.icon}</div>
                  <CardTitle className="text-xl">{scenario.title}</CardTitle>
                  <p className="text-sm text-gray-600 font-medium">{scenario.subtitle}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{scenario.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sites:</span>
                      <Badge variant="outline">{scenario.stats.sites}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Users:</span>
                      <Badge variant="outline">{scenario.stats.users.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Devices:</span>
                      <Badge variant="outline">{scenario.stats.devices.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Events:</span>
                      <Badge variant="outline">{scenario.stats.events}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <ul className="text-xs space-y-1">
                      {scenario.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full mt-4" onClick={() => handleLoadDemoData(scenario.id)}>
                    Load {scenario.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Settings className="h-6 w-6 text-gray-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Data Management</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clear all existing data to start fresh, or load demo data to replace current configuration. All data
                  is stored locally in your browser.
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleClearData}>
                    Clear All Data
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
