'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Cloud, Shield, Wifi, Server, Smartphone, BadgeIcon as Certificate, Network, HelpCircle } from 'lucide-react'

interface ArchitectureLegendProps {
  currentView: string
}

export default function ArchitectureLegend({ currentView }: ArchitectureLegendProps) {
  const legendSections = [
    {
      title: 'Cloud Services & Infrastructure',
      items: [
        {
          icon: <Cloud className="h-5 w-5 text-blue-600" />,
          color: 'bg-blue-100 border-blue-200',
          label: 'Portnox Cloud',
          description: 'Cloud-based NAC engine with Private PKI, policy management, and RADIUS authentication services',
          ports: 'HTTPS: 443, RADSec: 2083'
        },
        {
          icon: <Server className="h-5 w-5 text-orange-600" />,
          color: 'bg-orange-100 border-orange-200',
          label: 'AWS Infrastructure',
          description: 'Amazon Web Services cloud infrastructure hosting RADSec proxies',
          ports: 'RADSec: 2083, RADIUS: 1812/1813'
        },
        {
          icon: <Server className="h-5 w-5 text-blue-600" />,
          color: 'bg-blue-100 border-blue-200',
          label: 'Azure Infrastructure',
          description: 'Microsoft Azure cloud infrastructure with Express Route connectivity',
          ports: 'RADSec: 2083, HTTPS: 443'
        },
        {
          icon: <Server className="h-5 w-5 text-green-600" />,
          color: 'bg-green-100 border-green-200',
          label: 'GCP Infrastructure',
          description: 'Google Cloud Platform infrastructure for global deployment',
          ports: 'RADSec: 2083, Cloud Interconnect'
        }
      ]
    },
    {
      title: 'Authentication Methods',
      items: [
        {
          icon: <Certificate className="h-5 w-5 text-green-600" />,
          color: 'bg-green-100 border-green-200',
          label: 'EAP-TLS',
          description: 'Certificate-based authentication using X.509 certificates',
          ports: 'Most secure method, requires PKI'
        },
        {
          icon: <Shield className="h-5 w-5 text-blue-600" />,
          color: 'bg-blue-100 border-blue-200',
          label: 'PEAP-MSCHAPv2',
          description: 'Username/password authentication with TLS tunnel',
          ports: 'Legacy support for older devices'
        },
        {
          icon: <Network className="h-5 w-5 text-yellow-600" />,
          color: 'bg-yellow-100 border-yellow-200',
          label: 'MAB (MAC Authentication Bypass)',
          description: 'MAC address-based authentication for IoT devices',
          ports: 'For devices without 802.1X support'
        },
        {
          icon: <Wifi className="h-5 w-5 text-purple-600" />,
          color: 'bg-purple-100 border-purple-200',
          label: 'Guest Portal',
          description: 'Captive portal with sponsor approval workflow',
          ports: 'HTTPS: 443, Redirect: 8080'
        }
      ]
    },
    {
      title: 'Connection Types & Protocols',
      items: [
        {
          icon: <div className="w-8 h-1 bg-blue-600 rounded" />,
          color: 'bg-gray-50 border-gray-200',
          label: 'Standard Connection',
          description: 'Regular network communication paths',
          ports: 'Various protocols and ports'
        },
        {
          icon: <div className="w-8 h-1 bg-green-600 rounded border-dashed border-2 border-green-600" />,
          color: 'bg-gray-50 border-gray-200',
          label: 'Secure/Encrypted',
          description: 'TLS/RADSec encrypted communication channels',
          ports: 'RADSec: 2083, HTTPS: 443'
        },
        {
          icon: <div className="w-8 h-1 bg-red-600 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, #dc2626 4px, #dc2626 8px)' }} />,
          color: 'bg-gray-50 border-gray-200',
          label: 'SD-WAN',
          description: 'Software-defined WAN connectivity with dynamic path selection',
          ports: 'IPSec tunnels, various ports'
        },
        {
          icon: <div className="w-8 h-1 bg-blue-800 rounded" />,
          color: 'bg-gray-50 border-gray-200',
          label: 'Express Route/Direct Connect',
          description: 'Private connection to cloud providers',
          ports: 'Dedicated circuits, BGP routing'
        }
      ]
    },
    {
      title: 'Network Segments & VLANs',
      items: [
        {
          icon: <Badge variant="outline" className="text-xs">100</Badge>,
          color: 'bg-green-50 border-green-200',
          label: 'Corporate VLAN',
          description: 'Authenticated corporate users and devices',
          ports: 'Full network access'
        },
        {
          icon: <Badge variant="outline" className="text-xs">200</Badge>,
          color: 'bg-blue-50 border-blue-200',
          label: 'Guest VLAN',
          description: 'Guest users with internet-only access',
          ports: 'Restricted access, internet only'
        },
        {
          icon: <Badge variant="outline" className="text-xs">300</Badge>,
          color: 'bg-yellow-50 border-yellow-200',
          label: 'IoT VLAN',
          description: 'Internet of Things devices with limited access',
          ports: 'Micro-segmented, specific services'
        },
        {
          icon: <Badge variant="outline" className="text-xs">999</Badge>,
          color: 'bg-red-50 border-red-200',
          label: 'Quarantine VLAN',
          description: 'Non-compliant or suspicious devices',
          ports: 'Remediation services only'
        }
      ]
    }
  ]

  const technicalDetails = {
    'complete': [
      'RADSec proxy deployment with 7-day authentication cache',
      'Certificate validity: 1 year maximum',
      'OCSP checking enabled for real-time validation',
      'High availability with active-active proxy configuration'
    ],
    'auth-flow': [
      '802.1X authentication with EAP-TLS preferred',
      'RADIUS timeout: 5 seconds, retries: 3',
      'Dynamic VLAN assignment based on policy',
      'CoA (Change of Authorization) support for real-time updates'
    ],
    'pki': [
      'RSA 2048-bit minimum key length',
      'SHA-256 signature algorithm',
      'SCEP enrollment with challenge passwords',
      'CRL distribution every 24 hours'
    ],
    'policies': [
      'Policy evaluation order: User → Device → Network → Compliance',
      'Real-time policy updates via RADIUS CoA',
      'Time-based access controls supported',
      'Geolocation-based policies available'
    ],
    'connectivity': [
      'Multiple RADSec proxy locations for redundancy',
      'Latency optimization with regional deployments',
      'Bandwidth requirements: 1Mbps per 1000 users',
      'Failover time: <30 seconds'
    ],
    'intune': [
      'SCEP certificate profiles for user and device authentication',
      'WiFi profiles with EAP-TLS configuration',
      'Compliance policies integrated with NAC decisions',
      'Automatic certificate renewal 30 days before expiry'
    ],
    'onboarding': [
      'Self-service portal with multi-language support',
      'QR code generation for mobile device enrollment',
      'Sponsor approval workflow for guest access',
      'Automated device profiling and classification'
    ]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>Architecture Components Legend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {legendSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 border-b pb-2">
                  {section.title}
                </h4>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <TooltipProvider key={itemIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center space-x-3 p-3 rounded-lg border ${item.color} hover:shadow-md transition-all cursor-help`}>
                            <div className="flex-shrink-0">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div>
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-sm mb-2">{item.description}</p>
                            <p className="text-xs text-gray-500">
                              <strong>Technical:</strong> {item.ports}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Technical Implementation Details - {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="space-y-2">
              {technicalDetails[currentView as keyof typeof technicalDetails]?.map((detail, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
