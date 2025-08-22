import { useState } from "react"
import { Shield } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState("dashboard")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Portnox NAC Designer</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Network Access Control</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Sites</h3>
            <div className="text-2xl font-bold text-gray-900">{stats.sites}</div>
            <p className="text-xs text-gray-500">+20.1% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Policies</h3>
            <div className="text-2xl font-bold text-gray-900">{stats.policies}</div>
            <p className="text-xs text-gray-500">+180.1% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Connected Devices</h3>
            <div className="text-2xl font-bold text-gray-900">{stats.devices}</div>
            <p className="text-xs text-gray-500">+19% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Compliance Score</h3>
            <div className="text-2xl font-bold text-gray-900">{stats.complianceScore}%</div>
            <p className="text-xs text-gray-500">+2.1% from last month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome to Portnox NAC Designer</h3>
          <p className="text-gray-600">
            Your Network Access Control architecture design tool is now ready. 
            Use this platform to design, manage, and deploy NAC solutions across your organization.
          </p>
        </div>
      </div>
    </div>
  )
}