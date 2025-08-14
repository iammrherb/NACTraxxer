"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { storage, type GlobalPolicy, type Site } from "@/lib/storage"
import {
  Shield,
  Smartphone,
  Network,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
  Play,
  Pause,
  Target,
  Wifi,
  BarChart3,
} from "lucide-react"

interface PolicyTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  riskLevel: "low" | "medium" | "high" | "critical"
  agentRequired: boolean
  mdmIntegration: boolean
}

interface PolicyCondition {
  id: string
  type: string
  operator: string
  value: string | string[] | number
  description: string
  agentRequired?: boolean
  mdmRequired?: boolean
}

interface PolicyAction {
  id: string
  type: string
  parameters: { [key: string]: any }
  description: string
  priority: number
  vlanId?: number
  ssid?: string
  bandwidth?: string
  timeRestriction?: string
}

interface RiskAssessmentPolicy {
  id: string
  name: string
  description: string
  agentBased: boolean
  agentlessChecks: string[]
  agentChecks: string[]
  riskThresholds: {
    low: number
    medium: number
    high: number
    critical: number
  }
  actions: {
    low: PolicyAction[]
    medium: PolicyAction[]
    high: PolicyAction[]
    critical: PolicyAction[]
  }
}

// Comprehensive policy templates with explosive scenarios
const policyTemplates: PolicyTemplate[] = [
  {
    id: "corporate-employee-access",
    name: "Corporate Employee Access",
    description: "Standard access policy for authenticated corporate employees with full network privileges",
    category: "authentication",
    type: "access",
    riskLevel: "low",
    agentRequired: false,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "in",
        value: ["Employees", "Contractors"],
        description: "User must be in authorized employee groups",
      },
      {
        id: "2",
        type: "device_compliance",
        operator: "equals",
        value: "compliant",
        description: "Device must be MDM compliant with security policies",
        mdmRequired: true,
      },
      {
        id: "3",
        type: "certificate",
        operator: "equals",
        value: "valid",
        description: "Valid corporate certificate required for authentication",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 100, vlanName: "Corporate", fullAccess: true },
        description: "Assign to corporate VLAN with full network access",
        priority: 1,
        vlanId: 100,
      },
      {
        id: "2",
        type: "allow",
        parameters: { fullAccess: true, qos: "high" },
        description: "Allow full network access with high QoS priority",
        priority: 2,
      },
    ],
  },
  {
    id: "byod-quarantine",
    name: "BYOD Device Quarantine",
    description: "Quarantine policy for personal devices with limited compliance - explosive containment",
    category: "security",
    type: "quarantine",
    riskLevel: "medium",
    agentRequired: false,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "device_ownership",
        operator: "equals",
        value: "personal",
        description: "Personal device detected through fingerprinting",
      },
      {
        id: "2",
        type: "device_compliance",
        operator: "not_equals",
        value: "compliant",
        description: "Device not fully compliant with corporate policies",
        mdmRequired: true,
      },
      {
        id: "3",
        type: "risk_score",
        operator: "greater_than",
        value: 40,
        description: "Risk score indicates potential security concerns",
      },
    ],
    actions: [
      {
        id: "1",
        type: "quarantine",
        parameters: { vlanId: 200, vlanName: "Quarantine", isolation: true },
        description: "Move to quarantine VLAN with network isolation",
        priority: 1,
        vlanId: 200,
      },
      {
        id: "2",
        type: "bandwidth_limit",
        parameters: { maxBandwidth: "10Mbps", burstLimit: "15Mbps" },
        description: "Limit bandwidth to 10Mbps with burst protection",
        priority: 2,
        bandwidth: "10Mbps",
      },
      {
        id: "3",
        type: "time_restrict",
        parameters: { maxDuration: "4h", dailyLimit: "8h" },
        description: "Limit session to 4 hours with daily cap",
        priority: 3,
        timeRestriction: "4h",
      },
      {
        id: "4",
        type: "notify",
        parameters: { recipients: ["security@company.com"], severity: "medium" },
        description: "Notify security team of quarantined device",
        priority: 4,
      },
    ],
  },
  {
    id: "guest-access-portal",
    name: "Guest Access with Captive Portal",
    description: "Self-service guest access with sponsor approval and explosive user experience",
    category: "guest_access",
    type: "access",
    riskLevel: "medium",
    agentRequired: false,
    mdmIntegration: false,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "equals",
        value: "Guests",
        description: "Guest user account with temporary access",
      },
      {
        id: "2",
        type: "sponsor_approval",
        operator: "equals",
        value: "approved",
        description: "Employee sponsor has approved guest access request",
      },
      {
        id: "3",
        type: "terms_accepted",
        operator: "equals",
        value: true,
        description: "Terms of service and acceptable use policy accepted",
      },
      {
        id: "4",
        type: "location",
        operator: "in",
        value: ["lobby", "conference-rooms", "guest-areas"],
        description: "Device located in approved guest access areas",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 300, vlanName: "Guest", internetOnly: true },
        description: "Assign to guest VLAN with internet-only access",
        priority: 1,
        vlanId: 300,
      },
      {
        id: "2",
        type: "bandwidth_limit",
        parameters: { maxBandwidth: "25Mbps", fairShare: true },
        description: "Limit bandwidth with fair sharing among guests",
        priority: 2,
        bandwidth: "25Mbps",
      },
      {
        id: "3",
        type: "time_restrict",
        parameters: { maxDuration: "24h", autoRenewal: false },
        description: "24-hour access limit without auto-renewal",
        priority: 3,
        timeRestriction: "24h",
      },
      {
        id: "4",
        type: "redirect",
        parameters: { portalUrl: "https://guest.company.com", brandedExperience: true },
        description: "Redirect to branded guest portal for registration",
        priority: 4,
      },
    ],
  },
  {
    id: "iot-device-segmentation",
    name: "IoT Device Segmentation",
    description: "Automatic segmentation and profiling for IoT devices - explosive micro-segmentation",
    category: "security",
    type: "vlan",
    riskLevel: "high",
    agentRequired: true,
    mdmIntegration: false,
    conditions: [
      {
        id: "1",
        type: "device_type",
        operator: "in",
        value: ["IoT", "Sensor", "Camera", "Printer", "Smart-Device"],
        description: "IoT device types identified through fingerprinting",
      },
      {
        id: "2",
        type: "device_profiling",
        operator: "equals",
        value: "completed",
        description: "Device profiling completed with manufacturer identification",
        agentRequired: true,
      },
      {
        id: "3",
        type: "vulnerability_scan",
        operator: "not_equals",
        value: "critical",
        description: "No critical vulnerabilities detected in device firmware",
        agentRequired: true,
      },
      {
        id: "4",
        type: "behavior_analysis",
        operator: "equals",
        value: "normal",
        description: "Device behavior matches expected IoT communication patterns",
        agentRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 400, vlanName: "IoT", microSegmentation: true },
        description: "Assign to IoT VLAN with micro-segmentation",
        priority: 1,
        vlanId: 400,
      },
      {
        id: "2",
        type: "micro_segmentation",
        parameters: { enabled: true, deviceIsolation: true, allowedPorts: [80, 443, 8080] },
        description: "Enable micro-segmentation with device isolation",
        priority: 2,
      },
      {
        id: "3",
        type: "monitoring",
        parameters: { enhanced: true, anomalyDetection: true, trafficAnalysis: true },
        description: "Enhanced monitoring with anomaly detection",
        priority: 3,
      },
      {
        id: "4",
        type: "qos_apply",
        parameters: { priority: "low", maxBandwidth: "5Mbps" },
        description: "Apply low priority QoS with bandwidth limits",
        priority: 4,
      },
    ],
  },
  {
    id: "high-risk-quarantine",
    name: "High-Risk Device Quarantine",
    description: "Immediate quarantine for high-risk devices - explosive threat containment",
    category: "security",
    type: "quarantine",
    riskLevel: "critical",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "risk_score",
        operator: "greater_than",
        value: 80,
        description: "Risk score above critical threshold of 80",
        agentRequired: true,
      },
      {
        id: "2",
        type: "malware_detected",
        operator: "equals",
        value: true,
        description: "Active malware detected on device",
        agentRequired: true,
      },
      {
        id: "3",
        type: "suspicious_behavior",
        operator: "equals",
        value: true,
        description: "Suspicious behavior patterns indicating compromise",
        agentRequired: true,
      },
      {
        id: "4",
        type: "threat_intelligence",
        operator: "equals",
        value: "match",
        description: "Device matches threat intelligence indicators",
        agentRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "deny",
        parameters: { immediate: true, blockAllTraffic: true },
        description: "Immediately deny all network access",
        priority: 1,
      },
      {
        id: "2",
        type: "quarantine",
        parameters: { vlanId: 999, vlanName: "Isolation", completeIsolation: true },
        description: "Move to complete isolation VLAN",
        priority: 2,
        vlanId: 999,
      },
      {
        id: "3",
        type: "notify",
        parameters: {
          recipients: ["security-team@company.com", "soc@company.com"],
          severity: "critical",
          escalation: true,
        },
        description: "Immediately notify security team with escalation",
        priority: 3,
      },
      {
        id: "4",
        type: "log_only",
        parameters: { forensicMode: true, fullPacketCapture: true },
        description: "Enable forensic logging with full packet capture",
        priority: 4,
      },
    ],
  },
  {
    id: "privileged-user-access",
    name: "Privileged User Access",
    description: "Enhanced security for privileged users - explosive monitoring and controls",
    category: "authentication",
    type: "access",
    riskLevel: "high",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "in",
        value: ["Administrators", "IT-Staff", "Security-Team"],
        description: "User in privileged access groups",
      },
      {
        id: "2",
        type: "mfa_verified",
        operator: "equals",
        value: true,
        description: "Multi-factor authentication successfully verified",
      },
      {
        id: "3",
        type: "device_compliance",
        operator: "equals",
        value: "compliant",
        description: "Device fully compliant with privileged user policies",
        mdmRequired: true,
      },
      {
        id: "4",
        type: "location",
        operator: "in",
        value: ["secure-areas", "data-center", "it-department"],
        description: "Access from secure physical locations only",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 10, vlanName: "Privileged", enhancedSecurity: true },
        description: "Assign to privileged VLAN with enhanced security",
        priority: 1,
        vlanId: 10,
      },
      {
        id: "2",
        type: "monitoring",
        parameters: {
          enhanced: true,
          sessionRecording: true,
          keystrokeLogging: true,
          screenCapture: true,
        },
        description: "Enhanced monitoring with session recording",
        priority: 2,
      },
      {
        id: "3",
        type: "time_restrict",
        parameters: { businessHoursOnly: true, maxSession: "8h" },
        description: "Restrict access to business hours with session limits",
        priority: 3,
        timeRestriction: "8h",
      },
      {
        id: "4",
        type: "notify",
        parameters: {
          recipients: ["audit@company.com"],
          realTime: true,
          privilegedAccess: true,
        },
        description: "Real-time notification of privileged access",
        priority: 4,
      },
    ],
  },
  {
    id: "contractor-limited-access",
    name: "Contractor Limited Access",
    description: "Restricted access for contractors and temporary workers - explosive project isolation",
    category: "authorization",
    type: "access",
    riskLevel: "medium",
    agentRequired: false,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "in",
        value: ["Contractors", "Temporary-Workers", "Vendors"],
        description: "User in contractor or temporary worker groups",
      },
      {
        id: "2",
        type: "project_assignment",
        operator: "not_equals",
        value: "none",
        description: "User assigned to specific project with defined scope",
      },
      {
        id: "3",
        type: "contract_status",
        operator: "equals",
        value: "active",
        description: "Active contract with valid end date",
      },
      {
        id: "4",
        type: "background_check",
        operator: "equals",
        value: "completed",
        description: "Background check completed and approved",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 150, vlanName: "Contractor", projectBased: true },
        description: "Assign to contractor VLAN with project-based access",
        priority: 1,
        vlanId: 150,
      },
      {
        id: "2",
        type: "resource_limit",
        parameters: {
          allowedServers: ["project-servers"],
          blockedResources: ["hr-systems", "financial-systems"],
        },
        description: "Limit access to project-specific resources only",
        priority: 2,
      },
      {
        id: "3",
        type: "time_restrict",
        parameters: { contractPeriod: true, dailyLimit: "10h" },
        description: "Restrict access to contract period with daily limits",
        priority: 3,
        timeRestriction: "10h",
      },
      {
        id: "4",
        type: "monitoring",
        parameters: {
          enhanced: true,
          dataLossPrevention: true,
        },
        description: "Enhanced monitoring with data loss prevention",
        priority: 4,
      },
    ],
  },
  {
    id: "medical-device-hipaa",
    name: "Medical Device HIPAA Compliance",
    description: "HIPAA-compliant access for medical devices - explosive healthcare security",
    category: "compliance",
    type: "access",
    riskLevel: "critical",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "device_type",
        operator: "in",
        value: ["Medical-Device", "Patient-Monitor", "Imaging-Equipment"],
        description: "Medical device requiring HIPAA compliance",
      },
      {
        id: "2",
        type: "hipaa_certification",
        operator: "equals",
        value: "valid",
        description: "Valid HIPAA certification and compliance status",
      },
      {
        id: "3",
        type: "encryption_status",
        operator: "equals",
        value: "encrypted",
        description: "Device data encrypted according to HIPAA requirements",
        agentRequired: true,
      },
      {
        id: "4",
        type: "audit_trail",
        operator: "equals",
        value: "enabled",
        description: "Audit trail enabled for HIPAA compliance tracking",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 500, vlanName: "Medical-HIPAA", isolation: true },
        description: "Assign to HIPAA-compliant medical VLAN",
        priority: 1,
        vlanId: 500,
      },
      {
        id: "2",
        type: "encryption_enforce",
        parameters: { level: "AES-256", endToEnd: true },
        description: "Enforce AES-256 end-to-end encryption",
        priority: 2,
      },
      {
        id: "3",
        type: "audit_logging",
        parameters: {
          hipaaCompliant: true,
          realTime: true,
          tamperProof: true,
          retention: "7years",
        },
        description: "HIPAA-compliant audit logging with 7-year retention",
        priority: 3,
      },
      {
        id: "4",
        type: "access_control",
        parameters: {
          roleBasedAccess: true,
          minimumNecessary: true,
          breakGlass: true,
        },
        description: "Role-based access with minimum necessary principle",
        priority: 4,
      },
    ],
  },
  {
    id: "financial-pci-compliance",
    name: "Financial PCI DSS Compliance",
    description: "PCI DSS compliant access for financial systems - explosive payment security",
    category: "compliance",
    type: "access",
    riskLevel: "critical",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "system_type",
        operator: "in",
        value: ["Payment-System", "POS-Terminal", "Card-Reader"],
        description: "Payment system requiring PCI DSS compliance",
      },
      {
        id: "2",
        type: "pci_certification",
        operator: "equals",
        value: "valid",
        description: "Valid PCI DSS certification and compliance status",
      },
      {
        id: "3",
        type: "cardholder_data",
        operator: "equals",
        value: "protected",
        description: "Cardholder data properly protected and encrypted",
        agentRequired: true,
      },
      {
        id: "4",
        type: "vulnerability_scan",
        operator: "equals",
        value: "passed",
        description: "Recent vulnerability scan passed with no critical issues",
        agentRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assign",
        parameters: { vlanId: 600, vlanName: "PCI-DSS", cardholderDataEnvironment: true },
        description: "Assign to PCI DSS cardholder data environment",
        priority: 1,
        vlanId: 600,
      },
      {
        id: "2",
        type: "network_segmentation",
        parameters: {
          strictSegmentation: true,
          cardholderDataIsolation: true,
          firewallRules: "restrictive",
        },
        description: "Strict network segmentation for cardholder data",
        priority: 2,
      },
      {
        id: "3",
        type: "monitoring",
        parameters: {
          pciCompliant: true,
          fileIntegrityMonitoring: true,
          logMonitoring: true,
          realTimeAlerts: true,
        },
        description: "PCI-compliant monitoring with real-time alerts",
        priority: 3,
      },
      {
        id: "4",
        type: "access_control",
        parameters: {
          strongAuthentication: true,
          uniqueUserIds: true,
          regularAccessReview: true,
        },
        description: "Strong authentication with regular access reviews",
        priority: 4,
      },
    ],
  },
  {
    id: "zero-trust-verification",
    name: "Zero Trust Verification",
    description: "Comprehensive zero trust verification - explosive never trust, always verify",
    category: "security",
    type: "access",
    riskLevel: "high",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "continuous_verification",
        operator: "equals",
        value: "active",
        description: "Continuous verification of user and device identity",
        agentRequired: true,
      },
      {
        id: "2",
        type: "behavioral_analysis",
        operator: "equals",
        value: "normal",
        description: "User and device behavior within normal parameters",
        agentRequired: true,
      },
      {
        id: "3",
        type: "context_awareness",
        operator: "equals",
        value: "verified",
        description: "Location, time, and access context verified",
      },
      {
        id: "4",
        type: "least_privilege",
        operator: "equals",
        value: "enforced",
        description: "Least privilege access principles enforced",
      },
    ],
    actions: [
      {
        id: "1",
        type: "dynamic_access",
        parameters: {
          riskBasedAccess: true,
          continuousEvaluation: true,
          adaptiveControls: true,
        },
        description: "Dynamic access based on continuous risk evaluation",
        priority: 1,
      },
      {
        id: "2",
        type: "micro_segmentation",
        parameters: {
          applicationLevel: true,
          dataClassification: true,
          contextAware: true,
        },
        description: "Application-level micro-segmentation",
        priority: 2,
      },
      {
        id: "3",
        type: "continuous_monitoring",
        parameters: {
          realTime: true,
          anomalyDetection: true,
          threatHunting: true,
          behaviorAnalytics: true,
        },
        description: "Continuous monitoring with threat hunting",
        priority: 3,
      },
      {
        id: "4",
        type: "adaptive_response",
        parameters: {
          automaticRemediation: true,
          riskBasedActions: true,
          contextualResponse: true,
        },
        description: "Adaptive response based on risk and context",
        priority: 4,
      },
    ],
  },
]

