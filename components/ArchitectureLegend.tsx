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
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Centralized TACACS+ authentication server' },
          { name: 'FortiGate Firewall', color: '#ff6b6b', icon: <Shield className="w-4 h-4" />, description: 'FortiGate NGFW with TACACS+ authentication' },
          { name: 'FortiManager', color: '#ff8e8e', icon: <Settings className="w-4 h-4" />, description: 'Centralized FortiGate management platform' },
          { name: 'Microsoft Entra ID', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'Cloud identity provider with groups' },
          { name: 'Session Tracking', color: '#d4edda', icon: <Database className="w-4 h-4" />, description: 'Real-time session monitoring and logging' },
          { name: 'Command Authorization', color: '#cce5ff', icon: <Lock className="w-4 h-4" />, description: 'Granular command-level authorization' }
        ]
      case 'palo-alto-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Enterprise TACACS+ server with advanced policies' },
          { name: 'Palo Alto NGFW', color: '#ff9500', icon: <Shield className="w-4 h-4" />, description: 'Next-generation firewall with TACACS+ auth' },
          { name: 'Panorama', color: '#ffb84d', icon: <Settings className="w-4 h-4" />, description: 'Centralized management platform' },
          { name: 'Admin Role Profiles', color: '#fff3cd', icon: <Users className="w-4 h-4" />, description: 'Granular role-based access control' },
          { name: 'Session Management', color: '#d4edda', icon: <Database className="w-4 h-4" />, description: 'Active session tracking with limits' },
          { name: 'SIEM Integration', color: '#f8d7da', icon: <Network className="w-4 h-4" />, description: 'Security event correlation and analysis' }
        ]
      case 'cisco-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'TACACS+ server with Cisco device support' },
          { name: 'Cisco Catalyst Switch', color: '#1ba0d7', icon: <Network className="w-4 h-4" />, description: 'Catalyst switch with TACACS+ authentication' },
          { name: 'Cisco ASA Firewall', color: '#1ba0d7', icon: <Shield className="w-4 h-4" />, description: 'ASA firewall with administrative auth' },
          { name: 'Cisco Privilege Levels', color: '#fff3cd', icon: <Lock className="w-4 h-4" />, description: 'Privilege levels 0-15 with custom authorization' },
          { name: 'AAA Accounting', color: '#d4edda', icon: <Database className="w-4 h-4" />, description: 'Comprehensive session and command accounting' },
          { name: 'Command Sets', color: '#fff3cd', icon: <Settings className="w-4 h-4" />, description: 'Predefined command sets for different roles' }
        ]
      case 'aruba-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'TACACS+ server with Aruba device support' },
          { name: 'Aruba CX Switch', color: '#ff6600', icon: <Network className="w-4 h-4" />, description: 'CX switch with role-based CLI access' },
          { name: 'Aruba ClearPass', color: '#ff6600', icon: <Shield className="w-4 h-4" />, description: 'Policy manager with device administration' },
          { name: 'Aruba Admin Roles', color: '#fff3cd', icon: <Users className="w-4 h-4" />, description: 'Aruba-specific administrative roles' },
          { name: 'Command Filtering', color: '#fff3cd', icon: <Lock className="w-4 h-4" />, description: 'Granular command filtering with regex' },
          { name: 'Audit Trail', color: '#f8d7da', icon: <Database className="w-4 h-4" />, description: 'Comprehensive audit with forensic analysis' }
        ]
      case 'juniper-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'TACACS+ server with JUNOS authorization' },
          { name: 'Juniper EX Switch', color: '#00a651', icon: <Network className="w-4 h-4" />, description: 'EX switch with login classes' },
          { name: 'Juniper SRX Firewall', color: '#00a651', icon: <Shield className="w-4 h-4" />, description: 'SRX firewall with security admin roles' },
          { name: 'JUNOS Login Classes', color: '#fff3cd', icon: <Users className="w-4 h-4" />, description: 'Login classes with hierarchical permissions' },
          { name: 'Template Authorization', color: '#d4edda', icon: <Settings className="w-4 h-4" />, description: 'Template-based command authorization' },
          { name: 'Commit Control', color: '#cce5ff', icon: <Lock className="w-4 h-4" />, description: 'Configuration commit control and rollback' }
        ]
      case 'radsec-proxy':
        return [
          { name: 'Client Device', color: '#e8f5e9', icon: <Database className="w-4 h-4" />, description: 'Authenticated endpoint with certificates' },
          { name: 'Network Access Server', color: '#e8f5e9', icon: <Network className="w-4 h-4" />, description: 'Switch/AP with RADIUS client' },
          { name: 'RADSec Proxy', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Secure RADIUS proxy with TLS termination' },
          { name: 'Portnox Cloud NAC', color: '#e3f2fd', icon: <Cloud className="w-4 h-4" />, description: 'Cloud-based NAC service with policy engine' },
          { name: 'Microsoft Entra ID', color: '#e1f5fe', icon: <Users className="w-4 h-4" />, description: 'Cloud identity and access management' }
        ]
      case 'hpe-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Enterprise TACACS+ server with HPE/H3C device support' },
          { name: 'HPE Comware Switch', color: '#01a982', icon: <Network className="w-4 h-4" />, description: 'HPE Comware switch with user privilege levels' },
          { name: 'HPE ProCurve Switch', color: '#01a982', icon: <Network className="w-4 h-4" />, description: 'HPE ProCurve with manager/operator levels' },
          { name: 'H3C Router', color: '#01a982', icon: <Network className="w-4 h-4" />, description: 'H3C router with command authorization' },
          { name: 'HPE IMC', color: '#01a982', icon: <Settings className="w-4 h-4" />, description: 'HPE Intelligent Management Center' },
          { name: 'View-Based Access Control', color: '#fff3cd', icon: <Lock className="w-4 h-4" />, description: 'Custom command sets and view restrictions' }
        ]
      case 'extreme-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Centralized TACACS+ with Extreme Networks support' },
          { name: 'Extreme X-Series', color: '#7b2cbf', icon: <Network className="w-4 h-4" />, description: 'X-Series switch with role-based access' },
          { name: 'Extreme Summit', color: '#7b2cbf', icon: <Network className="w-4 h-4" />, description: 'Summit switch with policy management' },
          { name: 'Extreme Wing AP', color: '#7b2cbf', icon: <Network className="w-4 h-4" />, description: 'Wing wireless access point' },
          { name: 'ExtremeCloud IQ', color: '#7b2cbf', icon: <Cloud className="w-4 h-4" />, description: 'Cloud management platform' },
          { name: 'Advanced Analytics', color: '#f8d7da', icon: <Database className="w-4 h-4" />, description: 'ML-based anomaly detection' }
        ]
      case 'ruckus-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Enterprise TACACS+ with Ruckus/CommScope support' },
          { name: 'Ruckus ICX Switch', color: '#f39c12', icon: <Network className="w-4 h-4" />, description: 'ICX switch with privilege levels' },
          { name: 'Ruckus Access Point', color: '#f39c12', icon: <Network className="w-4 h-4" />, description: 'Wireless AP with controller auth' },
          { name: 'Ruckus SmartZone', color: '#f39c12', icon: <Settings className="w-4 h-4" />, description: 'SmartZone wireless controller' },
          { name: 'Ruckus CloudPath', color: '#f39c12', icon: <Cloud className="w-4 h-4" />, description: 'CloudPath enrollment system' },
          { name: 'RF Management', color: '#fff3cd', icon: <Zap className="w-4 h-4" />, description: 'Adaptive antenna and power control' }
        ]
      case 'ubiquiti-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Centralized TACACS+ with UniFi integration' },
          { name: 'UniFi Switch', color: '#0559c9', icon: <Network className="w-4 h-4" />, description: 'UniFi managed switch with role-based access' },
          { name: 'UniFi Access Point', color: '#0559c9', icon: <Network className="w-4 h-4" />, description: 'UniFi wireless access point' },
          { name: 'UniFi Gateway', color: '#0559c9', icon: <Shield className="w-4 h-4" />, description: 'UniFi security gateway' },
          { name: 'UniFi Controller', color: '#0559c9', icon: <Settings className="w-4 h-4" />, description: 'UniFi Network Controller' },
          { name: 'Zero-Touch Provisioning', color: '#cce5ff', icon: <Zap className="w-4 h-4" />, description: 'Automated device adoption' }
        ]
      case 'mikrotik-tacacs':
        return [
          { name: 'Portnox TACACS+ Server', color: '#e3f2fd', icon: <Server className="w-4 h-4" />, description: 'Enterprise TACACS+ with RouterOS support' },
          { name: 'MikroTik Router', color: '#293133', icon: <Network className="w-4 h-4" />, description: 'RouterOS with TACACS+ authentication' },
          { name: 'MikroTik Switch', color: '#293133', icon: <Network className="w-4 h-4" />, description: 'Managed switch with SwOS' },
          { name: 'MikroTik Wireless', color: '#293133', icon: <Network className="w-4 h-4" />, description: 'Wireless device with CAPsMAN' },
          { name: 'RouterOS Policies', color: '#d4edda', icon: <Lock className="w-4 h-4" />, description: 'Granular permission control framework' },
          { name: 'Winbox Access', color: '#cce5ff', icon: <Settings className="w-4 h-4" />, description: 'GUI access with TACACS+ auth' }
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
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold text-sm">HP</span>
              </div>
              <p className="text-xs font-medium">HPE/H3C</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">EX</span>
              </div>
              <p className="text-xs font-medium">Extreme</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">RK</span>
              </div>
              <p className="text-xs font-medium">Ruckus</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">UB</span>
              </div>
              <p className="text-xs font-medium">Ubiquiti</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">MT</span>
              </div>
              <p className="text-xs font-medium">MikroTik</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">J</span>
              </div>
              <p className="text-xs font-medium">Juniper</p>
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
