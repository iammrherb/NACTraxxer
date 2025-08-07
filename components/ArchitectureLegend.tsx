'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, Smartphone, Wifi, Router, Server, Cloud, Shield, Lock, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function ArchitectureLegend() {
  const deviceTypes = [
    { icon: <Monitor className="h-4 w-4" />, label: 'Workstation/Laptop', description: 'Corporate endpoints' },
    { icon: <Smartphone className="h-4 w-4" />, label: 'Mobile Device', description: 'Smartphones, tablets' },
    { icon: <Wifi className="h-4 w-4" />, label: 'Wireless AP', description: 'Access points' },
    { icon: <Router className="h-4 w-4" />, label: 'Network Switch', description: 'Layer 2/3 switches' },
    { icon: <Server className="h-4 w-4" />, label: 'Server', description: 'Physical/virtual servers' },
    { icon: <Cloud className="h-4 w-4" />, label: 'Cloud Service', description: 'SaaS/cloud platforms' },
    { icon: <Shield className="h-4 w-4" />, label: 'Security Device', description: 'Firewalls, security appliances' }
  ]

  const connectionTypes = [
    { type: 'solid', color: 'border-green-500', label: 'Encrypted Connection', icon: <Lock className="h-3 w-3" /> },
    { type: 'dashed', color: 'border-gray-500', label: 'Unencrypted Connection', icon: <Zap className="h-3 w-3" /> },
    { type: 'solid', color: 'border-blue-500', label: 'RADIUS/Authentication', icon: <Shield className="h-3 w-3" /> },
    { type: 'solid', color: 'border-purple-500', label: 'LDAP/Directory', icon: <Server className="h-3 w-3" /> }
  ]

  const statusIndicators = [
    { color: 'bg-green-500', label: 'Active/Healthy', icon: <CheckCircle className="h-3 w-3" /> },
    { color: 'bg-yellow-500', label: 'Warning/Limited', icon: <AlertTriangle className="h-3 w-3" /> },
    { color: 'bg-red-500', label: 'Error/Blocked', icon: <XCircle className="h-3 w-3" /> },
    { color: 'bg-gray-500', label: 'Inactive/Offline', icon: <XCircle className="h-3 w-3" /> }
  ]

  const vendorColors = [
    { vendor: 'Portnox', color: 'bg-[#00c8d7]', textColor: 'text-white' },
    { vendor: 'Cisco', color: 'bg-blue-600', textColor: 'text-white' },
    { vendor: 'Aruba', color: 'bg-orange-500', textColor: 'text-white' },
    { vendor: 'Microsoft', color: 'bg-blue-500', textColor: 'text-white' },
    { vendor: 'Fortinet', color: 'bg-red-600', textColor: 'text-white' },
    { vendor: 'Palo Alto', color: 'bg-orange-600', textColor: 'text-white' }
  ]

  const protocols = [
    { name: '802.1X', description: 'Port-based network access control' },
    { name: 'EAP-TLS', description: 'Certificate-based authentication' },
    { name: 'RADIUS', description: 'Remote authentication protocol' },
    { name: 'RADSEC', description: 'RADIUS over TLS/TCP' },
    { name: 'TACACS+', description: 'Terminal access authentication' },
    { name: 'LDAP', description: 'Directory access protocol' },
    { name: 'SCEP', description: 'Certificate enrollment protocol' },
    { name: 'FSSO', description: 'Fortinet Single Sign-On' },
    { name: 'User-ID', description: 'Palo Alto user identification' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Device Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Monitor className="h-5 w-5 text-[#00c8d7]" />
            <span>Device Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deviceTypes.map((device, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                {device.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {device.label}
                </div>
                <div className="text-xs text-gray-500">
                  {device.description}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Connection Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-5 w-5 text-[#00c8d7]" />
            <span>Connections</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {connectionTypes.map((connection, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div 
                  className={`w-8 h-0.5 ${connection.color} ${
                    connection.type === 'dashed' ? 'border-dashed border-t-2' : 'bg-current'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-2">
                {connection.icon}
                <div className="text-sm font-medium text-gray-900">
                  {connection.label}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-[#00c8d7]" />
            <span>Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusIndicators.map((status, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${status.color}`} />
              <div className="flex items-center space-x-2">
                <div className="text-gray-600">
                  {status.icon}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {status.label}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Vendor Colors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#00c8d7]" />
            <span>Vendors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {vendorColors.map((vendor, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Badge className={`${vendor.color} ${vendor.textColor} text-xs px-2 py-1`}>
                {vendor.vendor}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Protocols */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Lock className="h-5 w-5 text-[#00c8d7]" />
            <span>Protocols & Standards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {protocols.map((protocol, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge variant="outline" className="text-xs font-mono">
                  {protocol.name}
                </Badge>
                <div className="text-sm text-gray-600 flex-1">
                  {protocol.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Flow */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-5 w-5 text-[#00c8d7]" />
            <span>Authentication Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-[#00c8d7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="text-sm">
                <span className="font-medium">Device Connection:</span> Endpoint connects to network
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-[#00c8d7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="text-sm">
                <span className="font-medium">802.1X Request:</span> Network device requests authentication
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-[#00c8d7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="text-sm">
                <span className="font-medium">Certificate Validation:</span> Portnox validates device certificate
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-[#00c8d7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div className="text-sm">
                <span className="font-medium">Policy Evaluation:</span> Access policies are evaluated
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-[#00c8d7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
              <div className="text-sm">
                <span className="font-medium">Network Access:</span> VLAN assignment and access granted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
