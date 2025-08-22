"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Target,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Laptop,
  Smartphone,
  Router,
  Lock,
  TrendingUp,
  BarChart3,
  PieChart,
  Network,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SimulationDevice {
  id: string
  name: string
  type: "laptop" | "smartphone" | "tablet" | "iot_device" | "server" | "printer"
  os: string
  userGroup: string
  location: string
  riskScore: number
  complianceStatus: "compliant" | "non_compliant" | "unknown"
  certificates: string[]
  installedApps: string[]
  networkSegment: string
  ipAddress: string
  macAddress: string
  lastSeen: string
  agentInstalled: boolean
  agentVersion?: string
}

interface PolicyRule {
  id: string
  name: string
  description: string
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  priority: number
  enabled: boolean
  category: string
}

interface PolicyCondition {
  type: string
  operator: string
  value: any
  description: string
}

interface PolicyAction {
  type: string
  parameters: Record<string, any>
  description: string
}

interface SimulationResult {
  deviceId: string
  policyId: string
  policyName: string
  matched: boolean
  action: string
  reason: string
  confidence: number
  executionTime: number
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendation: string
}

interface SimulationScenario {
  id: string
  name: string
  description: string
  devices: SimulationDevice[]
  networkConditions: {
    timeOfDay: string
    networkLoad: number
    threatLevel: string
    maintenanceMode: boolean
  }
  expectedOutcomes: Record<string, string>
}

