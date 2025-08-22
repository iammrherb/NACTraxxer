import { useState } from "react"
import { Shield } from "lucide-react"
import TabNavigation from "./components/TabNavigation"
import SitesManagement from "./components/SitesManagement"
import RolloutProgress from "./components/RolloutProgress"
import SiteWorkbook from "./components/SiteWorkbook"
import ArchitectureDesigner from "./components/ArchitectureDesigner"
import TimelineSchedule from "./components/TimelineSchedule"
import PolicyManagement from "./components/PolicyManagement"
import { ThemeProvider } from "./components/ThemeProvider"

interface DashboardStats {
  sites: number
  policies: number
  events: number
  completedSites: number
  users: number
  devices: number
  complianceScore: number
  threatLevel: number
}

export default function App() {
  const [activeTab, setActiveTab] = useState("sites")
  const [stats] = useState<DashboardStats>({
    sites: 12,
    policies: 45,
    events: 8,
    completedSites: 7,
    users: 156,
    devices: 2341,
    complianceScore: 94,
    threatLevel: 12,
  })

  const renderTabContent = () => {
    switch (activeTab) {
      case "sites":
        return <SitesManagement />
      case "progress":
        return <RolloutProgress />
      case "workbook":
        return <SiteWorkbook />
      case "architecture":
        return <ArchitectureDesigner />
      case "timeline":
        return <TimelineSchedule />
      case "policies":
        return <PolicyManagement />
      default:
        return <SitesManagement />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Portnox NAC Designer</h1>
                <p className="text-sm text-muted-foreground">Network Access Control Architecture Tool</p>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-foreground">{stats.sites}</div>
                  <div className="text-muted-foreground">Sites</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{stats.policies}</div>
                  <div className="text-muted-foreground">Policies</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{stats.devices.toLocaleString()}</div>
                  <div className="text-muted-foreground">Devices</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{stats.complianceScore}%</div>
                  <div className="text-muted-foreground">Compliance</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b bg-card">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {renderTabContent()}
        </main>
      </div>
    </ThemeProvider>
  )
}