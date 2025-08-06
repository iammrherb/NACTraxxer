'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, Cloud, Server, Wifi, Shield, Database, Users } from 'lucide-react'

interface ArchitectureLegendProps {
  currentView: string
}

export default function ArchitectureLegend({ currentView = 'complete' }: ArchitectureLegendProps) {
  const safeCurrentView = currentView || 'complete'
  
  const legendItems = {
    complete: [
      { color: 'bg-blue-500', label: 'Cloud Services', icon: Cloud, description: 'Portnox Cloud NAC components' },
      { color: 'bg-green-500', label: 'Network Infrastructure', icon: Server, description: 'Switches, routers, and access points' },
      { color: 'bg-amber-500', label: 'Connected Devices', icon: Users, description: 'End-user devices and IoT endpoints' },
      { color: 'bg-red-500', label: 'Data Flow', icon: Wifi, description: 'Authentication and policy traffic' }
    ],
    'auth-flow': [
      { color: 'bg-green-500', label: 'Authentication Steps', icon: Shield, description: 'Sequential authentication process' },
      { color: 'bg-green-100', label: 'Process Details', icon: Info, description: 'Detailed step information' }
    ],
    pki: [
      { color: 'bg-purple-700', label: 'Root CA', icon: Shield, description: 'Root Certificate Authority' },
      { color: 'bg-purple-500', label: 'Intermediate CA', icon: Database, description: 'Intermediate Certificate Authorities' },
      { color: 'bg-purple-300', label: 'End Certificates', icon: Users, description: 'Device and user certificates' }
    ]
  }

  const currentLegend = legendItems[safeCurrentView as keyof typeof legendItems] || legendItems.complete

  const technicalDetails = {
    complete: {
      title: 'Complete Architecture Overview',
      details: [
        'Cloud-native NAC deployment with global scalability',
        'Multi-vendor network infrastructure support',
        'Comprehensive device visibility and control',
        'Real-time policy enforcement and monitoring'
      ]
    },
    'auth-flow': {
      title: 'Authentication Flow Process',
      details: [
        '802.1X/EAP-TLS certificate-based authentication',
        'Dynamic VLAN assignment based on device identity',
        'Real-time risk assessment and adaptive access',
        'Continuous monitoring and re-authentication'
      ]
    },
    pki: {
      title: 'PKI Certificate Management',
      details: [
        'Automated certificate lifecycle management',
        'Hardware security module (HSM) integration',
        'SCEP/EST protocol support for enrollment',
        'Real-time certificate revocation checking'
      ]
    }
  }

  const currentDetails = technicalDetails[safeCurrentView as keyof typeof technicalDetails] || technicalDetails.complete

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-600" />
          <span>Architecture Legend</span>
          <Badge variant="outline">
            {safeCurrentView.charAt(0).toUpperCase() + safeCurrentView.slice(1).replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legend Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLegend.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-4 h-4 rounded ${item.color}`} />
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{item.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Technical Details */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-3">{currentDetails.title}</h4>
          <ul className="space-y-2">
            {currentDetails.details.map((detail, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
