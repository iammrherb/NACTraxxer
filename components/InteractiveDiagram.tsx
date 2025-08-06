'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cloud, Server, Wifi, Shield, Database, Users } from 'lucide-react'

interface InteractiveDiagramProps {
  config: any
  currentView: string
  animationSpeed: number
}

export default function InteractiveDiagram({ config, currentView, animationSpeed }: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && animationSpeed > 0) {
      // Add animation logic here
      const elements = svgRef.current.querySelectorAll('.animated')
      elements.forEach((element, index) => {
        const animationElement = element as SVGElement
        animationElement.style.animationDuration = `${2 / animationSpeed}s`
        animationElement.style.animationDelay = `${index * 0.2}s`
      })
    }
  }, [animationSpeed, currentView])

  const renderCompleteArchitecture = () => (
    <svg ref={svgRef} width="100%" height="600" viewBox="0 0 1000 600" className="border rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Cloud Infrastructure */}
      <rect x="50" y="50" width="900" height="120" rx="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" className="animated" />
      <text x="500" y="80" textAnchor="middle" className="text-lg font-semibold fill-blue-800">Portnox Cloud Infrastructure</text>
      
      {/* Cloud Services */}
      <g className="animated">
        <rect x="100" y="100" width="150" height="50" rx="5" fill="#0284c7" />
        <text x="175" y="130" textAnchor="middle" className="text-sm fill-white">NAC Engine</text>
      </g>
      
      <g className="animated">
        <rect x="300" y="100" width="150" height="50" rx="5" fill="#0284c7" />
        <text x="375" y="130" textAnchor="middle" className="text-sm fill-white">Policy Manager</text>
      </g>
      
      <g className="animated">
        <rect x="500" y="100" width="150" height="50" rx="5" fill="#0284c7" />
        <text x="575" y="130" textAnchor="middle" className="text-sm fill-white">Certificate Authority</text>
      </g>
      
      <g className="animated">
        <rect x="700" y="100" width="150" height="50" rx="5" fill="#0284c7" />
        <text x="775" y="130" textAnchor="middle" className="text-sm fill-white">Analytics Engine</text>
      </g>

      {/* Network Infrastructure */}
      <rect x="50" y="220" width="900" height="120" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" className="animated" />
      <text x="500" y="250" textAnchor="middle" className="text-lg font-semibold fill-green-800">Network Infrastructure</text>
      
      {/* Network Components */}
      <g className="animated">
        <rect x="100" y="270" width="120" height="50" rx="5" fill="#16a34a" />
        <text x="160" y="300" textAnchor="middle" className="text-sm fill-white">Core Switch</text>
      </g>
      
      <g className="animated">
        <rect x="280" y="270" width="120" height="50" rx="5" fill="#16a34a" />
        <text x="340" y="300" textAnchor="middle" className="text-sm fill-white">Access Switch</text>
      </g>
      
      <g className="animated">
        <rect x="460" y="270" width="120" height="50" rx="5" fill="#16a34a" />
        <text x="520" y="300" textAnchor="middle" className="text-sm fill-white">Wireless AP</text>
      </g>
      
      <g className="animated">
        <rect x="640" y="270" width="120" height="50" rx="5" fill="#16a34a" />
        <text x="700" y="300" textAnchor="middle" className="text-sm fill-white">Firewall</text>
      </g>
      
      <g className="animated">
        <rect x="820" y="270" width="120" height="50" rx="5" fill="#16a34a" />
        <text x="880" y="300" textAnchor="middle" className="text-sm fill-white">Router</text>
      </g>

      {/* Device Layer */}
      <rect x="50" y="390" width="900" height="120" rx="10" fill="#fef3c7" stroke="#d97706" strokeWidth="2" className="animated" />
      <text x="500" y="420" textAnchor="middle" className="text-lg font-semibold fill-amber-800">Connected Devices</text>
      
      {/* Device Types */}
      <g className="animated">
        <circle cx="150" cy="470" r="25" fill="#d97706" />
        <text x="150" y="475" textAnchor="middle" className="text-xs fill-white">Laptop</text>
      </g>
      
      <g className="animated">
        <circle cx="250" cy="470" r="25" fill="#d97706" />
        <text x="250" y="475" textAnchor="middle" className="text-xs fill-white">Phone</text>
      </g>
      
      <g className="animated">
        <circle cx="350" cy="470" r="25" fill="#d97706" />
        <text x="350" y="475" textAnchor="middle" className="text-xs fill-white">Tablet</text>
      </g>
      
      <g className="animated">
        <circle cx="450" cy="470" r="25" fill="#d97706" />
        <text x="450" y="475" textAnchor="middle" className="text-xs fill-white">IoT</text>
      </g>
      
      <g className="animated">
        <circle cx="550" cy="470" r="25" fill="#d97706" />
        <text x="550" y="475" textAnchor="middle" className="text-xs fill-white">Server</text>
      </g>
      
      <g className="animated">
        <circle cx="650" cy="470" r="25" fill="#d97706" />
        <text x="650" y="475" textAnchor="middle" className="text-xs fill-white">Printer</text>
      </g>
      
      <g className="animated">
        <circle cx="750" cy="470" r="25" fill="#d97706" />
        <text x="750" y="475" textAnchor="middle" className="text-xs fill-white">Camera</text>
      </g>
      
      <g className="animated">
        <circle cx="850" cy="470" r="25" fill="#d97706" />
        <text x="850" y="475" textAnchor="middle" className="text-xs fill-white">Guest</text>
      </g>

      {/* Connection Lines */}
      <g className="animated" stroke="#6b7280" strokeWidth="2" fill="none">
        <line x1="175" y1="150" x2="160" y2="270" />
        <line x1="375" y1="150" x2="340" y2="270" />
        <line x1="575" y1="150" x2="520" y2="270" />
        <line x1="775" y1="150" x2="700" y2="270" />
        
        <line x1="160" y1="320" x2="100" y2="445" />
        <line x1="250" y1="320" x2="250" y2="445" />
        <line x1="475" y1="320" x2="400" y2="445" />
        <line x1="525" y1="320" x2="550" y2="445" />
        <line x1="750" y1="320" x2="700" y2="445" />
        <line x1="800" y1="320" x2="850" y2="445" />
      </g>

      {/* Data Flow Indicators */}
      {animationSpeed > 0 && (
        <g>
          <circle cx="175" cy="200" r="3" fill="#ef4444" className="animate-pulse" />
          <circle cx="375" cy="200" r="3" fill="#ef4444" className="animate-pulse" />
          <circle cx="575" cy="200" r="3" fill="#ef4444" className="animate-pulse" />
          <circle cx="775" cy="200" r="3" fill="#ef4444" className="animate-pulse" />
        </g>
      )}
    </svg>
  )

  const renderAuthFlow = () => (
    <svg ref={svgRef} width="100%" height="500" viewBox="0 0 1000 500" className="border rounded-lg bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
      <text x="500" y="30" textAnchor="middle" className="text-xl font-bold fill-green-800">Authentication Flow</text>
      
      {/* Steps */}
      <g className="animated">
        <rect x="50" y="80" width="150" height="60" rx="5" fill="#16a34a" />
        <text x="125" y="115" textAnchor="middle" className="text-sm fill-white">1. Device Connect</text>
      </g>
      
      <g className="animated">
        <rect x="250" y="80" width="150" height="60" rx="5" fill="#16a34a" />
        <text x="325" y="115" textAnchor="middle" className="text-sm fill-white">2. Identity Check</text>
      </g>
      
      <g className="animated">
        <rect x="450" y="80" width="150" height="60" rx="5" fill="#16a34a" />
        <text x="525" y="115" textAnchor="middle" className="text-sm fill-white">3. Policy Lookup</text>
      </g>
      
      <g className="animated">
        <rect x="650" y="80" width="150" height="60" rx="5" fill="#16a34a" />
        <text x="725" y="115" textAnchor="middle" className="text-sm fill-white">4. Access Grant</text>
      </g>

      {/* Flow Arrows */}
      <g stroke="#16a34a" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a" />
          </marker>
        </defs>
        <line x1="200" y1="110" x2="250" y2="110" className="animated" />
        <line x1="400" y1="110" x2="450" y2="110" className="animated" />
        <line x1="600" y1="110" x2="650" y2="110" className="animated" />
      </g>

      {/* Detailed Steps */}
      <g className="animated">
        <rect x="50" y="200" width="180" height="250" rx="5" fill="#f0fdf4" stroke="#16a34a" />
        <text x="140" y="225" textAnchor="middle" className="text-sm font-semibold fill-green-800">Device Connection</text>
        <text x="60" y="250" className="text-xs fill-gray-700">• Network detection</text>
        <text x="60" y="270" className="text-xs fill-gray-700">• 802.1X initiation</text>
        <text x="60" y="290" className="text-xs fill-gray-700">• Certificate request</text>
        <text x="60" y="310" className="text-xs fill-gray-700">• EAP negotiation</text>
      </g>
      
      <g className="animated">
        <rect x="270" y="200" width="180" height="250" rx="5" fill="#f0fdf4" stroke="#16a34a" />
        <text x="360" y="225" textAnchor="middle" className="text-sm font-semibold fill-green-800">Identity Verification</text>
        <text x="280" y="250" className="text-xs fill-gray-700">• Certificate validation</text>
        <text x="280" y="270" className="text-xs fill-gray-700">• Device fingerprinting</text>
        <text x="280" y="290" className="text-xs fill-gray-700">• User authentication</text>
        <text x="280" y="310" className="text-xs fill-gray-700">• Risk assessment</text>
      </g>
      
      <g className="animated">
        <rect x="490" y="200" width="180" height="250" rx="5" fill="#f0fdf4" stroke="#16a34a" />
        <text x="580" y="225" textAnchor="middle" className="text-sm font-semibold fill-green-800">Policy Evaluation</text>
        <text x="500" y="250" className="text-xs fill-gray-700">• Role determination</text>
        <text x="500" y="270" className="text-xs fill-gray-700">• Access level check</text>
        <text x="500" y="290" className="text-xs fill-gray-700">• Time restrictions</text>
        <text x="500" y="310" className="text-xs fill-gray-700">• Location validation</text>
      </g>
      
      <g className="animated">
        <rect x="710" y="200" width="180" height="250" rx="5" fill="#f0fdf4" stroke="#16a34a" />
        <text x="800" y="225" textAnchor="middle" className="text-sm font-semibold fill-green-800">Access Control</text>
        <text x="720" y="250" className="text-xs fill-gray-700">• VLAN assignment</text>
        <text x="720" y="270" className="text-xs fill-gray-700">• Bandwidth limits</text>
        <text x="720" y="290" className="text-xs fill-gray-700">• Firewall rules</text>
        <text x="720" y="310" className="text-xs fill-gray-700">• Monitoring setup</text>
      </g>
    </svg>
  )

  const renderPKIView = () => (
    <svg ref={svgRef} width="100%" height="500" viewBox="0 0 1000 500" className="border rounded-lg bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <text x="500" y="30" textAnchor="middle" className="text-xl font-bold fill-purple-800">PKI & Certificate Management</text>
      
      {/* Root CA */}
      <g className="animated">
        <rect x="400" y="70" width="200" height="80" rx="10" fill="#7c3aed" />
        <text x="500" y="100" textAnchor="middle" className="text-sm fill-white font-semibold">Root Certificate Authority</text>
        <text x="500" y="120" textAnchor="middle" className="text-xs fill-purple-200">Portnox Cloud PKI</text>
      </g>
      
      {/* Intermediate CAs */}
      <g className="animated">
        <rect x="150" y="200" width="150" height="60" rx="5" fill="#a855f7" />
        <text x="225" y="225" textAnchor="middle" className="text-sm fill-white">Device CA</text>
        <text x="225" y="240" textAnchor="middle" className="text-xs fill-purple-200">Device Certs</text>
      </g>
      
      <g className="animated">
        <rect x="425" y="200" width="150" height="60" rx="5" fill="#a855f7" />
        <text x="500" y="225" textAnchor="middle" className="text-sm fill-white">User CA</text>
        <text x="500" y="240" textAnchor="middle" className="text-xs fill-purple-200">User Certs</text>
      </g>
      
      <g className="animated">
        <rect x="700" y="200" width="150" height="60" rx="5" fill="#a855f7" />
        <text x="775" y="225" textAnchor="middle" className="text-sm fill-white">Server CA</text>
        <text x="775" y="240" textAnchor="middle" className="text-xs fill-purple-200">Server Certs</text>
      </g>
      
      {/* End Certificates */}
      <g className="animated">
        <rect x="50" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="100" y="350" textAnchor="middle" className="text-xs fill-white">Laptop</text>
      </g>
      
      <g className="animated">
        <rect x="200" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="250" y="350" textAnchor="middle" className="text-xs fill-white">Phone</text>
      </g>
      
      <g className="animated">
        <rect x="350" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="400" y="350" textAnchor="middle" className="text-xs fill-white">John Doe</text>
      </g>
      
      <g className="animated">
        <rect x="500" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="550" y="350" textAnchor="middle" className="text-xs fill-white">Jane Smith</text>
      </g>
      
      <g className="animated">
        <rect x="650" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="700" y="350" textAnchor="middle" className="text-xs fill-white">RADIUS</text>
      </g>
      
      <g className="animated">
        <rect x="800" y="320" width="100" height="50" rx="5" fill="#c084fc" />
        <text x="850" y="350" textAnchor="middle" className="text-xs fill-white">Web Server</text>
      </g>

      {/* Connection Lines */}
      <g stroke="#7c3aed" strokeWidth="2" fill="none" className="animated">
        <line x1="450" y1="150" x2="225" y2="200" />
        <line x1="500" y1="150" x2="500" y2="200" />
        <line x1="550" y1="150" x2="775" y2="200" />
        
        <line x1="200" y1="260" x2="100" y2="320" />
        <line x1="250" y1="260" x2="250" y2="320" />
        <line x1="475" y1="260" x2="400" y2="445" />
        <line x1="525" y1="260" x2="550" y2="445" />
        <line x1="750" y1="260" x2="700" y2="445" />
        <line x1="800" y1="260" x2="850" y2="445" />
      </g>

      {/* Certificate Details */}
      <g className="animated">
        <rect x="50" y="400" width="900" height="80" rx="5" fill="#faf5ff" stroke="#7c3aed" />
        <text x="70" y="420" className="text-sm font-semibold fill-purple-800">Certificate Lifecycle Management</text>
        <text x="70" y="440" className="text-xs fill-gray-700">• Automated enrollment and renewal</text>
        <text x="70" y="455" className="text-xs fill-gray-700">• Real-time revocation checking</text>
        <text x="70" y="470" className="text-xs fill-gray-700">• Certificate transparency logging</text>
        
        <text x="500" y="440" className="text-xs fill-gray-700">• SCEP/EST protocol support</text>
        <text x="500" y="455" className="text-xs fill-gray-700">• Hardware security module integration</text>
        <text x="500" y="470" className="text-xs fill-gray-700">• Compliance reporting and auditing</text>
      </g>
    </svg>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case 'complete':
        return renderCompleteArchitecture()
      case 'auth-flow':
        return renderAuthFlow()
      case 'pki':
        return renderPKIView()
      case 'policies':
        return renderCompleteArchitecture() // Placeholder
      case 'connectivity':
        return renderCompleteArchitecture() // Placeholder
      case 'intune':
        return renderCompleteArchitecture() // Placeholder
      case 'onboarding':
        return renderCompleteArchitecture() // Placeholder
      default:
        return renderCompleteArchitecture()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-6 w-6 text-blue-600" />
          <span>Interactive Architecture Diagram</span>
          <Badge variant="secondary" className="ml-2">
            {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}
          </Badge>
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          Dynamic visualization of your Zero Trust NAC architecture with real-time updates.
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          {renderCurrentView()}
        </div>
      </CardContent>
    </Card>
  )
}
