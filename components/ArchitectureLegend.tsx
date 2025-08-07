'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Info, Shield, Cloud, Network, Users, Database, Server, Lock, Settings, Zap } from 'lucide-react'

interface ArchitectureLegendProps {
  currentView: string
}

export default function ArchitectureLegend({ currentView }: ArchitectureLegendProps) {
  const getComponentsForView = (view: string) => {
    switch (view) {
      case 'complete':
        return [
          { name: 'Portnox Cloud', color: '#e3f2fd', icon: <Cloud className="w-4 h-4" />, description: 'Cloud-based NAC engine with Private PKI and policy management' },
          { name: 'RADSec Proxy', color: '#e1f5fe', icon: <Shield className="w-4 h-4" />, description: 'Secure RADIUS proxy for cloud connectivity' },
          { name: 'Network Infrastructure', color: '#f3e5f5', icon: <Network className="w-4 h-4" />, description: 'Switches, access points, and network devices' },
          { name: 'Microsoft Intune', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'Mobile device management and certificate deployment' },
          { name: 'Managed Endpoints', color: '#f5f5f5', icon: <Database className="w-4 h-4" />, description: 'Corporate devices with deployed certificates' }
        ]
      case 'auth-flow':
        return [
          { name: 'End Device', color: '#e8f5e9', icon: <Database className="w-4 h-4" />, description: 'User device attempting network access' },
          { name: 'Network Access Server', color: '#e8f5e9', icon: <Network className="w-4 h-4" />, description: 'Switch or access point handling 802.1X' },
          { name: 'RADSec Proxy', color: '#e1f5fe', icon: <Shield className="w-4 h-4" />, description: 'RADIUS over TLS proxy' },
          { name: 'Portnox Cloud', color: '#e3f2fd', icon: <Cloud className="w-4 h-4" />, description: 'Cloud NAC authentication engine' },
          { name: 'Identity Provider', color: '#e3f2fd', icon: <Users className="w-4 h-4" />, description: 'Azure AD or other identity source' }
        ]
      case 'pki':
        return [
          { name: 'Private CA', color: '#e3f2fd', icon: <Lock className="w-4 h-4" />, description: 'Portnox Private Certificate Authority' },
          { name: 'SCEP Server', color: '#e8f5e9', icon: <Server className="w-4 h-4" />, description: 'Simple Certificate Enrollment Protocol' },
          { name: 'OCSP Responder', color: '#e8f5e9', icon: <Shield className="w-4 h-4" />, description: 'Online Certificate Status Protocol' },
          { name: 'CRL Distribution', color: '#e8f5e9', icon: <Database className="w-4 h-4" />, description: 'Certificate Revocation List' },
          { name: 'Key Escrow', color: '#fff3e0', icon: <Lock className="w-4 h-4" />, description: 'Secure key recovery service' }
        ]
      case 'policies':
        return [
          { name: 'Policy Engine', color: '#e3f2fd', icon: <Settings className="w-4 h-4" />, description: 'Central policy management and decision engine' },
          { name: 'User Policies', color: '#d4edda', icon: <Users className="w-4 h-4" />, description: 'Identity-based access policies' },
          { name: 'Device Policies', color: '#cce5ff', icon: <Database className="w-4 h-4" />, description: 'Device-based compliance policies' },
          { name: 'Network Policies', color: '#fff3cd', icon: <Network className="w-4 h-4" />, description: 'Location and network-based policies' },
          { name: 'Time-Based Policies', color: '#f8d7da', icon: <Zap className="w-4 h-4" />, description: 'Temporal access control policies' }
        ]
      case 'connectivity':
        return [
          { name: 'Portnox Global Cloud', color: '#e3f2fd', icon: <Cloud className="w-4 h-4" />, description: 'Global cloud infrastructure' },
          { name: 'AWS RADSec Proxy', color: '#fff3e0', icon: <Server className="w-4 h-4" />, description: 'Amazon Web Services proxy' },
          { name: 'Azure RADSec Proxy', color: '#e1f5fe', icon: <Server className="w-4 h-4" />, description: 'Microsoft Azure proxy' },
          { name: 'GCP RADSec Proxy', color: '#e8f5e9', icon: <Server className="w-4 h-4" />, description: 'Google Cloud Platform proxy' },
          { name: 'Edge Locations', color: '#f3e5f5', icon: <Network className="w-4 h-4" />, description: 'CDN edge locations for performance' }
        ]
      case 'intune':
        return [
          { name: 'Intune Portal', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'Microsoft device management portal' },
          { name: 'SCEP Connector', color: '#e3f2fd', icon: <Lock className="w-4 h-4" />, description: 'Certificate enrollment connector' },
          { name: 'Compliance Policies', color: '#d4edda', icon: <Shield className="w-4 h-4" />, description: 'Device compliance requirements' },
          { name: 'WiFi Profiles', color: '#cce5ff', icon: <Network className="w-4 h-4" />, description: 'Enterprise WiFi configurations' },
          { name: 'Certificate Profiles', color: '#fff3cd', icon: <Lock className="w-4 h-4" />, description: 'SCEP certificate profiles' }
        ]
      case 'onboarding':
        return [
          { name: 'Onboarding Portal', color: '#e3f2fd', icon: <Cloud className="w-4 h-4" />, description: 'Self-service device registration' },
          { name: 'Corporate Workflow', color: '#d4edda', icon: <Users className="w-4 h-4" />, description: 'Automated corporate device enrollment' },
          { name: 'BYOD Workflow', color: '#cce5ff', icon: <Database className="w-4 h-4" />, description: 'Bring Your Own Device process' },
          { name: 'Guest Workflow', color: '#fff3cd', icon: <Users className="w-4 h-4" />, description: 'Guest access with sponsor approval' },
          { name: 'IoT Workflow', color: '#f8d7da', icon: <Network className="w-4 h-4" />, description: 'IoT device registration and profiling' }
        ]
      case 'fortigate-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Centralized TACACS+ authentication' },
          { name: 'FortiGate Firewall', color: '#ff6b6b', icon: <Shield className="w-4 h-4" />, description: 'FortiGate firewall cluster with HA' },
          { name: 'FortiManager', color: '#ff8e8e', icon: <Settings className="w-4 h-4" />, description: 'Centralized FortiGate management' },
          { name: 'FortiAnalyzer', color: '#ffb3b3', icon: <Database className="w-4 h-4" />, description: 'Security analytics and logging' },
          { name: 'Active Directory', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'User authentication and groups' }
        ]
      case 'palo-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Centralized TACACS+ authentication' },
          { name: 'Palo Alto Firewall', color: '#ff9500', icon: <Shield className="w-4 h-4" />, description: 'Next-generation firewall with HA' },
          { name: 'Panorama', color: '#ffb84d', icon: <Settings className="w-4 h-4" />, description: 'Centralized management platform' },
          { name: 'Prisma Access', color: '#ffd699', icon: <Cloud className="w-4 h-4" />, description: 'Cloud-delivered security platform' },
          { name: 'LDAP Directory', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'LDAP directory service' }
        ]
      case 'palo-userid':
        return [
          { name: 'Portnox Syslog Container', color: '#e3f2fd', icon: <Database className="w-4 h-4" />, description: 'Syslog parsing for authentication events' },
          { name: 'User-ID Agent', color: '#ffb84d', icon: <Users className="w-4 h-4" />, description: 'User-to-IP mapping collection' },
          { name: 'Palo Alto Firewall', color: '#ff9500', icon: <Shield className="w-4 h-4" />, description: 'Firewall with User-ID enabled' },
          { name: 'Domain Controller', color: '#e1f5fe', icon: <Server className="w-4 h-4" />, description: 'Windows domain controller' },
          { name: 'Policy Engine', color: '#fff3cd', icon: <Settings className="w-4 h-4" />, description: 'Dynamic security policy engine' }
        ]
      case 'fortigate-fsso':
        return [
          { name: 'Portnox Syslog Container', color: '#e3f2fd', icon: <Database className="w-4 h-4" />, description: 'Syslog parsing for NAC events' },
          { name: 'FSSO Agent', color: '#ff8e8e', icon: <Users className="w-4 h-4" />, description: 'Fortinet Single Sign-On agent' },
          { name: 'FortiGate Firewall', color: '#ff6b6b', icon: <Shield className="w-4 h-4" />, description: 'Firewall with FSSO enabled' },
          { name: 'Active Directory', color: '#e1f5fe', icon: <Server className="w-4 h-4" />, description: 'AD server for user information' },
          { name: 'Security Fabric', color: '#fff3cd', icon: <Network className="w-4 h-4" />, description: 'Fortinet Security Fabric integration' }
        ]
      default:
        return []
    }
  }

  const getConnectionTypes = () => {
    return [
      { type: 'Standard', color: '#6b7280', style: 'solid', description: 'Regular network connection' },
      { type: 'Secure', color: '#10b981', style: 'solid', description: 'Encrypted/authenticated connection' },
      { type: 'Dashed', color: '#6b7280', style: 'dashed', description: 'Logical or intermittent connection' }
    ]
  }

  const components = getComponentsForView(currentView)
  const connections = getConnectionTypes()

  return (
    <div className="space-y-6">
      {/* Components Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-[#00c8d7]" />
            <span>Architecture Components</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div 
                  className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: component.color }}
                >
                  {component.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {component.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {component.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-[#00c8d7]" />
            <span>Connection Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <line
                      x1="0"
                      y1="10"
                      x2="40"
                      y2="10"
                      stroke={connection.color}
                      strokeWidth="3"
                      strokeDasharray={connection.style === 'dashed' ? '5,5' : 'none'}
                    />
                    <polygon
                      points="35,6 40,10 35,14"
                      fill={connection.color}
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-sm">{connection.type}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {connection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-[#00c8d7]" />
            <span>Supported Vendors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">FG</span>
              </div>
              <p className="text-xs font-medium">Fortinet</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">PA</span>
              </div>
              <p className="text-xs font-medium">Palo Alto</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">C</span>
              </div>
              <p className="text-xs font-medium">Cisco</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">A</span>
              </div>
              <p className="text-xs font-medium">Aruba</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-[#00c8d7]" />
            <span>Export Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">SVG</Badge>
              <span className="text-sm">Vector format with embedded logos and metadata</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">PNG</Badge>
              <span className="text-sm">High-resolution raster image with headers</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">PDF</Badge>
              <span className="text-sm">Professional document format for presentations</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="mb-2">All exports include:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Portnox and customer logos</li>
              <li>Architecture view title and timestamp</li>
              <li>High-quality vector graphics</li>
              <li>Professional formatting</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
