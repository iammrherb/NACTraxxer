export interface SimulationDevice {
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
