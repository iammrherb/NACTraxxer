"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Building, CheckCircle, AlertCircle, XCircle, Play, RefreshCw } from "lucide-react"
import { storage } from "@/lib/storage"

interface RolloutPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "not-started" | "in-progress" | "completed" | "delayed" | "blocked"
  progress: number
  sites: string[]
  dependencies: string[]
  milestones: Milestone[]
  risks: Risk[]
}

interface Milestone {
  id: string
  name: string
  date: string
  status: "pending" | "completed" | "overdue"
  description: string
}

interface Risk {
  id: string
  description: string
  level: "low" | "medium" | "high" | "critical"
  mitigation: string
  status: "open" | "mitigated" | "closed"
}

interface RolloutSite {
  id: string
  name: string
  location: string
  phase: string
  status: "not-started" | "planning" | "in-progress" | "testing" | "completed" | "delayed"
  progress: number
  startDate: string
  goLiveDate: string
  users: number
  devices: number
  lastUpdate: string
}

export default function RolloutProgress() {
  const [phases, setPhases] = useState<RolloutPhase[]>([])
  const [sites, setSites] = useState<RolloutSite[]>([])
  const [selectedPhase, setSelectedPhase] = useState<string>("")
  const [overallProgress, setOverallProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRolloutData()

    const handleDemoDataLoaded = () => {
      console.log("[v0] Demo data loaded, refreshing rollout progress...")
      loadRolloutData()
    }

    window.addEventListener("demoDataLoaded", handleDemoDataLoaded)

    return () => {
      window.removeEventListener("demoDataLoaded", handleDemoDataLoaded)
    }
  }, [])

  const loadRolloutData = async () => {
    setLoading(true)
    try {
      console.log("[v0] Loading rollout data...")

      // Load from storage
      const storedSites = await storage.getSites()
      const storedEvents = await storage.getEvents()

      console.log(`[v0] Loaded ${storedSites.length} sites and ${storedEvents.length} events from storage`)

      if (storedSites.length > 0) {
        console.log(
          "[v0] First few sites:",
          storedSites.slice(0, 3).map((s) => ({ id: s.id, name: s.name })),
        )
      }
      if (storedEvents.length > 0) {
        console.log(
          "[v0] First few events:",
          storedEvents.slice(0, 3).map((e) => ({ id: e.id, title: e.title })),
        )
      }

      if (storedSites.length > 0) {
        // Generate rollout data based on stored sites and events
        await generateRolloutFromData(storedSites, storedEvents)
      } else {
        console.log("[v0] No stored data found, generating demo data...")
        // Generate demo rollout data if no data exists
        await generateDemoRolloutData()
      }
    } catch (error) {
      console.error("[v0] Error loading rollout data:", error)
      // Fallback to demo data
      await generateDemoRolloutData()
    } finally {
      setLoading(false)
    }
  }

  const generateRolloutFromData = async (sitesData: any[], eventsData: any[]) => {
    const currentDate = new Date()
    console.log("[v0] Generating rollout data from stored sites and events...")

    // Create standard phases based on actual data
    const generatedPhases: RolloutPhase[] = [
      {
        id: "phase-1",
        name: "Project Initiation",
        description: "Project kickoff, requirements gathering, and initial planning",
        startDate: new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "completed",
        progress: 100,
        sites: [],
        dependencies: [],
        milestones: [
          {
            id: "m1-1",
            name: "Project Charter Approved",
            date: new Date(currentDate.getTime() - 85 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Executive approval and budget allocation",
          },
          {
            id: "m1-2",
            name: "Team Assembly Complete",
            date: new Date(currentDate.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Core project team identified and onboarded",
          },
        ],
        risks: [
          {
            id: "r1-1",
            description: "Stakeholder alignment challenges",
            level: "medium",
            mitigation: "Regular steering committee meetings and clear communication plan",
            status: "closed",
          },
        ],
      },
      {
        id: "phase-2",
        name: "Infrastructure Assessment",
        description: "Network discovery, current state analysis, and gap identification",
        startDate: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "completed",
        progress: 100,
        sites: sitesData.slice(0, Math.min(3, sitesData.length)).map((s) => s.id),
        dependencies: ["phase-1"],
        milestones: [
          {
            id: "m2-1",
            name: "Network Discovery Complete",
            date: new Date(currentDate.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "All network devices and topology mapped",
          },
          {
            id: "m2-2",
            name: "Gap Analysis Report",
            date: new Date(currentDate.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Infrastructure gaps and upgrade requirements identified",
          },
        ],
        risks: [
          {
            id: "r2-1",
            description: "Legacy system compatibility issues",
            level: "high",
            mitigation: "Detailed compatibility testing and phased migration approach",
            status: "mitigated",
          },
        ],
      },
      {
        id: "phase-3",
        name: "Design & Planning",
        description: "Solution architecture design and detailed implementation planning",
        startDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "completed",
        progress: 95,
        sites: sitesData.slice(0, Math.min(4, sitesData.length)).map((s) => s.id),
        dependencies: ["phase-2"],
        milestones: [
          {
            id: "m3-1",
            name: "Architecture Design Complete",
            date: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Detailed technical architecture and design documents",
          },
          {
            id: "m3-2",
            name: "Implementation Plan Finalized",
            date: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Detailed rollout schedule and resource allocation",
          },
        ],
        risks: [
          {
            id: "r3-1",
            description: "Design complexity may impact timeline",
            level: "medium",
            mitigation: "Simplified design approach and parallel workstreams",
            status: "open",
          },
        ],
      },
      {
        id: "phase-4",
        name: "Pilot Implementation",
        description: "Pilot deployment at selected sites for validation and testing",
        startDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "in-progress",
        progress: 65,
        sites: sitesData.slice(0, Math.min(2, sitesData.length)).map((s) => s.id),
        dependencies: ["phase-3"],
        milestones: [
          {
            id: "m4-1",
            name: "Pilot Sites Prepared",
            date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "completed",
            description: "Infrastructure upgrades completed at pilot sites",
          },
          {
            id: "m4-2",
            name: "NAC Platform Deployed",
            date: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: "Portnox NAC platform installed and configured",
          },
        ],
        risks: [
          {
            id: "r4-1",
            description: "User adoption challenges during pilot",
            level: "medium",
            mitigation: "Comprehensive training program and change management",
            status: "open",
          },
        ],
      },
      {
        id: "phase-5",
        name: "Production Rollout",
        description: "Phased production deployment across all remaining sites",
        startDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(currentDate.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "not-started",
        progress: 0,
        sites: sitesData.slice(2).map((s) => s.id),
        dependencies: ["phase-4"],
        milestones: [
          {
            id: "m5-1",
            name: "Wave 1 Deployment",
            date: new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: "First wave of production sites",
          },
          {
            id: "m5-2",
            name: "Wave 2 Deployment",
            date: new Date(currentDate.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: "Second wave of production sites",
          },
        ],
        risks: [
          {
            id: "r5-1",
            description: "Scaling challenges across multiple sites",
            level: "high",
            mitigation: "Automated deployment tools and dedicated support teams",
            status: "open",
          },
        ],
      },
    ]

    // Generate site rollout status based on actual sites
    const generatedSites: RolloutSite[] = sitesData.map((site, index) => ({
      id: site.id,
      name: site.name,
      location: site.location,
      phase: `Phase ${Math.min(Math.floor(index / 2) + 1, 5)}`,
      status:
        site.status === "completed"
          ? "completed"
          : site.status === "implementation"
            ? "in-progress"
            : site.status === "testing"
              ? "testing"
              : site.status === "design"
                ? "planning"
                : "not-started",
      progress: site.progress || (index < 2 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30)),
      startDate:
        site.startDate || new Date(currentDate.getTime() + index * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      goLiveDate:
        site.targetDate ||
        new Date(currentDate.getTime() + (index * 7 + 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      users: site.users || Math.floor(Math.random() * 1000) + 100,
      devices: site.devices || Math.floor(Math.random() * 2000) + 200,
      lastUpdate: new Date(currentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }))

    setPhases(generatedPhases)
    setSites(generatedSites)
    setSelectedPhase(generatedPhases[3]?.id || generatedPhases[0]?.id || "")

    // Calculate overall progress
    const totalProgress = generatedPhases.reduce((sum, phase) => sum + phase.progress, 0)
    setOverallProgress(Math.floor(totalProgress / generatedPhases.length))

    console.log(
      `[v0] Generated ${generatedPhases.length} phases and ${generatedSites.length} sites for rollout tracking`,
    )
  }

  const generateDemoRolloutData = async () => {
    console.log("[v0] Generating demo rollout data...")
    const currentDate = new Date()

    const demoPhases: RolloutPhase[] = [
      {
        id: "phase-1",
        name: "Project Initiation",
        description: "Project kickoff, requirements gathering, and initial planning",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        status: "completed",
        progress: 100,
        sites: [],
        dependencies: [],
        milestones: [
          {
            id: "m1-1",
            name: "Project Charter Approved",
            date: "2024-01-20",
            status: "completed",
            description: "Executive approval and budget allocation",
          },
          {
            id: "m1-2",
            name: "Team Assembly Complete",
            date: "2024-01-25",
            status: "completed",
            description: "Core project team identified and onboarded",
          },
          {
            id: "m1-3",
            name: "Requirements Finalized",
            date: "2024-02-10",
            status: "completed",
            description: "Technical and business requirements documented",
          },
        ],
        risks: [
          {
            id: "r1-1",
            description: "Stakeholder alignment challenges",
            level: "medium",
            mitigation: "Regular steering committee meetings and clear communication plan",
            status: "closed",
          },
        ],
      },
      {
        id: "phase-2",
        name: "Infrastructure Assessment",
        description: "Network discovery, current state analysis, and gap identification",
        startDate: "2024-02-16",
        endDate: "2024-03-30",
        status: "completed",
        progress: 100,
        sites: ["demo-site-1", "demo-site-2", "demo-site-3"],
        dependencies: ["phase-1"],
        milestones: [
          {
            id: "m2-1",
            name: "Network Discovery Complete",
            date: "2024-02-28",
            status: "completed",
            description: "All network devices and topology mapped",
          },
          {
            id: "m2-2",
            name: "Gap Analysis Report",
            date: "2024-03-15",
            status: "completed",
            description: "Infrastructure gaps and upgrade requirements identified",
          },
          {
            id: "m2-3",
            name: "Remediation Plan Approved",
            date: "2024-03-25",
            status: "completed",
            description: "Infrastructure upgrade plan approved by stakeholders",
          },
        ],
        risks: [
          {
            id: "r2-1",
            description: "Legacy system compatibility issues",
            level: "high",
            mitigation: "Detailed compatibility testing and phased migration approach",
            status: "mitigated",
          },
        ],
      },
      {
        id: "phase-3",
        name: "Design & Planning",
        description: "Solution architecture design and detailed implementation planning",
        startDate: "2024-04-01",
        endDate: "2024-05-15",
        status: "completed",
        progress: 95,
        sites: ["demo-site-1", "demo-site-2", "demo-site-3", "demo-site-4"],
        dependencies: ["phase-2"],
        milestones: [
          {
            id: "m3-1",
            name: "Architecture Design Complete",
            date: "2024-04-20",
            status: "completed",
            description: "Detailed technical architecture and design documents",
          },
          {
            id: "m3-2",
            name: "Implementation Plan Finalized",
            date: "2024-05-05",
            status: "completed",
            description: "Detailed rollout schedule and resource allocation",
          },
          {
            id: "m3-3",
            name: "Security Review Passed",
            date: "2024-05-12",
            status: "pending",
            description: "Security architecture review and approval",
          },
        ],
        risks: [
          {
            id: "r3-1",
            description: "Design complexity may impact timeline",
            level: "medium",
            mitigation: "Simplified design approach and parallel workstreams",
            status: "open",
          },
        ],
      },
      {
        id: "phase-4",
        name: "Pilot Implementation",
        description: "Pilot deployment at selected sites for validation and testing",
        startDate: "2024-05-16",
        endDate: "2024-07-30",
        status: "in-progress",
        progress: 65,
        sites: ["demo-site-1", "demo-site-2"],
        dependencies: ["phase-3"],
        milestones: [
          {
            id: "m4-1",
            name: "Pilot Sites Prepared",
            date: "2024-06-01",
            status: "completed",
            description: "Infrastructure upgrades completed at pilot sites",
          },
          {
            id: "m4-2",
            name: "NAC Platform Deployed",
            date: "2024-06-15",
            status: "completed",
            description: "Portnox NAC platform installed and configured",
          },
          {
            id: "m4-3",
            name: "User Acceptance Testing",
            date: "2024-07-20",
            status: "pending",
            description: "End-user testing and feedback collection",
          },
        ],
        risks: [
          {
            id: "r4-1",
            description: "User adoption challenges during pilot",
            level: "medium",
            mitigation: "Comprehensive training program and change management",
            status: "open",
          },
        ],
      },
      {
        id: "phase-5",
        name: "Production Rollout",
        description: "Phased production deployment across all remaining sites",
        startDate: "2024-08-01",
        endDate: "2024-12-15",
        status: "not-started",
        progress: 0,
        sites: ["demo-site-3", "demo-site-4", "demo-site-5", "demo-site-6"],
        dependencies: ["phase-4"],
        milestones: [
          {
            id: "m5-1",
            name: "Wave 1 Deployment",
            date: "2024-09-15",
            status: "pending",
            description: "First wave of production sites (3 sites)",
          },
          {
            id: "m5-2",
            name: "Wave 2 Deployment",
            date: "2024-11-01",
            status: "pending",
            description: "Second wave of production sites (3 sites)",
          },
          {
            id: "m5-3",
            name: "Final Wave Deployment",
            date: "2024-12-10",
            status: "pending",
            description: "Final production sites deployment",
          },
        ],
        risks: [
          {
            id: "r5-1",
            description: "Scaling challenges across multiple sites",
            level: "high",
            mitigation: "Automated deployment tools and dedicated support teams",
            status: "open",
          },
        ],
      },
      {
        id: "phase-6",
        name: "Optimization & Closure",
        description: "Performance optimization, documentation, and project closure",
        startDate: "2024-12-16",
        endDate: "2025-02-28",
        status: "not-started",
        progress: 0,
        sites: [],
        dependencies: ["phase-5"],
        milestones: [
          {
            id: "m6-1",
            name: "Performance Optimization",
            date: "2025-01-15",
            status: "pending",
            description: "System performance tuning and optimization",
          },
          {
            id: "m6-2",
            name: "Documentation Complete",
            date: "2025-02-15",
            status: "pending",
            description: "All project documentation finalized",
          },
          {
            id: "m6-3",
            name: "Project Closure",
            date: "2025-02-28",
            status: "pending",
            description: "Project formally closed and handed over to operations",
          },
        ],
        risks: [
          {
            id: "r6-1",
            description: "Knowledge transfer gaps",
            level: "medium",
            mitigation: "Comprehensive documentation and training programs",
            status: "open",
          },
        ],
      },
    ]

    const demoSites: RolloutSite[] = [
      {
        id: "demo-site-1",
        name: "Global Headquarters",
        location: "New York, NY",
        phase: "Phase 4 - Pilot",
        status: "in-progress",
        progress: 85,
        startDate: "2024-05-16",
        goLiveDate: "2024-07-15",
        users: 2500,
        devices: 5000,
        lastUpdate: "2024-06-20",
      },
      {
        id: "demo-site-2",
        name: "Chicago Regional Office",
        location: "Chicago, IL",
        phase: "Phase 4 - Pilot",
        status: "testing",
        progress: 75,
        startDate: "2024-06-01",
        goLiveDate: "2024-07-30",
        users: 450,
        devices: 800,
        lastUpdate: "2024-06-18",
      },
      {
        id: "demo-site-3",
        name: "West Coast Branch",
        location: "San Francisco, CA",
        phase: "Phase 5 - Wave 1",
        status: "planning",
        progress: 25,
        startDate: "2024-08-15",
        goLiveDate: "2024-09-30",
        users: 280,
        devices: 520,
        lastUpdate: "2024-06-15",
      },
      {
        id: "demo-site-4",
        name: "Manufacturing Facility",
        location: "Detroit, MI",
        phase: "Phase 5 - Wave 1",
        status: "not-started",
        progress: 0,
        startDate: "2024-09-01",
        goLiveDate: "2024-10-15",
        users: 800,
        devices: 2400,
        lastUpdate: "2024-06-10",
      },
      {
        id: "demo-site-5",
        name: "R&D Center",
        location: "Seattle, WA",
        phase: "Phase 5 - Wave 2",
        status: "not-started",
        progress: 0,
        startDate: "2024-10-15",
        goLiveDate: "2024-11-30",
        users: 350,
        devices: 700,
        lastUpdate: "2024-06-05",
      },
      {
        id: "demo-site-6",
        name: "Sales Office",
        location: "Atlanta, GA",
        phase: "Phase 5 - Wave 2",
        status: "not-started",
        progress: 0,
        startDate: "2024-11-01",
        goLiveDate: "2024-12-15",
        users: 200,
        devices: 400,
        lastUpdate: "2024-06-01",
      },
    ]

    setPhases(demoPhases)
    setSites(demoSites)
    setSelectedPhase("phase-4")
    setOverallProgress(52)

    console.log(`[v0] Generated ${demoPhases.length} demo phases and ${demoSites.length} demo sites`)
  }

  const handleRefresh = () => {
    console.log("[v0] Manual refresh triggered")
    loadRolloutData()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "testing":
        return "bg-purple-100 text-purple-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-orange-100 text-orange-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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

  const selectedPhaseData = phases.find((p) => p.id === selectedPhase)

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Rollout Progress</CardTitle>
            <CardDescription>Loading rollout progress data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading rollout data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phases.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Rollout Progress</CardTitle>
            <CardDescription>
              No rollout data available. Load demo data or create sites to see rollout progress and timeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Generate demo data to populate the rollout progress tracker</p>
              <div className="space-x-2">
                <Button onClick={generateDemoRolloutData}>Generate Demo Rollout Data</Button>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rollout Progress</h2>
          <p className="text-gray-600">Track deployment progress across all phases and sites</p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Overall Rollout Progress
          </CardTitle>
          <CardDescription>Zero Trust NAC deployment across all sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Project Completion</span>
              <span className="text-sm text-gray-500">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {phases.filter((p) => p.status === "completed").length}
                </div>
                <div className="text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {phases.filter((p) => p.status === "in-progress").length}
                </div>
                <div className="text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {phases.filter((p) => p.status === "not-started").length}
                </div>
                <div className="text-gray-500">Not Started</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {phases.filter((p) => p.status === "delayed").length}
                </div>
                <div className="text-gray-500">Delayed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          <div className="grid gap-4">
            {phases.map((phase) => (
              <Card
                key={phase.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedPhase === phase.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(phase.status)}
                      {phase.name}
                    </CardTitle>
                    <Badge className={getStatusColor(phase.status)}>{phase.status.replace("-", " ")}</Badge>
                  </div>
                  <CardDescription>{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <div>{new Date(phase.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">End Date:</span>
                        <div>{new Date(phase.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {phase.sites.length > 0 && (
                      <div>
                        <span className="text-gray-500 text-sm">Sites ({phase.sites.length}):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {phase.sites.slice(0, 5).map((siteId) => {
                            const site = sites.find((s) => s.id === siteId)
                            return (
                              <Badge key={siteId} variant="outline" className="text-xs">
                                {site?.name || siteId}
                              </Badge>
                            )
                          })}
                          {phase.sites.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{phase.sites.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Phase Details */}
          {selectedPhaseData && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPhaseData.name} - Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="milestones">
                  <TabsList>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                  </TabsList>

                  <TabsContent value="milestones" className="space-y-4">
                    {selectedPhaseData.milestones.length > 0 ? (
                      selectedPhaseData.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded">
                          {milestone.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : milestone.status === "overdue" ? (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{milestone.name}</div>
                            <div className="text-sm text-gray-500">{milestone.description}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Due: {new Date(milestone.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No milestones defined for this phase</div>
                    )}
                  </TabsContent>

                  <TabsContent value="risks" className="space-y-4">
                    {selectedPhaseData.risks.length > 0 ? (
                      selectedPhaseData.risks.map((risk) => (
                        <div key={risk.id} className="p-3 border rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium">{risk.description}</div>
                            <div className="flex gap-2">
                              <Badge className={getRiskColor(risk.level)}>{risk.level}</Badge>
                              <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No risks identified for this phase</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <div className="grid gap-4">
            {sites.length > 0 ? (
              sites.map((site) => (
                <Card key={site.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {site.name}
                      </CardTitle>
                      <Badge className={getStatusColor(site.status)}>{site.status.replace("-", " ")}</Badge>
                    </div>
                    <CardDescription>
                      {site.location} • {site.phase}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Deployment Progress</span>
                        <span>{site.progress}%</span>
                      </div>
                      <Progress value={site.progress} />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Users:</span>
                          <div className="font-medium">{site.users.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Devices:</span>
                          <div className="font-medium">{site.devices.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Go-Live:</span>
                          <div className="font-medium">{new Date(site.goLiveDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Update:</span>
                          <div className="font-medium">{new Date(site.lastUpdate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sites available for rollout tracking</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Visual timeline of all phases and key milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="relative">
                    {index < phases.length - 1 && <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200" />}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === "completed"
                            ? "bg-green-100"
                            : phase.status === "in-progress"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {getStatusIcon(phase.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{phase.name}</h4>
                          <Badge className={getStatusColor(phase.status)}>{phase.status.replace("-", " ")}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(phase.startDate).toLocaleDateString()} -{" "}
                            {new Date(phase.endDate).toLocaleDateString()}
                          </span>
                          <span>{phase.progress}% complete</span>
                          {phase.sites.length > 0 && <span>{phase.sites.length} sites</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