export default function VisualPolicySimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
  const [activeTab, setActiveTab] = useState("scenarios")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [realTimeMode, setRealTimeMode] = useState(false)
  const [agentMode, setAgentMode] = useState<"agent" | "agentless">("agentless")
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [simulationMetrics, setSimulationMetrics] = useState({
    totalDevices: 0,
    policiesEvaluated: 0,
    averageResponseTime: 0,
    successRate: 0,
    blockedDevices: 0,
    allowedDevices: 0,
    quarantinedDevices: 0,
  })

  const predefinedScenarios: SimulationScenario[] = [
    {
      id: "healthcare-morning-rush",
      name: "Healthcare Morning Rush",
      description: "Simulate morning shift change with high device authentication volume",
      devices: [
        {
          id: "nurse-laptop-1",
          name: "Nurse Station Laptop",
          type: "laptop",
          os: "Windows 11",
          userGroup: "nurses",
          location: "ICU Floor 3",
          riskScore: 15,
          complianceStatus: "compliant",
          certificates: ["Device Certificate", "User Certificate"],
          installedApps: ["Epic EMR", "Microsoft Teams", "Antivirus"],
          networkSegment: "medical-devices",
          ipAddress: "10.1.100.45",
          macAddress: "00:1B:44:11:3A:B7",
          lastSeen: "2024-01-15T07:30:00Z",
          agentInstalled: true,
          agentVersion: "v2.1.3",
        },
        {
          id: "doctor-phone-1",
          name: "Doctor iPhone",
          type: "smartphone",
          os: "iOS 17.2",
          userGroup: "physicians",
          location: "Emergency Department",
          riskScore: 25,
          complianceStatus: "compliant",
          certificates: ["MDM Certificate"],
          installedApps: ["Epic Haiku", "Secure Messaging", "Medical Calculator"],
          networkSegment: "byod-medical",
          ipAddress: "10.2.50.123",
          macAddress: "A4:83:E7:2B:45:C1",
          lastSeen: "2024-01-15T07:45:00Z",
          agentInstalled: false,
        },
        {
          id: "patient-tablet-1",
          name: "Patient Entertainment Tablet",
          type: "tablet",
          os: "Android 12",
          userGroup: "patients",
          location: "Room 301",
          riskScore: 60,
          complianceStatus: "non_compliant",
          certificates: [],
          installedApps: ["Netflix", "Games", "Unknown Apps"],
          networkSegment: "guest-network",
          ipAddress: "10.3.200.78",
          macAddress: "B8:27:EB:45:67:89",
          lastSeen: "2024-01-15T07:20:00Z",
          agentInstalled: false,
        },
        {
          id: "medical-device-1",
          name: "Patient Monitor",
          type: "iot_device",
          os: "Embedded Linux",
          userGroup: "medical-devices",
          location: "ICU Room 305",
          riskScore: 35,
          complianceStatus: "compliant",
          certificates: ["Device Certificate"],
          installedApps: [],
          networkSegment: "medical-iot",
          ipAddress: "10.4.10.156",
          macAddress: "00:50:C2:1E:AF:92",
          lastSeen: "2024-01-15T07:50:00Z",
          agentInstalled: false,
        },
      ],
      networkConditions: {
        timeOfDay: "07:00-09:00",
        networkLoad: 85,
        threatLevel: "medium",
        maintenanceMode: false,
      },
      expectedOutcomes: {
        "nurse-laptop-1": "Full access to medical network",
        "doctor-phone-1": "Limited access with MFA required",
        "patient-tablet-1": "Quarantine and redirect to guest portal",
        "medical-device-1": "Isolated medical device network access",
      },
    },
    {
      id: "financial-trading-floor",
      name: "Financial Trading Floor",
      description: "High-security trading environment with strict compliance requirements",
      devices: [
        {
          id: "trader-workstation-1",
          name: "Trading Workstation",
          type: "laptop",
          os: "Windows 11 Enterprise",
          userGroup: "traders",
          location: "Trading Floor",
          riskScore: 10,
          complianceStatus: "compliant",
          certificates: ["Smart Card Certificate", "Device Certificate"],
          installedApps: ["Bloomberg Terminal", "Trading Platform", "Risk Management"],
          networkSegment: "trading-network",
          ipAddress: "10.10.1.45",
          macAddress: "00:1B:44:11:3A:B8",
          lastSeen: "2024-01-15T08:30:00Z",
          agentInstalled: true,
          agentVersion: "v2.2.1",
        },
        {
          id: "contractor-laptop-1",
          name: "External Contractor Laptop",
          type: "laptop",
          os: "Windows 10",
          userGroup: "contractors",
          location: "Conference Room B",
          riskScore: 45,
          complianceStatus: "non_compliant",
          certificates: ["Contractor Certificate"],
          installedApps: ["Office 365", "VPN Client", "Unknown Software"],
          networkSegment: "contractor-network",
          ipAddress: "10.20.5.89",
          macAddress: "AC:DE:48:00:11:22",
          lastSeen: "2024-01-15T08:15:00Z",
          agentInstalled: false,
        },
      ],
      networkConditions: {
        timeOfDay: "08:00-18:00",
        networkLoad: 95,
        threatLevel: "high",
        maintenanceMode: false,
      },
      expectedOutcomes: {
        "trader-workstation-1": "Full trading platform access",
        "contractor-laptop-1": "Deny access - compliance violation",
      },
    },
    {
      id: "iot-manufacturing",
      name: "IoT Manufacturing Floor",
      description: "Industrial IoT devices with operational technology security",
      devices: [
        {
          id: "plc-controller-1",
          name: "PLC Controller",
          type: "iot_device",
          os: "Embedded",
          userGroup: "industrial-devices",
          location: "Production Line A",
          riskScore: 40,
          complianceStatus: "compliant",
          certificates: ["Industrial Certificate"],
          installedApps: [],
          networkSegment: "ot-network",
          ipAddress: "192.168.100.10",
          macAddress: "00:80:F4:12:34:56",
          lastSeen: "2024-01-15T08:45:00Z",
          agentInstalled: false,
        },
        {
          id: "hmi-panel-1",
          name: "HMI Touch Panel",
          type: "iot_device",
          os: "Windows IoT",
          userGroup: "industrial-devices",
          location: "Control Room",
          riskScore: 30,
          complianceStatus: "compliant",
          certificates: ["Device Certificate"],
          installedApps: ["SCADA Client", "Historian"],
          networkSegment: "ot-network",
          ipAddress: "192.168.100.20",
          macAddress: "00:1E:C9:AB:CD:EF",
          lastSeen: "2024-01-15T08:50:00Z",
          agentInstalled: false,
        },
        {
          id: "maintenance-tablet-1",
          name: "Maintenance Tablet",
          type: "tablet",
          os: "Android 11",
          userGroup: "maintenance",
          location: "Production Floor",
          riskScore: 55,
          complianceStatus: "non_compliant",
          certificates: [],
          installedApps: ["Maintenance App", "Games", "Social Media"],
          networkSegment: "maintenance-network",
          ipAddress: "10.50.10.75",
          macAddress: "B8:27:EB:12:34:56",
          lastSeen: "2024-01-15T08:40:00Z",
          agentInstalled: false,
        },
      ],
      networkConditions: {
        timeOfDay: "24/7",
        networkLoad: 70,
        threatLevel: "medium",
        maintenanceMode: false,
      },
      expectedOutcomes: {
        "plc-controller-1": "Isolated OT network access",
        "hmi-panel-1": "Full SCADA network access",
        "maintenance-tablet-1": "Quarantine - security policy violation",
      },
    },
  ]

  const samplePolicies: PolicyRule[] = [
    {
      id: "policy-1",
      name: "Corporate Device Access",
      description: "Allow compliant corporate devices full network access",
      conditions: [
        { type: "device_compliance", operator: "equals", value: "compliant", description: "Device is compliant" },
        {
          type: "user_group",
          operator: "in",
          value: ["employees", "contractors"],
          description: "User is employee or contractor",
        },
        { type: "certificate_present", operator: "equals", value: true, description: "Valid certificate present" },
      ],
      actions: [
        { type: "allow", parameters: { network: "corporate" }, description: "Grant corporate network access" },
        { type: "log", parameters: { level: "info" }, description: "Log successful authentication" },
      ],
      priority: 1,
      enabled: true,
      category: "access_control",
    },
    {
      id: "policy-2",
      name: "High Risk Device Quarantine",
      description: "Quarantine devices with high risk scores",
      conditions: [{ type: "risk_score", operator: "greater_than", value: 70, description: "Risk score above 70" }],
      actions: [
        { type: "quarantine", parameters: { vlan: "quarantine" }, description: "Move to quarantine VLAN" },
        { type: "notify", parameters: { alert: "high_risk_device" }, description: "Send security alert" },
        { type: "require_remediation", parameters: {}, description: "Require device remediation" },
      ],
      priority: 2,
      enabled: true,
      category: "risk_management",
    },
    {
      id: "policy-3",
      name: "Guest Device Internet Only",
      description: "Provide internet-only access for guest devices",
      conditions: [
        { type: "user_group", operator: "equals", value: "guests", description: "User is guest" },
        {
          type: "network_segment",
          operator: "equals",
          value: "guest-network",
          description: "Connected to guest network",
        },
      ],
      actions: [
        { type: "allow", parameters: { network: "internet_only" }, description: "Grant internet-only access" },
        { type: "apply_bandwidth_limit", parameters: { limit: "10Mbps" }, description: "Apply bandwidth limit" },
        { type: "time_limit", parameters: { duration: "8hours" }, description: "Apply time limit" },
      ],
      priority: 3,
      enabled: true,
      category: "guest_access",
    },
    {
      id: "policy-4",
      name: "Medical Device Isolation",
      description: "Isolate medical devices to dedicated network segment",
      conditions: [
        { type: "device_type", operator: "equals", value: "iot_device", description: "Device is IoT device" },
        { type: "user_group", operator: "equals", value: "medical-devices", description: "Medical device group" },
        { type: "location", operator: "contains", value: "ICU", description: "Located in ICU" },
      ],
      actions: [
        { type: "allow", parameters: { network: "medical-iot" }, description: "Grant medical IoT network access" },
        { type: "apply_micro_segmentation", parameters: {}, description: "Apply micro-segmentation" },
        { type: "continuous_monitoring", parameters: {}, description: "Enable continuous monitoring" },
      ],
      priority: 4,
      enabled: true,
      category: "iot_security",
    },
  ]

  const runSimulation = async () => {
    if (!selectedScenario) {
      toast({
        title: "No Scenario Selected",
        description: "Please select a scenario to run the simulation.",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)
    setIsPaused(false)
    setCurrentStep(0)
    setSimulationResults([])
    setTotalSteps(selectedScenario.devices.length * samplePolicies.length)

    const results: SimulationResult[] = []
    let step = 0

    for (const device of selectedScenario.devices) {
      for (const policy of samplePolicies.filter((p) => p.enabled)) {
        if (isPaused) {
          await new Promise((resolve) => {
            const checkPause = () => {
              if (!isPaused) resolve(undefined)
              else setTimeout(checkPause, 100)
            }
            checkPause()
          })
        }

        step++
        setCurrentStep(step)

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000 / simulationSpeed))

        // Evaluate policy against device
        const result = evaluatePolicy(device, policy)
        results.push(result)
        setSimulationResults([...results])

        // Update metrics
        updateSimulationMetrics(results)
      }
    }

    setIsRunning(false)
    toast({
      title: "Simulation Complete",
      description: `Evaluated ${results.length} policy-device combinations.`,
    })
  }

  const evaluatePolicy = (device: SimulationDevice, policy: PolicyRule): SimulationResult => {
    let matched = false
    let confidence = 0
    let reason = ""
    let riskLevel: "low" | "medium" | "high" | "critical" = "low"

    // Evaluate conditions
    for (const condition of policy.conditions) {
      switch (condition.type) {
        case "device_compliance":
          if (device.complianceStatus === condition.value) {
            matched = true
            confidence += 25
            reason += `Device compliance status matches (${condition.value}). `
          }
          break
        case "user_group":
          if (
            Array.isArray(condition.value)
              ? condition.value.includes(device.userGroup)
              : device.userGroup === condition.value
          ) {
            matched = true
            confidence += 20
            reason += `User group matches (${device.userGroup}). `
          }
          break
        case "risk_score":
          const threshold = Number(condition.value)
          if (condition.operator === "greater_than" && device.riskScore > threshold) {
            matched = true
            confidence += 30
            reason += `Risk score ${device.riskScore} > ${threshold}. `
            riskLevel = device.riskScore > 80 ? "critical" : device.riskScore > 60 ? "high" : "medium"
          } else if (condition.operator === "less_than" && device.riskScore < threshold) {
            matched = true
            confidence += 30
            reason += `Risk score ${device.riskScore} < ${threshold}. `
          }
          break
        case "certificate_present":
          if (condition.value && device.certificates.length > 0) {
            matched = true
            confidence += 25
            reason += `Valid certificates present. `
          } else if (!condition.value && device.certificates.length === 0) {
            matched = true
            confidence += 25
            reason += `No certificates required. `
          }
          break
        case "device_type":
          if (device.type === condition.value) {
            matched = true
            confidence += 20
            reason += `Device type matches (${condition.value}). `
          }
          break
        case "location":
          if (condition.operator === "contains" && device.location.includes(condition.value)) {
            matched = true
            confidence += 15
            reason += `Location contains ${condition.value}. `
          } else if (condition.operator === "equals" && device.location === condition.value) {
            matched = true
            confidence += 15
            reason += `Location matches ${condition.value}. `
          }
          break
        case "network_segment":
          if (device.networkSegment === condition.value) {
            matched = true
            confidence += 15
            reason += `Network segment matches (${condition.value}). `
          }
          break
      }
    }

    // Determine action
    const action = matched && policy.actions.length > 0 ? policy.actions[0].type : "no_action"

    // Generate recommendation based on agent mode
    let recommendation = ""
    if (agentMode === "agent" && device.agentInstalled) {
      recommendation = "Enhanced monitoring and real-time risk assessment available with agent."
    } else if (agentMode === "agent" && !device.agentInstalled) {
      recommendation = "Consider installing Portnox agent for enhanced security capabilities."
    } else {
      recommendation = "Agentless mode - using network-based device profiling and behavior analysis."
    }

    return {
      deviceId: device.id,
      policyId: policy.id,
      policyName: policy.name,
      matched,
      action,
      reason: reason.trim() || "No conditions matched",
      confidence: Math.min(confidence, 100),
      executionTime: Math.floor(Math.random() * 50) + 5,
      riskLevel,
      recommendation,
    }
  }

  const updateSimulationMetrics = (results: SimulationResult[]) => {
    const totalDevices = new Set(results.map((r) => r.deviceId)).size
    const policiesEvaluated = results.length
    const averageResponseTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length
    const successRate = (results.filter((r) => r.matched).length / results.length) * 100
    const blockedDevices = results.filter((r) => r.action === "deny" || r.action === "quarantine").length
    const allowedDevices = results.filter((r) => r.action === "allow").length
    const quarantinedDevices = results.filter((r) => r.action === "quarantine").length

    setSimulationMetrics({
      totalDevices,
      policiesEvaluated,
      averageResponseTime: Math.round(averageResponseTime),
      successRate: Math.round(successRate),
      blockedDevices,
      allowedDevices,
      quarantinedDevices,
    })
  }

  const pauseSimulation = () => {
    setIsPaused(true)
  }

  const resumeSimulation = () => {
    setIsPaused(false)
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentStep(0)
    setSimulationResults([])
    setSimulationMetrics({
      totalDevices: 0,
      policiesEvaluated: 0,
      averageResponseTime: 0,
      successRate: 0,
      blockedDevices: 0,
      allowedDevices: 0,
      quarantinedDevices: 0,
    })
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Smartphone className="h-4 w-4" />
      case "iot_device":
        return <Router className="h-4 w-4" />
      case "server":
        return <Network className="h-4 w-4" />
      case "printer":
        return <Router className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "allow":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "deny":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "quarantine":
        return <Lock className="h-4 w-4 text-orange-500" />
      case "require_mfa":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "critical":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Visual Policy Simulation Engine
              </CardTitle>
              <CardDescription>Test and visualize policy behavior with realistic device scenarios</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                {showAdvancedSettings ? "Hide" : "Show"} Settings
              </Button>
              <Select value={agentMode} onValueChange={(value: "agent" | "agentless") => setAgentMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agentless">Agentless</SelectItem>
                  <SelectItem value="agent">Agent Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Simulation Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={runSimulation}
                disabled={isRunning || !selectedScenario}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Start Simulation"}
              </Button>
              {isRunning && (
                <>
                  <Button variant="outline" onClick={isPaused ? resumeSimulation : pauseSimulation}>
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Speed:</Label>
                <Slider
                  value={[simulationSpeed]}
                  onValueChange={(value) => setSimulationSpeed(value[0])}
                  min={0.5}
                  max={5}
                  step={0.5}
                  className="w-20"
                />
                <span className="text-sm font-medium w-8">{simulationSpeed}x</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: {currentStep} / {totalSteps}
                </span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>
          )}

          {/* Advanced Settings */}
          {showAdvancedSettings && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Advanced Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="realtime"
                    checked={realTimeMode}
                    onChange={(e) => setRealTimeMode(e.target.checked)}
                  />
                  <Label htmlFor="realtime" className="text-sm">
                    Real-time Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Network Load:</Label>
                  <Slider
                    value={[selectedScenario?.networkConditions.networkLoad || 50]}
                    onValueChange={(value) => {
                      if (selectedScenario) {
                        setSelectedScenario({
                          ...selectedScenario,
                          networkConditions: {
                            ...selectedScenario.networkConditions,
                            networkLoad: value[0],
                          },
                        })
                      }
                    }}
                    min={0}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{selectedScenario?.networkConditions.networkLoad || 50}%</span>
                </div>
                <div>
                  <Label className="text-sm">Threat Level:</Label>
                  <Select
                    value={selectedScenario?.networkConditions.threatLevel || "medium"}
                    onValueChange={(value) => {
                      if (selectedScenario) {
                        setSelectedScenario({
                          ...selectedScenario,
                          networkConditions: {
                            ...selectedScenario.networkConditions,
                            threatLevel: value,
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulation Metrics */}
      {simulationResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{simulationMetrics.totalDevices}</div>
                <div className="text-sm text-gray-600">Devices</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{simulationMetrics.policiesEvaluated}</div>
                <div className="text-sm text-gray-600">Evaluations</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{simulationMetrics.allowedDevices}</div>
                <div className="text-sm text-gray-600">Allowed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{simulationMetrics.blockedDevices}</div>
                <div className="text-sm text-gray-600">Blocked</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{simulationMetrics.quarantinedDevices}</div>
                <div className="text-sm text-gray-600">Quarantined</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{simulationMetrics.averageResponseTime}ms</div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{simulationMetrics.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scenario Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Scenarios</CardTitle>
                <CardDescription>Choose a predefined scenario or create a custom one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {predefinedScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedScenario?.id === scenario.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Devices: {scenario.devices.length}</span>
                          <span>Time: {scenario.networkConditions.timeOfDay}</span>
                          <span>Load: {scenario.networkConditions.networkLoad}%</span>
                          <span>Threat: {scenario.networkConditions.threatLevel}</span>
                        </div>
                      </div>
                      <Badge variant={selectedScenario?.id === scenario.id ? "default" : "outline"}>
                        {selectedScenario?.id === scenario.id ? "Selected" : "Select"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scenario Details */}
            {selectedScenario && (
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Details: {selectedScenario.name}</CardTitle>
                  <CardDescription>Devices and network conditions for this scenario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Network Conditions</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Time: {selectedScenario.networkConditions.timeOfDay}</div>
                        <div>Load: {selectedScenario.networkConditions.networkLoad}%</div>
                        <div>Threat Level: {selectedScenario.networkConditions.threatLevel}</div>
                        <div>Maintenance: {selectedScenario.networkConditions.maintenanceMode ? "Yes" : "No"}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Devices ({selectedScenario.devices.length})</h4>
                      <div className="space-y-2">
                        {selectedScenario.devices.map((device) => (
                          <div key={device.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.type)}
                              <div>
                                <div className="font-medium text-sm">{device.name}</div>
                                <div className="text-xs text-gray-500">
                                  {device.userGroup} • {device.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  device.riskScore > 70
                                    ? "border-red-200 text-red-700"
                                    : device.riskScore > 40
                                      ? "border-yellow-200 text-yellow-700"
                                      : "border-green-200 text-green-700"
                                }`}
                              >
                                Risk: {device.riskScore}
                              </Badge>
                              <Badge
                                variant={device.complianceStatus === "compliant" ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {device.complianceStatus}
                              </Badge>
                              {agentMode === "agent" && (
                                <Badge variant={device.agentInstalled ? "default" : "outline"} className="text-xs">
                                  {device.agentInstalled ? "Agent" : "No Agent"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {simulationResults.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Simulation Results</h3>
              <p className="text-gray-600">Run a simulation to see detailed policy evaluation results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {simulationResults.map((result, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    result.action === "allow"
                      ? "border-l-green-500"
                      : result.action === "deny"
                        ? "border-l-red-500"
                        : result.action === "quarantine"
                          ? "border-l-orange-500"
                          : "border-l-blue-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getActionIcon(result.action)}
                          <span className="font-medium">{result.policyName}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.deviceId}
                          </Badge>
                          <Badge className={`text-xs ${getRiskColor(result.riskLevel)}`}>{result.riskLevel} risk</Badge>
                          <span className="text-sm text-gray-500">({result.executionTime}ms)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.reason}</p>
                        {agentMode === "agent" && <p className="text-xs text-blue-600 mb-2">{result.recommendation}</p>}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <Progress value={result.confidence} className="w-20 h-2" />
                            <span className="text-xs font-medium">{result.confidence}%</span>
                          </div>
                          <Badge variant={result.matched ? "default" : "outline"} className="text-xs">
                            {result.matched ? "Matched" : "No Match"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {samplePolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{policy.name}</h3>
                        <Badge variant={policy.enabled ? "default" : "secondary"}>
                          {policy.enabled ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{policy.category.replace("_", " ")}</Badge>
                        <span className="text-sm text-gray-500">Priority: {policy.priority}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Conditions ({policy.conditions.length})</h4>
                          <div className="space-y-1">
                            {policy.conditions.map((condition, idx) => (
                              <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {condition.description}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Actions ({policy.actions.length})</h4>
                          <div className="space-y-1">
                            {policy.actions.map((action, idx) => (
                              <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {action.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Action Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Allow</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{
                            width: `${simulationResults.length > 0 ? (simulationResults.filter((r) => r.action === "allow").length / simulationResults.length) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {simulationResults.length > 0
                          ? Math.round(
                              (simulationResults.filter((r) => r.action === "allow").length /
                                simulationResults.length) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deny</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-red-500 rounded-full"
                          style={{
                            width: `${simulationResults.length > 0 ? (simulationResults.filter((r) => r.action === "deny").length / simulationResults.length) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {simulationResults.length > 0
                          ? Math.round(
                              (simulationResults.filter((r) => r.action === "deny").length / simulationResults.length) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quarantine</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-orange-500 rounded-full"
                          style={{
                            width: `${simulationResults.length > 0 ? (simulationResults.filter((r) => r.action === "quarantine").length / simulationResults.length) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {simulationResults.length > 0
                          ? Math.round(
                              (simulationResults.filter((r) => r.action === "quarantine").length /
                                simulationResults.length) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Response Time</span>
                      <span>{simulationMetrics.averageResponseTime}ms</span>
                    </div>
                    <Progress
                      value={Math.min((simulationMetrics.averageResponseTime / 100) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Success Rate</span>
                      <span>{simulationMetrics.successRate}%</span>
                    </div>
                    <Progress value={simulationMetrics.successRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Policy Coverage</span>
                      <span>
                        {simulationResults.length > 0
                          ? Math.round(
                              (simulationResults.filter((r) => r.matched).length / simulationResults.length) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        simulationResults.length > 0
                          ? (simulationResults.filter((r) => r.matched).length / simulationResults.length) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["low", "medium", "high", "critical"].map((level) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{level} Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              level === "low"
                                ? "bg-green-500"
                                : level === "medium"
                                  ? "bg-yellow-500"
                                  : level === "high"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                              width: `${simulationResults.length > 0 ? (simulationResults.filter((r) => r.riskLevel === level).length / simulationResults.length) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {simulationResults.filter((r) => r.riskLevel === level).length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent vs Agentless Comparison */}
          {agentMode === "agent" && (
            <Card>
              <CardHeader>
                <CardTitle>Agent vs Agentless Comparison</CardTitle>
                <CardDescription>Benefits of using Portnox Agent for enhanced security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">With Portnox Agent</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Real-time device health monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Advanced threat detection and response</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Detailed application inventory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Behavioral analysis and anomaly detection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Automated remediation capabilities</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-orange-600">Agentless Mode</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Network-based device profiling only</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Limited visibility into device health</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Basic application detection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Reactive security posture</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Manual remediation required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
