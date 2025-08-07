'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

interface ArchitectureLegendProps {
  view: string
}

export default function ArchitectureLegend({ view }: ArchitectureLegendProps) {
  const getLegendItems = () => {
    switch (view) {
      case 'complete':
        return [
          { color: '#e3f2fd', label: 'Portnox Cloud', description: 'NAC Engine' },
          { color: '#e1f5fe', label: 'Cloud Proxy', description: 'RADSec Proxy' },
          { color: '#f3e5f5', label: 'Site Infrastructure', description: 'Local Network' },
          { color: '#fff3e0', label: 'MDM Integration', description: 'Device Management' },
          { color: '#f5f5f5', label: 'Endpoints', description: 'User Devices' }
        ]
      case 'auth-flow':
        return [
          { color: '#e8f5e9', label: 'Device/NAS', description: 'Network Access' },
          { color: '#e1f5fe', label: 'Cloud Proxy', description: 'RADIUS Proxy' },
          { color: '#e3f2fd', label: 'Portnox Cloud', description: 'Authentication' },
          { color: '#fff3e0', label: 'Identity Provider', description: 'User Directory' }
        ]
      case 'pki':
        return [
          { color: '#e3f2fd', label: 'Private CA', description: 'Certificate Authority' },
          { color: '#fff3e0', label: 'SCEP/OCSP', description: 'Certificate Services' },
          { color: '#e8f5e9', label: 'Devices', description: 'Certificate Recipients' }
        ]
      case 'policies':
        return [
          { color: '#e3f2fd', label: 'Policy Engine', description: 'Decision Point' },
          { color: '#d4edda', label: 'User Policies', description: 'Identity-based' },
          { color: '#cce5ff', label: 'Device Policies', description: 'Device-based' },
          { color: '#fff3cd', label: 'Network Policies', description: 'Location-based' },
          { color: '#f8d7da', label: 'Compliance', description: 'Security-based' }
        ]
      case 'connectivity':
        return [
          { color: '#e3f2fd', label: 'Portnox Cloud', description: 'Central Service' },
          { color: '#fff3e0', label: 'AWS Proxy', description: 'Amazon Cloud' },
          { color: '#e1f5fe', label: 'Azure Proxy', description: 'Microsoft Cloud' },
          { color: '#e8f5e9', label: 'GCP Proxy', description: 'Google Cloud' },
          { color: '#ffeaa7', label: 'On-Prem Proxy', description: 'Local Deployment' }
        ]
      case 'intune':
        return [
          { color: '#e3f2fd', label: 'Portnox PKI', description: 'Certificate Authority' },
          { color: '#e1f5fe', label: 'Microsoft Intune', description: 'MDM Platform' },
          { color: '#e8f5e9', label: 'Managed Devices', description: 'Corporate Endpoints' }
        ]
      case 'onboarding':
        return [
          { color: '#e3f2fd', label: 'Onboarding Portal', description: 'Self-Service' },
          { color: '#d4edda', label: 'Corporate Flow', description: 'Managed Devices' },
          { color: '#cce5ff', label: 'BYOD Flow', description: 'Personal Devices' },
          { color: '#fff3cd', label: 'Guest Flow', description: 'Visitor Access' },
          { color: '#f8d7da', label: 'IoT Flow', description: 'Device Registration' }
        ]
      default:
        return []
    }
  }

  const connectionTypes = [
    { type: 'standard', label: 'Standard Connection', style: 'solid' },
    { type: 'secure', label: 'Secure/Encrypted', style: 'dashed', color: '#10b981' },
    { type: 'dashed', label: 'Logical Connection', style: 'dashed' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Info className="h-4 w-4" />
          <span>Legend</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Components</h4>
          <div className="space-y-2">
            {getLegendItems().map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Connections</h4>
          <div className="space-y-2">
            {connectionTypes.map((conn, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-gray-400" style={{
                  borderStyle: conn.style,
                  borderWidth: conn.style === 'dashed' ? '0 0 1px 0' : '0',
                  backgroundColor: conn.color || '#6b7280'
                }} />
                <div className="text-sm">{conn.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">
            Click components for details. Double-click to create custom connections.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
