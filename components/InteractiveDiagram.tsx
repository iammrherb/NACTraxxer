'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Wifi, Server, Cloud, Lock, Users, Network, Router, Smartphone, Laptop, Monitor, Printer, Database, Globe, Key, CheckCircle, AlertTriangle, Info, Download, FileText, ImageIcon, FileCode } from 'lucide-react'

interface DiagramProps {
  selectedVendor: string
  selectedArchitecture: string
  selectedOptions: {
    identityProvider: string
    authMethod: string
    networkSegmentation: string
    guestAccess: boolean
    byod: boolean
    iot: boolean
    compliance: string
    monitoring: string
    sdwan: string
  }
}

export default function InteractiveDiagram({ selectedVendor, selectedArchitecture, selectedOptions }: DiagramProps) {
  const [animationStep, setAnimationStep] = useState(0)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const exportDiagram = (format: 'png' | 'svg' | 'pdf') => {
    // Export functionality would be implemented here
    console.log(`Exporting diagram as ${format}`)
  }

  const renderRADSecProxyDiagram = () => {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 overflow-hidden">
        {/* Site Network Section */}
        <div className="absolute left-4 top-4 w-48 h-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-200 dark:border-blue-600 p-3">
          <div className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Site Network</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Router className="h-4 w-4 text-blue-600" />
              <span className="text-xs">Switch/AP</span>
            </div>
            <div className="flex items-center space-x-2">
              <Laptop className="h-4 w-4 text-green-600" />
              <span className="text-xs">Endpoints</span>
            </div>
          </div>
        </div>

        {/* RADSec Proxy */}
        <div className="absolute left-64 top-8 w-40 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg shadow-lg p-3 text-white">
          <div className="text-sm font-semibold mb-1">RADSec Proxy</div>
          <div className="flex items-center space-x-1">
            <Lock className="h-3 w-3" />
            <span className="text-xs">TLS Encryption</span>
          </div>
        </div>

        {/* Internet/WAN */}
        <div className="absolute left-80 top-32 w-32 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-lg p-2 flex items-center justify-center">
          <div className="text-center">
            <Globe className="h-6 w-6 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Internet/WAN</span>
          </div>
        </div>

        {/* Portnox Cloud */}
        <div className="absolute right-4 top-4 w-48 h-40 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg shadow-lg p-3 text-white">
          <div className="text-sm font-semibold mb-2">Portnox Cloud</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Cloud RADIUS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-xs">Policy Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="text-xs">Identity Store</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </div>
          </div>
        </div>

        {/* Connection Lines with Animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Site to RADSec Proxy */}
          <line
            x1="200"
            y1="70"
            x2="260"
            y2="70"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={animationStep === 0 ? "5,5" : "0"}
          />
          <text x="220" y="65" className="text-xs fill-blue-600 dark:fill-blue-400">RADIUS</text>

          {/* RADSec Proxy to Internet */}
          <line
            x1="320"
            y1="70"
            x2="380"
            y2="140"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray={animationStep === 1 ? "5,5" : "0"}
          />
          <text x="340" y="100" className="text-xs fill-orange-600 dark:fill-orange-400">RADSec/TLS</text>

          {/* Internet to Cloud */}
          <line
            x1="420"
            y1="140"
            x2="480"
            y2="70"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray={animationStep === 2 ? "5,5" : "0"}
          />
          <text x="440" y="110" className="text-xs fill-green-600 dark:fill-green-400">Encrypted</text>
        </svg>

        {/* Benefits Panel */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">RADSec Proxy Benefits</div>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>No Load Balancer Required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>No Redis Cache Needed</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Direct TLS Encryption</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStandardDiagram = () => {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 overflow-hidden">
        {/* Network Infrastructure */}
        <div className="absolute left-4 top-4 w-32 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-200 dark:border-blue-600 p-2">
          <div className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">{selectedVendor}</div>
          <div className="flex items-center space-x-1">
            <Router className="h-4 w-4 text-blue-600" />
            <span className="text-xs">Network</span>
          </div>
        </div>

        {/* Endpoints */}
        <div className="absolute left-4 bottom-4 w-32 h-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-green-200 dark:border-green-600 p-2">
          <div className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">Endpoints</div>
          <div className="flex space-x-1">
            <Laptop className="h-3 w-3 text-green-600" />
            <Smartphone className="h-3 w-3 text-green-600" />
            <Printer className="h-3 w-3 text-green-600" />
          </div>
        </div>

        {/* Portnox Cloud */}
        <div className="absolute right-4 top-4 w-40 h-32 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg shadow-lg p-3 text-white">
          <div className="text-sm font-semibold mb-2">Portnox Cloud</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span className="text-xs">NAC Engine</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Identity</span>
            </div>
            <div className="flex items-center space-x-1">
              <Database className="h-3 w-3" />
              <span className="text-xs">Policies</span>
            </div>
          </div>
        </div>

        {/* Identity Provider */}
        {selectedOptions.identityProvider !== 'local' && (
          <div className="absolute right-4 bottom-4 w-40 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-lg p-3 text-white">
            <div className="text-sm font-semibold mb-1">Identity Provider</div>
            <div className="text-xs">{selectedOptions.identityProvider}</div>
          </div>
        )}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="140"
            y1="50"
            x2="480"
            y2="50"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray={animationStep === 0 ? "5,5" : "0"}
          />
          <line
            x1="70"
            y1="120"
            x2="70"
            y2="200"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray={animationStep === 1 ? "5,5" : "0"}
          />
        </svg>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-blue-600" />
            <span>{selectedArchitecture} Architecture</span>
          </CardTitle>
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline">{selectedVendor}</Badge>
            <Badge variant="outline">{selectedOptions.authMethod}</Badge>
            {selectedOptions.identityProvider !== 'local' && (
              <Badge variant="outline">{selectedOptions.identityProvider}</Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDiagram('png')}
            className="flex items-center space-x-1"
          >
            <ImageIcon className="h-4 w-4" />
            <span>PNG</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDiagram('svg')}
            className="flex items-center space-x-1"
          >
            <FileCode className="h-4 w-4" />
            <span>SVG</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDiagram('pdf')}
            className="flex items-center space-x-1"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedArchitecture === 'RADSec Proxy' ? renderRADSecProxyDiagram() : renderStandardDiagram()}
        
        {/* Architecture Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm">Security</span>
            </div>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li>• 802.1X Authentication</li>
              <li>• Dynamic VLAN Assignment</li>
              <li>• Policy Enforcement</li>
              {selectedArchitecture === 'RADSec Proxy' && <li>• TLS Encryption</li>}
            </ul>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-sm">Identity</span>
            </div>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li>• {selectedOptions.identityProvider} Integration</li>
              <li>• User/Device Profiling</li>
              <li>• Certificate Management</li>
              {selectedOptions.byod && <li>• BYOD Support</li>}
            </ul>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Network className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-sm">Network</span>
            </div>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li>• {selectedOptions.networkSegmentation}</li>
              {selectedOptions.guestAccess && <li>• Guest Network</li>}
              {selectedOptions.iot && <li>• IoT Segmentation</li>}
              {selectedOptions.sdwan !== 'none' && <li>• {selectedOptions.sdwan} Integration</li>}
            </ul>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
