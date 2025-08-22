export interface SimulationMetrics {
  totalDevices: number
  policiesEvaluated: number
  averageResponseTime: number
  successRate: number
  blockedDevices: number
  allowedDevices: number
  quarantinedDevices: number
  riskScoreDistribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
  deviceTypeBreakdown: Record<string, number>
  complianceRates: {
    compliant: number
    nonCompliant: number
    unknown: number
  }
  networkSegmentActivity: Record<string, number>
  timeBasedMetrics: {
    hourly: number[]
    daily: number[]
    weekly: number[]
  }
}

export class SimulationMetricsCalculator {
  private static instance: SimulationMetricsCalculator
  private metrics: SimulationMetrics

  private constructor() {
    this.metrics = this.initializeMetrics()
  }

  public static getInstance(): SimulationMetricsCalculator {
    if (!SimulationMetricsCalculator.instance) {
      SimulationMetricsCalculator.instance = new SimulationMetricsCalculator()
    }
    return SimulationMetricsCalculator.instance
  }

  private initializeMetrics(): SimulationMetrics {
    return {
      totalDevices: Math.floor(Math.random() * 1000) + 500,
      policiesEvaluated: Math.floor(Math.random() * 1000000) + 500000,
      averageResponseTime: Math.floor(Math.random() * 50) + 10,
      successRate: 95 + Math.random() * 4,
      blockedDevices: Math.floor(Math.random() * 10000) + 5000,
      allowedDevices: Math.floor(Math.random() * 100000) + 50000,
      quarantinedDevices: Math.floor(Math.random() * 500) + 100,
      riskScoreDistribution: {
        low: Math.floor(Math.random() * 1000) + 2000,
        medium: Math.floor(Math.random() * 500) + 800,
        high: Math.floor(Math.random() * 200) + 150,
        critical: Math.floor(Math.random() * 50) + 20,
      },
      deviceTypeBreakdown: {
        laptop: Math.floor(Math.random() * 1000) + 1500,
        smartphone: Math.floor(Math.random() * 800) + 1200,
        tablet: Math.floor(Math.random() * 300) + 200,
        iot_device: Math.floor(Math.random() * 500) + 300,
        server: Math.floor(Math.random() * 100) + 50,
        printer: Math.floor(Math.random() * 150) + 80,
      },
      complianceRates: {
        compliant: 85 + Math.random() * 10,
        nonCompliant: 5 + Math.random() * 8,
        unknown: 2 + Math.random() * 5,
      },
      networkSegmentActivity: {
        corporate: Math.floor(Math.random() * 10000) + 15000,
        guest: Math.floor(Math.random() * 2000) + 1000,
        iot: Math.floor(Math.random() * 3000) + 2000,
        quarantine: Math.floor(Math.random() * 500) + 100,
        dmz: Math.floor(Math.random() * 1000) + 500,
      },
      timeBasedMetrics: {
        hourly: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 500),
        daily: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000) + 5000),
        weekly: Array.from({ length: 52 }, () => Math.floor(Math.random() * 50000) + 25000),
      },
    }
  }

  public getMetrics(): SimulationMetrics {
    return { ...this.metrics }
  }

  public updateMetrics(newData: Partial<SimulationMetrics>): void {
    this.metrics = { ...this.metrics, ...newData }
  }

  public calculatePolicyEffectiveness(policyResults: any[]): number {
    if (policyResults.length === 0) return 0

    const successfulEvaluations = policyResults.filter(
      (result) => result.confidence > 70 && result.executionTime < 100,
    ).length

    return (successfulEvaluations / policyResults.length) * 100
  }

  public generateRealTimeMetrics(): SimulationMetrics {
    // Simulate real-time updates with slight variations
    const currentMetrics = this.getMetrics()

    return {
      ...currentMetrics,
      averageResponseTime: Math.max(5, currentMetrics.averageResponseTime + (Math.random() - 0.5) * 10),
      successRate: Math.min(100, Math.max(90, currentMetrics.successRate + (Math.random() - 0.5) * 2)),
      policiesEvaluated: currentMetrics.policiesEvaluated + Math.floor(Math.random() * 1000),
      blockedDevices: currentMetrics.blockedDevices + Math.floor(Math.random() * 10),
      allowedDevices: currentMetrics.allowedDevices + Math.floor(Math.random() * 100),
    }
  }

  public getRiskTrends(): { timestamp: string; riskScore: number }[] {
    const now = new Date()
    const trends = []

    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      const riskScore = 20 + Math.random() * 60 + Math.sin(i / 4) * 15

      trends.push({
        timestamp: timestamp.toISOString(),
        riskScore: Math.round(riskScore),
      })
    }

    return trends
  }

  public getComplianceHistory(): { date: string; compliant: number; nonCompliant: number }[] {
    const history = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const compliant = 80 + Math.random() * 15
      const nonCompliant = 100 - compliant

      history.push({
        date: date.toISOString().split("T")[0],
        compliant: Math.round(compliant),
        nonCompliant: Math.round(nonCompliant),
      })
    }

    return history
  }

  public getPolicyPerformanceMetrics(policyId: string): {
    evaluations: number
    successRate: number
    averageExecutionTime: number
    impactScore: number
  } {
    return {
      evaluations: Math.floor(Math.random() * 10000) + 1000,
      successRate: 85 + Math.random() * 14,
      averageExecutionTime: Math.floor(Math.random() * 50) + 5,
      impactScore: Math.floor(Math.random() * 100) + 1,
    }
  }

  public simulateNetworkLoad(): {
    timestamp: string
    bandwidth: number
    connections: number
    latency: number
  }[] {
    const data = []
    const now = new Date()

    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000)
      const bandwidth = 50 + Math.random() * 40 + Math.sin(i / 10) * 20
      const connections = Math.floor(100 + Math.random() * 200 + Math.sin(i / 8) * 50)
      const latency = 10 + Math.random() * 30 + Math.sin(i / 6) * 10

      data.push({
        timestamp: timestamp.toISOString(),
        bandwidth: Math.round(bandwidth),
        connections,
        latency: Math.round(latency),
      })
    }

    return data
  }

  public calculateRiskScore(device: any): number {
    let riskScore = 0

    // Base risk based on device type
    const deviceTypeRisk = {
      laptop: 20,
      smartphone: 30,
      tablet: 25,
      iot_device: 50,
      server: 15,
      printer: 40,
    }

    riskScore += deviceTypeRisk[device.type as keyof typeof deviceTypeRisk] || 30

    // Compliance status impact
    if (device.complianceStatus === "non_compliant") riskScore += 30
    else if (device.complianceStatus === "unknown") riskScore += 20

    // User group impact
    if (device.userGroup === "guests") riskScore += 25
    else if (device.userGroup === "contractors") riskScore += 15

    // Location impact
    if (device.location === "remote") riskScore += 20
    else if (device.location === "public") riskScore += 35

    return Math.min(100, Math.max(0, riskScore))
  }

  public analyzeNetworkThreats(networkLoad: number): string {
    if (networkLoad > 90) return "High network congestion detected"
    if (networkLoad > 70) return "Potential network bottleneck"
    return "Network operating within normal parameters"
  }

  public trackPolicyPerformance(policyId: string, success: boolean): void {
    // Implement tracking logic here
  }
}

// Export singleton instance
export const simulationMetrics = SimulationMetricsCalculator.getInstance()

// Export utility functions
export const generateDeviceFingerprint = (device: any): string => {
  const components = [
    device.type,
    device.osVersion,
    device.manufacturer,
    device.model,
    device.macAddress?.substring(0, 8),
  ].filter(Boolean)

  return components
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
}
