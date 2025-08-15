"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  GraduationCap,
  Heart,
  Shield,
  Factory,
  ShoppingCart,
  Laptop,
  Users,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

interface DemoDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDataLoaded: () => void
}

const scenarios = [
  {
    id: "corporate" as const,
    name: "Corporate Enterprise",
    description: "Large multinational corporation with multiple offices and complex infrastructure",
    icon: Building2,
    color: "bg-blue-500",
    stats: {
      sites: 12,
      users: 25,
      policies: 15,
      events: 10,
    },
    features: [
      "Global office locations",
      "Mixed device environment",
      "Complex network topology",
      "Compliance requirements",
    ],
  },
  {
    id: "education" as const,
    name: "Higher Education",
    description: "University system with campus-wide deployment and student BYOD policies",
    icon: GraduationCap,
    color: "bg-green-500",
    stats: {
      sites: 8,
      users: 30,
      policies: 20,
      events: 12,
    },
    features: ["Campus-wide coverage", "Student BYOD support", "Research network isolation", "High-density wireless"],
  },
  {
    id: "healthcare" as const,
    name: "Healthcare System",
    description: "Medical facilities with strict compliance and medical device integration",
    icon: Heart,
    color: "bg-red-500",
    stats: {
      sites: 6,
      users: 20,
      policies: 25,
      events: 8,
    },
    features: ["HIPAA compliance", "Medical device support", "Critical system priority", "Patient data protection"],
  },
  {
    id: "government" as const,
    name: "Government Agency",
    description: "Federal agency with high security requirements and compliance standards",
    icon: Shield,
    color: "bg-purple-500",
    stats: {
      sites: 10,
      users: 15,
      policies: 30,
      events: 6,
    },
    features: ["FISMA compliance", "High security clearance", "Strict access controls", "Audit requirements"],
  },
  {
    id: "manufacturing" as const,
    name: "Manufacturing",
    description: "Industrial facilities with OT/IT convergence and production systems",
    icon: Factory,
    color: "bg-orange-500",
    stats: {
      sites: 15,
      users: 18,
      policies: 18,
      events: 14,
    },
    features: ["OT/IT network segmentation", "Industrial protocols", "Production system priority", "Safety compliance"],
  },
  {
    id: "retail" as const,
    name: "Retail Chain",
    description: "Multi-location retail with POS systems and guest WiFi requirements",
    icon: ShoppingCart,
    color: "bg-pink-500",
    stats: {
      sites: 25,
      users: 22,
      policies: 12,
      events: 18,
    },
    features: ["POS system security", "Guest WiFi management", "Multi-location deployment", "Seasonal scalability"],
  },
]

export default function DemoDataModal({ open, onOpenChange, onDataLoaded }: DemoDataModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadDemoData = async (scenarioId: (typeof scenarios)[0]["id"]) => {
    setIsLoading(true)
    setSelectedScenario(scenarioId)

    try {
      await storage.generateDemoData(scenarioId)

      toast({
        title: "Demo data loaded successfully",
        description: `${scenarios.find((s) => s.id === scenarioId)?.name} scenario has been loaded.`,
      })

      onDataLoaded()
      onOpenChange(false)
    } catch (error) {
      console.error("Error loading demo data:", error)
      toast({
        title: "Error loading demo data",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedScenario(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Laptop className="h-5 w-5" />
            <span>Load Demo Data</span>
          </DialogTitle>
          <DialogDescription>
            Choose a scenario to populate the application with realistic demo data. This will replace any existing data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon
            const isLoadingThis = isLoading && selectedScenario === scenario.id

            return (
              <Card key={scenario.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-1 ${scenario.color}`} />

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${scenario.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{scenario.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{scenario.stats.sites} Sites</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span>{scenario.stats.users} Users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 text-gray-500" />
                      <span>{scenario.stats.policies} Policies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span>{scenario.stats.events} Events</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {scenario.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Load Button */}
                  <Button
                    onClick={() => handleLoadDemoData(scenario.id)}
                    disabled={isLoading}
                    className="w-full"
                    variant={selectedScenario === scenario.id ? "default" : "outline"}
                  >
                    {isLoadingThis ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load This Scenario"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Warning:</strong> Loading demo data will replace all existing sites, users, policies, and events.
              Make sure to export your current data if you want to keep it.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
