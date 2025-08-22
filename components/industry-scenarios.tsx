"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Heart,
  Banknote,
  Cpu,
  Factory,
  Shield,
  Users,
  Network,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface IndustryScenariosProps {
  selectedIndustry: string
  onIndustryChange: (industry: string) => void
}

export default function IndustryScenarios({ selectedIndustry, onIndustryChange }: IndustryScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState("overview")

  const industries = [
    {
      id: "multi-site-campus",
      name: "Multi-Site Campus",
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-blue-500",
      description: "Global enterprise with multiple campuses and remote locations",
      challenges: [
        "Consistent security policies across sites",
        "WAN connectivity and bandwidth optimization",
        "Centralized management with local autonomy",
        "Cross-site collaboration and resource sharing",
      ],
      solutions: [
        "SD-WAN with integrated security",
        "Cloud-managed NAC deployment",
        "Centralized policy with local enforcement",
        "Zero trust network segmentation",
      ],
      metrics: {
        sites: 25,
        users: 15000,
        devices: 45000,
        compliance: 98,
      },
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-red-500",
      description: "Hospital networks with strict HIPAA compliance requirements",
      challenges: [
        "HIPAA compliance and patient data protection",
        "Medical device security and IoT management",
        "Guest access for patients and visitors",
        "Emergency access procedures",
      ],
      solutions: [
        "Role-based access control for medical staff",
        "Medical device profiling and segmentation",
        "Secure guest portal with time-limited access",
        "Emergency override with audit trails",
      ],
      metrics: {
        sites: 12,
        users: 8500,
        devices: 25000,
        compliance: 99.5,
      },
    },
    {
      id: "financial",
      name: "Financial Services",
      icon: <Banknote className="h-6 w-6" />,
      color: "bg-green-500",
      description: "Banking and financial institutions with regulatory compliance",
      challenges: [
        "PCI DSS and SOX compliance",
        "Trading floor high-frequency access",
        "Customer data protection",
        "Fraud prevention and detection",
      ],
      solutions: [
        "Multi-factor authentication with risk scoring",
        "Network segmentation for trading systems",
        "Data loss prevention integration",
        "Real-time threat detection and response",
      ],
      metrics: {
        sites: 150,
        users: 25000,
        devices: 75000,
        compliance: 99.9,
      },
    },
    {
      id: "technology",
      name: "Technology",
      icon: <Cpu className="h-6 w-6" />,
      color: "bg-purple-500",
      description: "Tech companies with focus on intellectual property protection",
      challenges: [
        "Intellectual property protection",
        "DevOps and CI/CD security",
        "Remote developer access",
        "Cloud-native application security",
      ],
      solutions: [
        "Zero trust architecture for development",
        "API security and micro-segmentation",
        "Secure remote access for developers",
        "Container and Kubernetes security",
      ],
      metrics: {
        sites: 8,
        users: 5000,
        devices: 15000,
        compliance: 97,
      },
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      icon: <Factory className="h-6 w-6" />,
      color: "bg-orange-500",
      description: "Industrial networks with OT/IT convergence",
      challenges: [
        "OT/IT network convergence",
        "Industrial IoT device management",
        "Supply chain security",
        "Production system availability",
      ],
      solutions: [
        "Industrial network segmentation",
        "OT device discovery and profiling",
        "Secure remote maintenance access",
        "Production network monitoring",
      ],
      metrics: {
        sites: 35,
        users: 12000,
        devices: 85000,
        compliance: 96,
      },
    },
  ]

  const currentIndustry = industries.find((i) => i.id === selectedIndustry) || industries[0]

  const scenarioDetails = {
    overview: {
      title: "Industry Overview",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{currentIndustry.metrics.sites}</p>
                    <p className="text-sm text-muted-foreground">Sites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{currentIndustry.metrics.users.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{currentIndustry.metrics.devices.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{currentIndustry.metrics.compliance}%</p>
                    <p className="text-sm text-muted-foreground">Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Key Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentIndustry.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>NAC Solutions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentIndustry.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    architecture: {
      title: "Reference Architecture",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry-Specific Architecture Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
                <div className="text-center text-gray-500">
                  <Network className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Architecture Diagram</p>
                  <p className="text-sm">
                    Detailed {currentIndustry.name} network architecture with Portnox NAC integration
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    deployment: {
      title: "Deployment Guide",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phased Deployment Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Phase 1: Assessment & Planning</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Complete
                  </Badge>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Phase 2: Core Infrastructure</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    In Progress
                  </Badge>
                </div>
                <Progress value={75} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Phase 3: Policy Implementation</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
                <Progress value={25} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Phase 4: Full Rollout</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    compliance: {
      title: "Compliance Framework",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedIndustry === "healthcare" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>HIPAA Compliance</span>
                        <Badge className="bg-green-500">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>HITECH Act</span>
                        <Badge className="bg-green-500">Compliant</Badge>
                      </div>
                    </>
                  )}
                  {selectedIndustry === "financial" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>PCI DSS</span>
                        <Badge className="bg-green-500">Level 1</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SOX Compliance</span>
                        <Badge className="bg-green-500">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GDPR</span>
                        <Badge className="bg-green-500">Compliant</Badge>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span>ISO 27001</span>
                    <Badge className="bg-green-500">Certified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Real-time logging enabled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span className="text-sm">7-year retention policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Tamper-proof storage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  }

  return (
    <div className="space-y-6">
      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Scenarios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select an industry to view specific NAC architecture scenarios and compliance requirements
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <Card
                key={industry.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedIndustry === industry.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => onIndustryChange(industry.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${industry.color} text-white`}>{industry.icon}</div>
                    <div>
                      <h3 className="font-medium">{industry.name}</h3>
                      <p className="text-xs text-muted-foreground">{industry.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${currentIndustry.color} text-white`}>{currentIndustry.icon}</div>
            <div>
              <CardTitle>{currentIndustry.name} Scenarios</CardTitle>
              <p className="text-sm text-muted-foreground">{currentIndustry.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {scenarioDetails.overview.content}
            </TabsContent>

            <TabsContent value="architecture" className="mt-6">
              {scenarioDetails.architecture.content}
            </TabsContent>

            <TabsContent value="deployment" className="mt-6">
              {scenarioDetails.deployment.content}
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              {scenarioDetails.compliance.content}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
