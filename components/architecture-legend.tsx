'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ArchitectureLegendProps {
  view: string
  cloudProvider: string
  networkVendor: string
}

export default function ArchitectureLegend({ view, cloudProvider, networkVendor }: ArchitectureLegendProps) {
  const legendItems = [
    { type: 'cloud', color: '#3B82F6', label: 'Cloud Services', description: 'Portnox Cloud platform and services' },
    { type: 'proxy', color: '#10B981', label: 'RADSec Proxy', description: 'On-premises RADIUS proxy components' },
    { type: 'network', color: '#F59E0B', label: 'Network Infrastructure', description: 'Switches, APs, and network devices' },
    { type: 'security', color: '#EF4444', label: 'Security Components', description: 'Firewalls, PKI, and security services' },
    { type: 'endpoint', color: '#8B5CF6', label: 'Endpoints', description: 'User devices and workstations' },
    { type: 'identity', color: '#06B6D4', label: 'Identity Providers', description: 'Active Directory, Azure AD, LDAP' },
    { type: 'service', color: '#84CC16', label: 'Services', description: 'SCEP, certificate services' },
    { type: 'database', color: '#F97316', label: 'Data Stores', description: 'Certificate stores and databases' }
  ]

  const getViewSpecificInfo = () => {
    switch (view) {
      case 'complete':
        return {
          title: 'Complete Architecture Legend',
          description: 'Full NAC deployment showing all components and their relationships'
        }
      case 'auth-flow':
        return {
          title: 'Authentication Flow Legend',
          description: 'Step-by-step 802.1X authentication process'
        }
      case 'pki':
        return {
          title: 'PKI Architecture Legend',
          description: 'Certificate authority hierarchy and certificate management'
        }
      default:
        return {
          title: 'Architecture Legend',
          description: 'Component types and their meanings'
        }
    }
  }

  const viewInfo = getViewSpecificInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{viewInfo.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{viewInfo.description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {legendItems.map((item) => (
            <div key={item.type} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Current Configuration</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Cloud: {cloudProvider.toUpperCase()}</Badge>
            <Badge variant="outline">Network: {networkVendor}</Badge>
            <Badge variant="outline">View: {view}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
