'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cloud, Server, Wifi, Shield, Database, Globe, Lock, Zap, Activity, Target, CheckCircle, Clock, AlertTriangle, XCircle, BadgeIcon as Certificate, Key, Fingerprint, ComputerIcon as Desktop, Laptop, Smartphone, Tablet, Cpu, Network, Router } from 'lucide-react'

export default function ArchitectureLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Architecture Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Cloud Services</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                <span>Portnox Cloud NAC</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded"></div>
                <span>Microsoft Azure Services</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
                <span>AWS Infrastructure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                <span>GCP Infrastructure</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Authentication Methods</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <Certificate className="w-4 h-4 text-green-600" />
                <span>EAP-TLS (Certificate-based)</span>
                <Badge variant="outline" className="ml-auto">Recommended</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <Key className="w-4 h-4 text-blue-600" />
                <span>PEAP-MSCHAPv2 (Username/Password)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Fingerprint className="w-4 h-4 text-yellow-600" />
                <span>MAB (MAC Authentication Bypass)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Connection Types</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span>Standard RADIUS (UDP)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-0.5 bg-green-500" style={{ borderTop: '2px dashed' }}></div>
                <span>RADIUS over TLS (Port 2083)</span>
                <Badge variant="outline" className="ml-auto">Secure</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-0.5 bg-purple-500" style={{ borderTop: '2px dotted' }}></div>
                <span>SD-WAN Connection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-0.5 bg-orange-500" style={{ borderTop: '2px dashed' }}></div>
                <span>API Integration</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Device Types</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <Laptop className="w-4 h-4 text-gray-600" />
                <span>Corporate Laptops/Desktops</span>
              </div>
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Mobile Devices (BYOD)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Cpu className="w-4 h-4 text-green-600" />
                <span>IoT Devices</span>
              </div>
              <div className="flex items-center space-x-3">
                <Server className="w-4 h-4 text-purple-600" />
                <span>Servers & Infrastructure</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Network Infrastructure</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <Network className="w-4 h-4 text-gray-600" />
                <span>Managed Switches</span>
              </div>
              <div className="flex items-center space-x-3">
                <Wifi className="w-4 h-4 text-purple-600" />
                <span>Wireless Access Points</span>
              </div>
              <div className="flex items-center space-x-3">
                <Router className="w-4 h-4 text-orange-600" />
                <span>RADIUS Proxy/Gateway</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>WAN Connectivity</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Status Indicators</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Operational/Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span>Warning/Attention Required</span>
              </div>
              <div className="flex items-center space-x-3">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Error/Non-Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Pending/In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