const agentlessCapabilities = [
  "Network Fingerprinting",
  "MDM Integration",
  "Vulnerability Scanning",
  "Behavioral Analysis",
  "Location Tracking",
  "Device Profiling",
  "Compliance Checks",
  "Threat Intelligence Feeds",
]

const agentCapabilities = [
  "Real-time Monitoring",
  "Advanced Threat Detection",
  "Endpoint Isolation",
  "Data Loss Prevention",
  "Application Control",
  "User Behavior Analytics",
  "Forensic Analysis",
  "Encryption Status",
  "Patch Management",
  "Process Monitoring",
  "File Integrity Monitoring",
  "Registry Monitoring",
  "Network Traffic Analysis",
]

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<GlobalPolicy[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<GlobalPolicy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("policies")
  const [showPolicyBuilder, setShowPolicyBuilder] = useState(false)
  const [showRiskBuilder, setShowRiskBuilder] = useState(false)
  const [simulationMode, setSimulationMode] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState("normal")
  const [agentMode, setAgentMode] = useState<"agentless" | "agent">("agentless")

  // Add simulation state
  const [simulationResults, setSimulationResults] = useState<any[]>([])
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  // Policy Builder State
  const [newPolicy, setNewPolicy] = useState<Partial<GlobalPolicy>>({
    name: "",
    description: "",
    category: "authentication",
    type: "access",
    priority: 50,
    conditions: [],
    actions: [],
    enabled: true,
    applicableSites: [],
    tags: [],
    version: "1.0",
    approvedBy: "System Administrator",
  })

  // Risk Assessment State
  const [riskPolicy, setRiskPolicy] = useState<RiskAssessmentPolicy>({
    id: "",
    name: "",
    description: "",
    agentBased: false,
    agentlessChecks: [],
    agentChecks: [],
    riskThresholds: {
      low: 30,
      medium: 60,
      high: 80,
      critical: 95,
    },
    actions: {
      low: [],
      medium: [],
      high: [],
      critical: [],
    },
  })

  const addConditionToPolicy = () => {
    const newCondition: PolicyCondition = {
      id: `${Date.now()}-${Math.random()}`,
      type: "user_group",
      operator: "equals",
      value: "",
      description: "New condition",
    }
    setNewPolicy({
      ...newPolicy,
      conditions: [...(newPolicy.conditions || []), newCondition],
    })
  }

  const updateCondition = (id: string, updates: Partial<PolicyCondition>) => {
    setNewPolicy({
      ...newPolicy,
      conditions: newPolicy.conditions?.map((condition) =>
        condition.id === id ? { ...condition, ...updates } : condition,
      ),
    })
  }

  const removeCondition = (id: string) => {
    setNewPolicy({
      ...newPolicy,
      conditions: newPolicy.conditions?.filter((condition) => condition.id !== id),
    })
  }

  const addActionToPolicy = () => {
    const newAction: PolicyAction = {
      id: `${Date.now()}-${Math.random()}`,
      type: "allow",
      parameters: {},
      description: "New action",
      priority: 1,
    }
    setNewPolicy({
      ...newPolicy,
      actions: [...(newPolicy.actions || []), newAction],
    })
  }

  const updateAction = (id: string, updates: Partial<PolicyAction>) => {
    setNewPolicy({
      ...newPolicy,
      actions: newPolicy.actions?.map((action) => (action.id === id ? { ...action, ...updates } : action)),
    })
  }

  const removeAction = (id: string) => {
    setNewPolicy({
      ...newPolicy,
      actions: newPolicy.actions?.filter((action) => action.id !== id),
    })
  }

  const savePolicyFromBuilder = async () => {
    if (!newPolicy.name || !newPolicy.description) {
      toast({
        title: "Error",
        description: "Policy name and description are required.",
        variant: "destructive",
      })
      return
    }

    const policyToSave: GlobalPolicy = {
      id: `${Date.now()}-${Math.random()}`,
      name: newPolicy.name,
      description: newPolicy.description,
      category: newPolicy.category || "authentication",
      type: newPolicy.type || "access",
      priority: newPolicy.priority || 50,
      conditions: newPolicy.conditions || [],
      actions: newPolicy.actions || [],
      enabled: newPolicy.enabled !== false,
      applicableSites: newPolicy.applicableSites || [],
      tags: newPolicy.tags || [],
      version: newPolicy.version || "1.0",
      approvedBy: newPolicy.approvedBy || "System Administrator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await storage.createGlobalPolicy(policyToSave)
      toast({
        title: "Policy Saved",
        description: "Policy has been saved successfully",
      })
      setShowPolicyBuilder(false)
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save policy",
        variant: "destructive",
      })
    }
  }

  const loadData = async () => {
    const storedPolicies = await storage.getGlobalPolicies()
    setPolicies(storedPolicies)

    const storedSites = await storage.getSites()
    setSites(storedSites)
  }

  useEffect(() => {
    loadData()
  }, [])

  const exportPolicies = () => {
    const dataStr = JSON.stringify(policies, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileName = "policies.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileName)
    linkElement.click()
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 30) return "bg-green-100 text-green-800"
    if (priority <= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const createPolicyFromTemplate = async (template: PolicyTemplate) => {
    const newPolicyFromTemplate: GlobalPolicy = {
      id: `${Date.now()}-${Math.random()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      type: template.type,
      priority: 50,
      conditions: template.conditions,
      actions: template.actions,
      enabled: true,
      applicableSites: [],
      tags: [template.riskLevel, template.agentRequired ? "agent-required" : ""].filter(Boolean),
      version: "1.0",
      approvedBy: "System Administrator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await storage.createGlobalPolicy(newPolicyFromTemplate)
      toast({
        title: "Policy Created",
        description: `Policy created from ${template.name} template`,
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create policy from template",
        variant: "destructive",
      })
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Risk Assessment Policy Builder Modal
  const RiskAssessmentBuilder = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showRiskBuilder ? "" : "hidden"}`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Risk Assessment Policy Builder</h2>
          <Button variant="ghost" onClick={() => setShowRiskBuilder(false)}>
            ✕
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="conditions">Risk Conditions</TabsTrigger>
            <TabsTrigger value="actions">Risk Actions</TabsTrigger>
            <TabsTrigger value="preview">Preview & Test</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Policy Name</Label>
                <Input
                  value={riskPolicy.name}
                  onChange={(e) => setRiskPolicy({ ...riskPolicy, name: e.target.value })}
                  placeholder="High Risk Device Policy"
                />
              </div>
              <div className="space-y-2">
                <Label>Assessment Mode</Label>
                <Select
                  value={riskPolicy.agentBased ? "agent" : "agentless"}
                  onValueChange={(value) => setRiskPolicy({ ...riskPolicy, agentBased: value === "agent" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agentless">Agentless Assessment</SelectItem>
                    <SelectItem value="agent">Agent-Based Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={riskPolicy.description}
                onChange={(e) => setRiskPolicy({ ...riskPolicy, description: e.target.value })}
                placeholder="Comprehensive risk assessment policy for device evaluation"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Low Risk Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[riskPolicy.riskThresholds.low]}
                    onValueChange={(value) =>
                      setRiskPolicy({
                        ...riskPolicy,
                        riskThresholds: { ...riskPolicy.riskThresholds, low: value[0] },
                      })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskPolicy.riskThresholds.low}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Medium Risk Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[riskPolicy.riskThresholds.medium]}
                    onValueChange={(value) =>
                      setRiskPolicy({
                        ...riskPolicy,
                        riskThresholds: { ...riskPolicy.riskThresholds, medium: value[0] },
                      })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskPolicy.riskThresholds.medium}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>High Risk Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[riskPolicy.riskThresholds.high]}
                    onValueChange={(value) =>
                      setRiskPolicy({
                        ...riskPolicy,
                        riskThresholds: { ...riskPolicy.riskThresholds, high: value[0] },
                      })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskPolicy.riskThresholds.high}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Critical Risk Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[riskPolicy.riskThresholds.critical]}
                    onValueChange={(value) =>
                      setRiskPolicy({
                        ...riskPolicy,
                        riskThresholds: { ...riskPolicy.riskThresholds, critical: value[0] },
                      })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskPolicy.riskThresholds.critical}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Agentless Risk Factors</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {agentlessCapabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch
                        checked={riskPolicy.agentlessChecks.includes(capability)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRiskPolicy({
                              ...riskPolicy,
                              agentlessChecks: [...riskPolicy.agentlessChecks, capability],
                            })
                          } else {
                            setRiskPolicy({
                              ...riskPolicy,
                              agentlessChecks: riskPolicy.agentlessChecks.filter((c) => c !== capability),
                            })
                          }
                        }}
                      />
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {riskPolicy.agentBased && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Agent-Based Risk Factors</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {agentCapabilities.map((capability, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Switch
                          checked={riskPolicy.agentChecks.includes(capability)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRiskPolicy({
                                ...riskPolicy,
                                agentChecks: [...riskPolicy.agentChecks, capability],
                              })
                            } else {
                              setRiskPolicy({
                                ...riskPolicy,
                                agentChecks: riskPolicy.agentChecks.filter((c) => c !== capability),
                              })
                            }
                          }}
                        />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(["low", "medium", "high", "critical"] as const).map((riskLevel) => (
                <div key={riskLevel} className="space-y-4">
                  <h3
                    className={`font-semibold capitalize ${
                      riskLevel === "critical"
                        ? "text-red-600"
                        : riskLevel === "high"
                          ? "text-orange-600"
                          : riskLevel === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                    }`}
                  >
                    {riskLevel} Risk Actions
                  </h3>

                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) => {
                        const newAction: PolicyAction = {
                          id: `${Date.now()}-${Math.random()}`,
                          type: value as any,
                          parameters: {},
                          description: `${value} action for ${riskLevel} risk`,
                          priority: riskPolicy.actions[riskLevel].length + 1,
                        }
                        setRiskPolicy({
                          ...riskPolicy,
                          actions: {
                            ...riskPolicy.actions,
                            [riskLevel]: [...riskPolicy.actions[riskLevel], newAction],
                          },
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow Access</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                        <SelectItem value="deny">Deny Access</SelectItem>
                        <SelectItem value="vlan_assign">Assign VLAN</SelectItem>
                        <SelectItem value="bandwidth_limit">Limit Bandwidth</SelectItem>
                        <SelectItem value="time_restrict">Time Restriction</SelectItem>
                        <SelectItem value="notify">Send Notification</SelectItem>
                        <SelectItem value="log_only">Log Only</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="space-y-1">
                      {riskPolicy.actions[riskLevel].map((action, index) => (
                        <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{action.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRiskPolicy({
                                ...riskPolicy,
                                actions: {
                                  ...riskPolicy.actions,
                                  [riskLevel]: riskPolicy.actions[riskLevel].filter((a) => a.id !== action.id),
                                },
                              })
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Risk Policy Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {riskPolicy.name || "Unnamed Policy"}
                  </div>
                  <div>
                    <strong>Mode:</strong> {riskPolicy.agentBased ? "Agent-Based" : "Agentless"}
                  </div>
                  <div>
                    <strong>Agentless Checks:</strong> {riskPolicy.agentlessChecks.length}
                  </div>
                  <div>
                    <strong>Agent Checks:</strong> {riskPolicy.agentChecks.length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {(["low", "medium", "high", "critical"] as const).map((level) => (
                  <div key={level} className="p-3 border rounded-lg">
                    <h4
                      className={`font-medium capitalize ${
                        level === "critical"
                          ? "text-red-600"
                          : level === "high"
                            ? "text-orange-600"
                            : level === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    >
                      {level} Risk
                    </h4>
                    <div className="text-sm text-gray-600">Threshold: {riskPolicy.riskThresholds[level]}</div>
                    <div className="text-sm text-gray-600">Actions: {riskPolicy.actions[level].length}</div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    // Save risk policy logic here
                    toast({
                      title: "Risk Policy Saved",
                      description: "Risk assessment policy has been configured successfully",
                    })
                    setShowRiskBuilder(false)
                  }}
                >
                  Save Risk Policy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Test policy logic here
                    toast({
                      title: "Testing Policy",
                      description: "Running risk assessment simulation...",
                    })
                  }}
                >
                  Test Policy
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Policy Builder Modal
  const PolicyBuilderModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showPolicyBuilder ? "" : "hidden"}`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Advanced Policy Builder</h2>
          <Button variant="ghost" onClick={() => setShowPolicyBuilder(false)}>
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Policy Name</Label>
                <Input
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="Enter policy name"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newPolicy.category}
                  onValueChange={(value) => setNewPolicy({ ...newPolicy, category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="qos">Quality of Service</SelectItem>
                    <SelectItem value="guest_access">Guest Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Policy Type</Label>
                <Select
                  value={newPolicy.type}
                  onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access Control</SelectItem>
                    <SelectItem value="vlan">VLAN Assignment</SelectItem>
                    <SelectItem value="qos">QoS Policy</SelectItem>
                    <SelectItem value="security">Security Policy</SelectItem>
                    <SelectItem value="compliance">Compliance Policy</SelectItem>
                    <SelectItem value="bandwidth">Bandwidth Control</SelectItem>
                    <SelectItem value="time">Time-based Access</SelectItem>
                    <SelectItem value="location">Location-based Access</SelectItem>
                    <SelectItem value="quarantine">Quarantine Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority: {newPolicy.priority}</Label>
                <Slider
                  value={[newPolicy.priority || 50]}
                  onValueChange={(value) => setNewPolicy({ ...newPolicy, priority: value[0] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                placeholder="Describe the policy purpose and scope"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Conditions</h3>
                <Button size="sm" onClick={addConditionToPolicy}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {newPolicy.conditions?.map((condition) => (
                  <div key={condition.id} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Select
                        value={condition.type}
                        onValueChange={(value) => updateCondition(condition.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user_group">User Group</SelectItem>
                          <SelectItem value="device_type">Device Type</SelectItem>
                          <SelectItem value="device_compliance">Device Compliance</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="time">Time</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                          <SelectItem value="os_type">OS Type</SelectItem>
                          <SelectItem value="device_health">Device Health</SelectItem>
                          <SelectItem value="risk_score">Risk Score</SelectItem>
                          <SelectItem value="ip_range">IP Range</SelectItem>
                          <SelectItem value="mac_address">MAC Address</SelectItem>
                          <SelectItem value="ssid">SSID</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Not Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="not_contains">Not Contains</SelectItem>
                          <SelectItem value="in">In List</SelectItem>
                          <SelectItem value="not_in">Not In List</SelectItem>
                          <SelectItem value="greater_than">Greater Than</SelectItem>
                          <SelectItem value="less_than">Less Than</SelectItem>
                          <SelectItem value="matches_regex">Matches Regex</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-1">
                        <Input
                          value={condition.value as string}
                          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                          placeholder="Value"
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeCondition(condition.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={condition.description}
                      onChange={(e) => updateCondition(condition.id, { description: e.target.value })}
                      placeholder="Condition description"
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Actions</h3>
                <Button size="sm" onClick={addActionToPolicy}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Action
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {newPolicy.actions?.map((action) => (
                  <div key={action.id} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Select value={action.type} onValueChange={(value) => updateAction(action.id, { type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allow">Allow Access</SelectItem>
                          <SelectItem value="deny">Deny Access</SelectItem>
                          <SelectItem value="quarantine">Quarantine</SelectItem>
                          <SelectItem value="redirect">Redirect</SelectItem>
                          <SelectItem value="notify">Send Notification</SelectItem>
                          <SelectItem value="vlan_assign">Assign VLAN</SelectItem>
                          <SelectItem value="qos_apply">Apply QoS</SelectItem>
                          <SelectItem value="bandwidth_limit">Limit Bandwidth</SelectItem>
                          <SelectItem value="time_restrict">Time Restriction</SelectItem>
                          <SelectItem value="log_only">Log Only</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        value={action.priority}
                        onChange={(e) => updateAction(action.id, { priority: Number.parseInt(e.target.value) })}
                        placeholder="Priority"
                      />

                      <div className="flex items-center space-x-1">
                        <Input
                          value={JSON.stringify(action.parameters)}
                          onChange={(e) => {
                            try {
                              const params = JSON.parse(e.target.value)
                              updateAction(action.id, { parameters: params })
                            } catch {}
                          }}
                          placeholder='{"key": "value"}'
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={action.description}
                      onChange={(e) => updateAction(action.id, { description: e.target.value })}
                      placeholder="Action description"
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Policy Preview</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {newPolicy.name || "Unnamed Policy"}
                </div>
                <div>
                  <strong>Category:</strong> {newPolicy.category}
                </div>
                <div>
                  <strong>Type:</strong> {newPolicy.type}
                </div>
                <div>
                  <strong>Priority:</strong> {newPolicy.priority}
                </div>
                <div>
                  <strong>Conditions:</strong> {newPolicy.conditions?.length || 0}
                </div>
                <div>
                  <strong>Actions:</strong> {newPolicy.actions?.length || 0}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable Sites</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {sites.map((site) => (
                  <div key={site.id} className="flex items-center space-x-2">
                    <Switch
                      checked={newPolicy.applicableSites?.includes(site.id) || false}
                      onCheckedChange={(checked) => {
                        const currentSites = newPolicy.applicableSites || []
                        if (checked) {
                          setNewPolicy({
                            ...newPolicy,
                            applicableSites: [...currentSites, site.id],
                          })
                        } else {
                          setNewPolicy({
                            ...newPolicy,
                            applicableSites: currentSites.filter((id) => id !== site.id),
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{site.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={newPolicy.tags?.join(", ")}
                onChange={(e) =>
                  setNewPolicy({
                    ...newPolicy,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={savePolicyFromBuilder} className="flex-1">
                Save Policy
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Simulate policy logic here
                  toast({
                    title: "Simulating Policy",
                    description: "Testing policy against sample scenarios...",
                  })
                }}
              >
                Test Policy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Simulation Engine
  const runPolicySimulation = async (scenario: string) => {
    setSimulationRunning(true)
    setSimulationProgress(0)
    setSimulationResults([])

    const scenarios = {
      normal: {
        name: "Normal Operations",
        devices: [
          { type: "Windows", compliance: "compliant", riskScore: 15, user: "employee" },
          { type: "macOS", compliance: "compliant", riskScore: 12, user: "employee" },
          { type: "iOS", compliance: "compliant", riskScore: 8, user: "employee" },
          { type: "Android", compliance: "partial", riskScore: 25, user: "contractor" },
        ],
      },
      breach: {
        name: "Security Breach Response",
        devices: [
          { type: "Windows", compliance: "non-compliant", riskScore: 85, user: "employee", malware: true },
          { type: "Unknown", compliance: "unknown", riskScore: 95, user: "unknown", suspicious: true },
          { type: "Linux", compliance: "compliant", riskScore: 45, user: "admin", lateral_movement: true },
        ],
      },
      compliance: {
        name: "Compliance Audit",
        devices: [
          { type: "Windows", compliance: "compliant", riskScore: 10, user: "employee", encrypted: true },
          { type: "macOS", compliance: "compliant", riskScore: 8, user: "employee", encrypted: true },
          { type: "BYOD", compliance: "partial", riskScore: 35, user: "employee", encrypted: false },
          { type: "Guest", compliance: "unknown", riskScore: 50, user: "guest" },
        ],
      },
      onboarding: {
        name: "Mass Device Onboarding",
        devices: Array.from({ length: 50 }, (_, i) => ({
          type: ["Windows", "macOS", "iOS", "Android"][i % 4],
          compliance: "pending",
          riskScore: Math.floor(Math.random() * 30) + 10,
          user: "new_employee",
          onboarding: true,
        })),
      },
      "guest-surge": {
        name: "Guest Access Surge",
        devices: Array.from({ length: 100 }, (_, i) => ({
          type: "Guest Device",
          compliance: "unknown",
          riskScore: Math.floor(Math.random() * 40) + 30,
          user: "guest",
          temporary: true,
        })),
      },
      "iot-deployment": {
        name: "IoT Device Deployment",
        devices: [
          { type: "IoT Camera", compliance: "unknown", riskScore: 60, user: "system", vulnerable: true },
          { type: "IoT Sensor", compliance: "compliant", riskScore: 20, user: "system" },
          { type: "Smart Printer", compliance: "partial", riskScore: 40, user: "system", outdated: true },
          { type: "IoT Controller", compliance: "compliant", riskScore: 15, user: "system" },
        ],
      },
    }

    const scenarioData = scenarios[scenario as keyof typeof scenarios]
    if (!scenarioData) return

    const results = []

    for (let i = 0; i < scenarioData.devices.length; i++) {
      const device = scenarioData.devices[i]
      setSimulationProgress(((i + 1) / scenarioData.devices.length) * 100)

      // Simulate policy evaluation
      await new Promise((resolve) => setTimeout(resolve, 100))

      let decision = "allow"
      let vlan = "100"
      let reason = "Standard access granted"

      // Apply policy logic
      if (device.riskScore > 80) {
        decision = "deny"
        reason = "High risk score detected"
      } else if (device.riskScore > 60) {
        decision = "quarantine"
        vlan = "999"
        reason = "Medium-high risk, quarantine required"
      } else if (device.compliance === "non-compliant") {
        decision = "quarantine"
        vlan = "200"
        reason = "Device not compliant with policies"
      } else if (device.user === "guest") {
        decision = "allow"
        vlan = "300"
        reason = "Guest access granted"
      } else if (device.type.includes("IoT")) {
        decision = "allow"
        vlan = "400"
        reason = "IoT device segmentation"
      }

      results.push({
        device: `${device.type} (Risk: ${device.riskScore})`,
        user: device.user,
        decision,
        vlan,
        reason,
        compliance: device.compliance,
        riskScore: device.riskScore,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    setSimulationResults(results)
    setSimulationRunning(false)
    setSimulationProgress(100)

    toast({
      title: "Simulation Complete",
      description: `Processed ${results.length} devices in ${scenarioData.name} scenario`,
    })
  }

  // Add the simulation tab content
  const SimulationTabContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-blue-600" />
            <span>Policy Simulation Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Simulation Scenario</Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Operations</SelectItem>
                    <SelectItem value="breach">Security Breach Response</SelectItem>
                    <SelectItem value="compliance">Compliance Audit</SelectItem>
                    <SelectItem value="onboarding">Mass Device Onboarding</SelectItem>
                    <SelectItem value="guest-surge">Guest Access Surge</SelectItem>
                    <SelectItem value="iot-deployment">IoT Device Deployment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Agent Mode</Label>
                <Select value={agentMode} onValueChange={(value: "agentless" | "agent") => setAgentMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agentless">Agentless Assessment</SelectItem>
                    <SelectItem value="agent">Agent-Based Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Active Policies</Label>
                <div className="text-sm text-gray-600">
                  {policies.filter((p) => p.enabled).length} policies will be evaluated
                </div>
              </div>

              <Button
                onClick={() => runPolicySimulation(selectedScenario)}
                disabled={simulationRunning}
                className="w-full"
              >
                {simulationRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </Button>

              {simulationRunning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(simulationProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Simulation Results</h3>
              {simulationResults.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {simulationResults.map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{result.device}</span>
                        <Badge
                          className={
                            result.decision === "allow"
                              ? "bg-green-100 text-green-800"
                              : result.decision === "quarantine"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {result.decision}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          User: {result.user} | VLAN: {result.vlan}
                        </div>
                        <div>Reason: {result.reason}</div>
                        <div>Time: {result.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run a simulation to see policy evaluation results</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {simulationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {simulationResults.filter((r) => r.decision === "allow").length}
                </div>
                <div className="text-sm text-green-600">Allowed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {simulationResults.filter((r) => r.decision === "quarantine").length}
                </div>
                <div className="text-sm text-yellow-600">Quarantined</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {simulationResults.filter((r) => r.decision === "deny").length}
                </div>
                <div className="text-sm text-red-600">Denied</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (simulationResults.filter((r) => r.decision === "allow").length / simulationResults.length) * 100,
                  )}
                  %
                </div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Update the TabsContent for simulation
  // Replace the existing simulation TabsContent with:

  // Add the modals to the return statement
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Advanced Policy Management & Risk Assessment</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Agent Mode:</Label>
                <Select value={agentMode} onValueChange={(value: "agentless" | "agent") => setAgentMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agentless">Agentless</SelectItem>
                    <SelectItem value="agent">Agent-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" onClick={() => setSimulationMode(!simulationMode)}>
                {simulationMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {simulationMode ? "Stop" : "Simulate"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportPolicies}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button onClick={() => setShowPolicyBuilder(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Create Policy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{policies.length}</div>
              <div className="text-sm text-blue-600">Total Policies</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{policies.filter((p) => p.enabled).length}</div>
              <div className="text-sm text-green-600">Active Policies</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {policies.filter((p) => p.tags.includes("agent-required")).length}
              </div>
              <div className="text-sm text-purple-600">Agent-Based</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {policies.filter((p) => p.tags.includes("high") || p.tags.includes("critical")).length}
              </div>
              <div className="text-sm text-orange-600">High Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="templates">Policy Templates</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="vlan-builder">VLAN & SSID Builder</TabsTrigger>
          <TabsTrigger value="simulation">Policy Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Policy Configuration</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {agentMode === "agent" ? "Agent-Based Mode" : "Agentless Mode"}
                  </Badge>
                  {simulationMode && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Simulation Active
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${policy.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                        <h3 className="font-semibold">{policy.name}</h3>
                        <Badge variant="outline" className={getPriorityColor(policy.priority)}>
                          Priority {policy.priority}
                        </Badge>
                        <Badge variant="secondary">
                          {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}
                        </Badge>
                        {policy.tags.includes("agent-required") && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Agent Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={async (checked) => {
                            await storage.updateGlobalPolicy(policy.id, { enabled: checked })
                            await loadData()
                          }}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{policy.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span>Conditions ({policy.conditions.length})</span>
                        </h4>
                        <div className="space-y-1">
                          {policy.conditions.slice(0, 3).map((condition) => (
                            <div key={condition.id} className="text-sm text-gray-600 flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span>{condition.description}</span>
                            </div>
                          ))}
                          {policy.conditions.length > 3 && (
                            <div className="text-sm text-gray-500">+{policy.conditions.length - 3} more conditions</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span>Actions ({policy.actions.length})</span>
                        </h4>
                        <div className="space-y-1">
                          {policy.actions.map((action) => (
                            <div key={action.id} className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                              <span className="text-sm text-gray-600">{action.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {policy.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(policy.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}

                {policies.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies Configured</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first policy using templates or the policy builder.
                    </p>
                    <Button onClick={() => setShowPolicyBuilder(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Policy
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policyTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge className={getRiskColor(template.riskLevel)}>{template.riskLevel}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        {template.agentRequired && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Agent Required
                          </Badge>
                        )}
                        {template.mdmIntegration && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <Smartphone className="w-3 h-3 mr-1" />
                            MDM Integration
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      <div>
                        <span className="font-medium">Conditions:</span> {template.conditions.length}
                      </div>
                      <div>
                        <span className="font-medium">Actions:</span> {template.actions.length}
                      </div>
                    </div>

                    <Button size="sm" onClick={() => createPolicyFromTemplate(template)} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Risk Assessment Capabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={agentMode} onValueChange={(value: "agentless" | "agent") => setAgentMode(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="agentless">Agentless Mode</TabsTrigger>
                    <TabsTrigger value="agent">Agent-Based Mode</TabsTrigger>
                  </TabsList>

                  <TabsContent value="agentless" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Available Agentless Checks:</h4>
                      {agentlessCapabilities.map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{capability}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Agentless Mode:</strong> Provides basic risk assessment using network-based detection,
                        MDM integration, and behavioral analysis without requiring endpoint agents.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="agent" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Available Agent-Based Checks:</h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {agentCapabilities.map((capability, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-sm">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Agent-Based Mode:</strong> Provides comprehensive risk assessment with real-time
                        endpoint monitoring, advanced threat detection, and behavioral analytics using the Portnox
                        agent.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Risk Threshold Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Low Risk Threshold: {riskPolicy.riskThresholds.low}</Label>
                      <Slider
                        value={[riskPolicy.riskThresholds.low]}
                        onValueChange={(value) =>
                          setRiskPolicy({
                            ...riskPolicy,
                            riskThresholds: { ...riskPolicy.riskThresholds, low: value[0] },
                          })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        Devices with risk score 0-{riskPolicy.riskThresholds.low} are considered low risk
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medium Risk Threshold: {riskPolicy.riskThresholds.medium}</Label>
                      <Slider
                        value={[riskPolicy.riskThresholds.medium]}
                        onValueChange={(value) =>
                          setRiskPolicy({
                            ...riskPolicy,
                            riskThresholds: { ...riskPolicy.riskThresholds, medium: value[0] },
                          })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        Devices with risk score {riskPolicy.riskThresholds.low + 1}-{riskPolicy.riskThresholds.medium}{" "}
                        are considered medium risk
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>High Risk Threshold: {riskPolicy.riskThresholds.high}</Label>
                      <Slider
                        value={[riskPolicy.riskThresholds.high]}
                        onValueChange={(value) =>
                          setRiskPolicy({
                            ...riskPolicy,
                            riskThresholds: { ...riskPolicy.riskThresholds, high: value[0] },
                          })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        Devices with risk score {riskPolicy.riskThresholds.medium + 1}-{riskPolicy.riskThresholds.high}{" "}
                        are considered high risk
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Critical Risk Threshold: {riskPolicy.riskThresholds.critical}</Label>
                      <Slider
                        value={[riskPolicy.riskThresholds.critical]}
                        onValueChange={(value) =>
                          setRiskPolicy({
                            ...riskPolicy,
                            riskThresholds: { ...riskPolicy.riskThresholds, critical: value[0] },
                          })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        Devices with risk score {riskPolicy.riskThresholds.high + 1}-100 are considered critical risk
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setShowRiskBuilder(true)} className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Risk Policies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vlan-builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-blue-600" />
                  <span>VLAN Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>VLAN ID</Label>
                      <Input type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>VLAN Name</Label>
                      <Input placeholder="Corporate" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Corporate employee network access" />
                  </div>

                  <div className="space-y-2">
                    <Label>IP Range</Label>
                    <Input placeholder="192.168.100.0/24" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gateway</Label>
                      <Input placeholder="192.168.100.1" />
                    </div>
                    <div className="space-y-2">
                      <Label>DHCP Pool</Label>
                      <Input placeholder="192.168.100.10-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Access Control</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Access</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                        <SelectItem value="internet-only">Internet Only</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create VLAN
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-purple-600" />
                  <span>SSID Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>SSID Name</Label>
                    <Input placeholder="Corporate-WiFi" />
                  </div>

                  <div className="space-y-2">
                    <Label>Security Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wpa3-enterprise">WPA3 Enterprise</SelectItem>
                        <SelectItem value="wpa2-enterprise">WPA2 Enterprise</SelectItem>
                        <SelectItem value="wpa3-personal">WPA3 Personal</SelectItem>
                        <SelectItem value="wpa2-personal">WPA2 Personal</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Authentication Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select auth method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="802.1x">802.1X</SelectItem>
                        <SelectItem value="psk">Pre-Shared Key</SelectItem>
                        <SelectItem value="captive-portal">Captive Portal</SelectItem>
                        <SelectItem value="mac-auth">MAC Authentication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default VLAN</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VLAN" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">VLAN 100 - Corporate</SelectItem>
                        <SelectItem value="200">VLAN 200 - Quarantine</SelectItem>
                        <SelectItem value="300">VLAN 300 - Guest</SelectItem>
                        <SelectItem value="400">VLAN 400 - IoT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create SSID
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          <SimulationTabContent />
        </TabsContent>
      </Tabs>

      {/* Add the modals */}
      <PolicyBuilderModal />
      <RiskAssessmentBuilder />
    </div>
  )
}
