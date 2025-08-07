'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Cloud, Network, Server, Database, Lock, Users, Settings, Smartphone, Globe, Key, FileText, Zap, Eye, AlertTriangle } from 'lucide-react'

interface ArchitectureLegendProps {
  config: {
    cloudProvider: string
    networkVendor: string
    authMethod: string
    connectivity: string
    mfaEnabled: boolean
    guestAccess: boolean
    byodSupport: boolean
    complianceMode: string
  }
}

export default function ArchitectureLegend({ config }: ArchitectureLegendProps) {
  const componentTypes = [
    {
      type: 'endpoint',
      label: 'Endpoints',
      color: '#4F46E5',
      icon: <Smartphone className="w-4 h-4" />,
      description: 'User devices and endpoints',
      examples: ['Corporate Devices', 'BYOD Devices', 'IoT Devices']
    },
    {
      type: 'network',
      label: 'Network Infrastructure',
      color: '#059669',
      icon: <Network className="w-4 h-4" />,
      description: 'Network access layer components',
      examples: ['Switches', 'Wireless APs', 'Routers']
    },
    {
      type: 'nac',
      label: 'NAC Platform',
      color: '#00c8d7',
      icon: <Shield className="w-4 h-4" />,
      description: 'Portnox NAC components',
      examples: ['Portnox Cloud', 'RADIUS Server', 'Policy Engine']
    },
    {
      type: 'identity',
      label: 'Identity Providers',
      color: '#0078D4',
      icon: <Users className="w-4 h-4" />,
      description: 'User authentication systems',
      examples: ['Azure AD', 'Active Directory', 'LDAP']
    },
    {
      type: 'mdm',
      label: 'Device Management',
      color: '#7C3AED',
      icon: <Settings className="w-4 h-4" />,
      description: 'Mobile device management',
      examples: ['Microsoft Intune', 'JAMF', 'VMware Workspace ONE']
    },
    {
      type: 'pki',
      label: 'PKI Infrastructure',
      color: '#DC2626',
      icon: <Lock className="w-4 h-4" />,
      description: 'Certificate management',
      examples: ['Certificate Authority', 'Certificate Store', 'CRL']
    },
    {
      type: 'firewall',
      label: 'Security Appliances',
      color: '#EA580C',
      icon: <Server className="w-4 h-4" />,
      description: 'Network security devices',
      examples: ['FortiGate', 'Palo Alto', 'Cisco ASA']
    },
    {
      type: 'cloud',
      label: 'Cloud Services',
      color: '#0891B2',
      icon: <Cloud className="w-4 h-4" />,
      description: 'Cloud platform services',
      examples: ['AWS', 'Azure', 'Google Cloud']
    }
  ]

  const connectionTypes = [
    {
      type: 'radius',
      label: 'RADIUS',
      color: '#00c8d7',
      description: 'Authentication protocol',
      pattern: 'solid'
    },
    {
      type: 'https',
      label: 'HTTPS/REST API',
      color: '#059669',
      description: 'Secure web communication',
      pattern: 'dashed'
    },
    {
      type: 'ldap',
      label: 'LDAP/SAML',
      color: '#0078D4',
      description: 'Directory services',
      pattern: 'dotted'
    },
    {
      type: 'syslog',
      label: 'Syslog',
      color: '#7C3AED',
      description: 'System logging',
      pattern: 'solid'
    },
    {
      type: 'tacacs',
      label: 'TACACS+',
      color: '#DC2626',
      description: 'Device administration',
      pattern: 'solid'
    },
    {
      type: 'data',
      label: 'Data Flow',
      color: '#6B7280',
      description: 'General data communication',
      pattern: 'solid'
    }
  ]

  const vendorInfo = [
    {
      vendor: 'cisco',
      label: 'Cisco',
      color: '#1BA0D7',
      logo: '🔵',
      description: 'Network infrastructure vendor'
    },
    {
      vendor: 'aruba',
      label: 'Aruba (HPE)',
      color: '#FF6900',
      logo: '🟠',
      description: 'Wireless and switching solutions'
    },
    {
      vendor: 'fortinet',
      label: 'Fortinet',
      color: '#EE3124',
      logo: '🔴',
      description: 'Security appliances and SASE'
    },
    {
      vendor: 'paloalto',
      label: 'Palo Alto Networks',
      color: '#FF6B35',
      logo: '🟠',
      description: 'Next-generation security platform'
    },
    {
      vendor: 'juniper',
      label: 'Juniper Networks',
      color: '#84BD00',
      logo: '🟢',
      description: 'Enterprise networking solutions'
    },
    {
      vendor: 'extreme',
      label: 'Extreme Networks',
      color: '#7B68EE',
      logo: '🟣',
      description: 'Cloud-driven networking'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Component Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Component Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {componentTypes.map((component) => (
              <div key={component.type} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: component.color }}
                >
                  {component.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{component.label}</h4>
                  <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {component.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-blue-600" />
            <span>Connection Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectionTypes.map((connection) => (
              <div key={connection.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-0.5"
                    style={{ 
                      backgroundColor: connection.color,
                      borderStyle: connection.pattern === 'dashed' ? 'dashed' : 
                                  connection.pattern === 'dotted' ? 'dotted' : 'solid',
                      borderWidth: connection.pattern !== 'solid' ? '1px' : '0',
                      borderColor: connection.color
                    }}
                  />
                  <span className="font-semibold text-sm">{connection.label}</span>
                </div>
                <p className="text-xs text-gray-600">{connection.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Supported Vendors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorInfo.map((vendor) => (
              <div key={vendor.vendor} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="text-2xl">{vendor.logo}</div>
                <div>
                  <h4 className="font-semibold" style={{ color: vendor.color }}>
                    {vendor.label}
                  </h4>
                  <p className="text-sm text-gray-600">{vendor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Implementation Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Start with a pilot deployment in a controlled environment before full rollout</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Ensure proper certificate management and PKI infrastructure before deployment</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Configure backup authentication methods for critical network access</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Implement gradual policy enforcement to minimize user disruption</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Monitor and analyze authentication logs for security insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
