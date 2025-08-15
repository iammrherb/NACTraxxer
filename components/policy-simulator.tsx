"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Network,
  Database,
  Router,
  Activity,
} from "lucide-react"

interface PolicySimulatorProps {
  config: any
  simulationMode: string
  onModeChange: (mode: string) => void
}

export default function PolicySimulator({ config, simulationMode, onModeChange }: PolicySimulatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentScenario, setCurrentScenario] = useState("normal-operation")
  const [simulationSpeed, setSimulationSpeed] = useState([1])
  const [userCount, setUserCount] = useState([1000])
  const [deviceCount, setDeviceCount] = useState([5000])
  const [threatLevel, setThreatLevel] = useState("low")
  const [complianceRate, setComplianceRate] = useState(95)
  const [authSuccessRate, setAuthSuccessRate] = useState(98)
  const [networkLoad, setNetworkLoad] = useState(45)

  const simulationScenarios = [
    {
      id: "normal-operation",
      name: "Normal Operation",
      description: "Standard business operations with typical user activity",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      id: "security-incident",
      name: "Security Incident",
      description: "Simulated security breach with threat response",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-red-500",
    },
    {
      id: "mass-onboarding",
      name: "Mass Device Onboarding",
      description: "Large-scale device enrollment scenario",
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit",
      description: "Regulatory compliance validation testing",
      icon: <Shield className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    {
      id: "network-congestion",
      name: "Network Congestion",
      description: "High traffic load and bandwidth constraints",
      icon: <Network className="h-4 w-4" />,
      color: "bg-orange-500",
    },
    {
      id: "iot-surge",
      name: "IoT Device Surge",
      description: "Massive IoT device connection scenario",
      icon: <Router className="h-4 w-4" />,
      color: "bg-cyan-500",
    },
  ]

  const policyRules = [
    {
      id: "device-compliance",
      name: "Device Compliance Policy",
      description: "Enforce device security standards",
      enabled: true,
      priority: 1,
      conditions: ["OS Version", "Encryption", "Antivirus"],
      actions: ["Allow", "Quarantine", "Block"],
    },
    {
      id: "user-authentication",
      name: "User Authentication Policy",
      description: "Multi-factor authentication requirements",
      enabled: true,
      priority: 2,
      conditions: ["User Role", "Location", "Risk Score"],
      actions: ["MFA Required", "Certificate Auth", "Block"],
    },
    {
      id: "network-segmentation",
      name: "Network Segmentation Policy",
      description: "Dynamic VLAN assignment based on device type",
      enabled: true,
      priority: 3,
      conditions: ["Device Type", "Compliance Status", "User Group"],
      actions: ["VLAN Assignment", "Bandwidth Limit", "Access Control"],
    },
    {
      id: "guest-access",
      name: "Guest Access Policy",
      description: "Temporary access for visitors",
      enabled: false,
      priority: 4,
      conditions: ["Time Limit", "Sponsor Approval", "Terms Acceptance"],
      actions: ["Limited Access", "Internet Only", "Time Expiry"],
    },
  ]

  const simulationMetrics = {
    "normal-operation": {
      authSuccessRate: 98,
      complianceRate: 95,
      networkLoad: 45,
      threatLevel: "low",
      incidentCount: 2,
      responseTime: "150ms",
    },
    "security-incident": {
      authSuccessRate: 85,
      complianceRate: 92,
      networkLoad: 75,
      threatLevel: "high",
      incidentCount: 15,
      responseTime: "300ms",
    },
    "mass-onboarding": {
      authSuccessRate: 94,
      complianceRate: 88,
      networkLoad: 85,
      threatLevel: "medium",
      incidentCount: 8,
      responseTime: "450ms",
    },
    "compliance-audit": {
      authSuccessRate: 99,
      complianceRate: 99,
      networkLoad: 35,
      threatLevel: "low",
      incidentCount: 1,
      responseTime: "120ms",
    },
    "network-congestion": {
      authSuccessRate: 89,
      complianceRate: 93,
      networkLoad: 95,
      threatLevel: "medium",
      incidentCount: 12,
      responseTime: "800ms",
    },
    "iot-surge": {
      authSuccessRate: 91,
      complianceRate: 85,
      networkLoad: 78,
      threatLevel: "medium",
      incidentCount: 25,
      responseTime: "600ms",
    },
  }

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const metrics = simulationMetrics[currentScenario as keyof typeof simulationMetrics]
        if (metrics) {
          setAuthSuccessRate(metrics.authSuccessRate + Math.random() * 4 - 2)
          setComplianceRate(metrics.complianceRate + Math.random() * 3 - 1.5)
          setNetworkLoad(metrics.networkLoad + Math.random() * 10 - 5)
        }
      }, 1000 / simulationSpeed[0])

      return () => clearInterval(interval)
    }
  }, [isRunning, currentScenario, simulationSpeed])

  const startSimulation = () => {
    setIsRunning(true)
    toast({
      title: "Simulation Started",
      description: `Running ${simulationScenarios.find((s) => s.id === currentScenario)?.name} scenario`,
    })
  }

  const stopSimulation = () => {
    setIsRunning(false)
    toast({
      title: "Simulation Stopped",
      description: "Policy simulation has been paused",
    })
  }

  const resetSimulation = () => {
    setIsRunning(false)
    const metrics = simulationMetrics[currentScenario as keyof typeof simulationMetrics]
    if (metrics) {
      setAuthSuccessRate(metrics.authSuccessRate)
      setComplianceRate(metrics.complianceRate)
      setNetworkLoad(metrics.networkLoad)
    }
    toast({
      title: "Simulation Reset",
      description: "All metrics have been reset to baseline values",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-blue-600" />
                <span>Policy Simulator</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Test and validate NAC policies under various network conditions and scenarios
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={isRunning ? "bg-green-50 text-green-700" : "bg-gray-50"}>
                {isRunning ? "Running" : "Stopped"}
              </Badge>
              <Badge
                variant="outline"
                className={`${simulationScenarios.find((s) => s.id === currentScenario)?.color} text-white`}
              >
                {simulationScenarios.find((s) => s.id === currentScenario)?.name}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="policies">Policy Rules</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Simulation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Simulation Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Scenario</Label>
                  <Select value={currentScenario} onValueChange={setCurrentScenario}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {simulationScenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          <div className="flex items-center space-x-2">
                            {scenario.icon}
                            <span>{scenario.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Speed: {simulationSpeed[0]}x</Label>
                  <Slider
                    value={simulationSpeed}
                    onValueChange={setSimulationSpeed}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Users: {userCount[0].toLocaleString()}</Label>
                  <Slider
                    value={userCount}
                    onValueChange={setUserCount}
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Devices: {deviceCount[0].toLocaleString()}</Label>
                  <Slider
                    value={deviceCount}
                    onValueChange={setDeviceCount}
                    max={50000}
                    min={500}
                    step={500}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={isRunning ? stopSimulation : startSimulation}
                    className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isRunning ? "Stop" : "Start"} Simulation
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  {simulationScenarios.find((s) => s.id === currentScenario)?.description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Available Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simulationScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentScenario === scenario.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setCurrentScenario(scenario.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${scenario.color} text-white`}>{scenario.icon}</div>
                        <div>
                          <h3 className="font-medium text-sm">{scenario.name}</h3>
                          <p className="text-xs text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Rules Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Switch checked={rule.enabled} />
                          <div>
                            <h3 className="font-medium">{rule.name}</h3>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Priority {rule.priority}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Conditions:</strong>
                          <ul className="mt-1 space-y-1">
                            {rule.conditions.map((condition, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>{condition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Actions:</strong>
                          <ul className="mt-1 space-y-1">
                            {rule.actions.map((action, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Authentication Success</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{authSuccessRate.toFixed(1)}%</div>
                <Progress value={authSuccessRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compliance Rate</span>
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
                <Progress value={complianceRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Network Load</span>
                  <Network className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">{networkLoad.toFixed(0)}%</div>
                <Progress value={networkLoad} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">
                  {simulationMetrics[currentScenario as keyof typeof simulationMetrics]?.responseTime}
                </div>
                <div className="text-xs text-muted-foreground mt-2">Average response time</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isRunning && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">User authenticated successfully</div>
                        <div className="text-sm text-muted-foreground">john.doe@company.com via certificate</div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-auto">2s ago</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Network className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Device compliance verified</div>
                        <div className="text-sm text-muted-foreground">Windows laptop - encryption enabled</div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-auto">5s ago</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium">Policy violation detected</div>
                        <div className="text-sm text-muted-foreground">Unauthorized device blocked</div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-auto">8s ago</div>
                    </div>
                  </>
                )}
                {!isRunning && (
                  <div className="text-center text-muted-foreground py-8">
                    Start simulation to see real-time activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Simulation reports will be generated after running scenarios</p>
                <Button className="mt-4" onClick={startSimulation}>
                  Start Simulation to Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
