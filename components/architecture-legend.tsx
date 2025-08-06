'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ArchitectureLegendProps {
  view: string
  cloudProvider: string
  networkVendor: string
}

export default function ArchitectureLegend({ view, cloudProvider, networkVendor }: ArchitectureLegendProps) {
  const getCloudColor = (provider: string): string => {
    switch (provider) {
      case 'aws': return '#fff3e0'
      case 'azure': return '#e1f5fe'
      case 'gcp': return '#e8f5e9'
      case 'onprem': return '#ffeaa7'
      default: return '#f5f5f5'
    }
  }

  const legendItems = [
    {
      color: '#e3f2fd',
      label: 'Portnox Cloud Services',
      description: 'Cloud-based NAC engine and PKI services',
      icon: '☁️'
    },
    {
      color: getCloudColor(cloudProvider),
      label: `${cloudProvider.toUpperCase()} Infrastructure`,
      description: 'RADSec proxy containers and load balancers',
      icon: cloudProvider === 'aws' ? '🟠' : cloudProvider === 'azure' ? '🔷' : cloudProvider === 'gcp' ? '🌐' : '🏢'
    },
    {
      color: '#e8f5e9',
      label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Network`,
      description: 'Network infrastructure and access points',
      icon: '🔧'
    },
    {
      color: '#e1f5fe',
      label: 'Microsoft Intune',
      description: 'Mobile device management and certificate deployment',
      icon: '📱'
    },
    {
      color: '#f5f5f5',
      label: 'Endpoint Devices',
      description: 'Corporate devices with certificates',
      icon: '💻'
    }
  ]

  const connectionTypes = [
    {
      type: 'secure',
      color: '#10b981',
      label: 'Secure/Encrypted',
      description: 'TLS encrypted connections (RADSec, HTTPS)',
      pattern: 'solid',
      width: 4
    },
    {
      type: 'standard',
      color: '#3b82f6',
      label: 'Standard Connection',
      description: 'Standard network connections (RADIUS, HTTP)',
      pattern: 'solid',
      width: 3
    },
    {
      type: 'dashed',
      color: '#f59e0b',
      label: 'Control/Management',
      description: 'Management and control plane traffic',
      pattern: 'dashed',
      width: 3
    }
  ]

  const statusIndicators = [
    {
      color: '#10b981',
      label: 'Active',
      description: 'Component is active and handling traffic'
    },
    {
      color: '#f59e0b',
      label: 'Standby',
      description: 'Component is in standby mode for failover'
    },
    {
      color: '#ef4444',
      label: 'Offline',
      description: 'Component is offline or unreachable'
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Component Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Architecture Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connection Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectionTypes.map((conn, index) => (
              <div key={index} className="flex items-center space-x-3">
                <svg width="40" height="20" className="flex-shrink-0">
                  <line
                    x1="0"
                    y1="10"
                    x2="40"
                    y2="10"
                    stroke={conn.color}
                    strokeWidth={conn.width}
                    strokeDasharray={conn.pattern === 'dashed' ? '5,5' : 'none'}
                  />
                  <polygon
                    points="35,6 40,10 35,14"
                    fill={conn.color}
                  />
                </svg>
                <div className="flex-1">
                  <div className="font-medium text-sm">{conn.label}</div>
                  <div className="text-xs text-muted-foreground">{conn.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusIndicators.map((status, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: status.color }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{status.label}</div>
                  <div className="text-xs text-muted-foreground">{status.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* View-specific information */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Current View: {view}</h4>
            <div className="text-xs text-muted-foreground">
              {view === 'complete' && 'Complete end-to-end NAC architecture with all components'}
              {view === 'auth-flow' && 'Step-by-step authentication flow from device to cloud'}
              {view === 'pki' && 'Certificate management and PKI infrastructure components'}
              {view === 'radsec-proxy' && 'Detailed RADSec proxy architecture with containers'}
              {view === 'policies' && 'NAC policy framework and enforcement points'}
              {view === 'connectivity' && 'Network connectivity options and patterns'}
              {view === 'intune' && 'Microsoft Intune integration for certificate deployment'}
              {view === 'onboarding' && 'Device enrollment and onboarding workflows'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
