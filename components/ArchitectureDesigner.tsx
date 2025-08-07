'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import InteractiveDiagram from '@/components/InteractiveDiagram'
import ArchitectureLegend from '@/components/ArchitectureLegend'
import PolicyEditor from '@/components/PolicyEditor'
import OnboardingScenarios from '@/components/OnboardingScenarios'
import { Cloud, Network, Shield, Settings, Zap, Globe, Lock, Users, Database, Server, Download, FileText, Workflow, Eye, EyeOff } from 'lucide-react'

interface ArchitectureDesignerProps {
  customerLogo: string
}

export default function ArchitectureDesigner({ customerLogo }: ArchitectureDesignerProps) {
  const [activeView, setActiveView] = useState('diagram')
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedDiagram, setSelectedDiagram] = useState('corporate-wifi')
  const [isAnimated, setIsAnimated] = useState(true)

  const handleExportDiagram = async (format: 'svg' | 'png' | 'pdf') => {
    try {
      const diagramElement = document.getElementById('interactive-diagram')
      if (!diagramElement) return

      // Create export canvas with logos
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1200
      canvas.height = 800

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add header with logos
      const headerHeight = 80
      ctx.fillStyle = '#00c8d7'
      ctx.fillRect(0, 0, canvas.width, headerHeight)

      // Add Portnox logo
      const portnoxLogo = new Image()
      portnoxLogo.crossOrigin = 'anonymous'
      portnoxLogo.onload = () => {
        ctx.drawImage(portnoxLogo, 20, 15, 150, 50)
        
        // Add customer logo
        const customerLogoImg = new Image()
        customerLogoImg.crossOrigin = 'anonymous'
        customerLogoImg.onload = () => {
          ctx.drawImage(customerLogoImg, canvas.width - 170, 15, 150, 50)
          
          // Add title
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 24px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Zero Trust NAC Architecture', canvas.width / 2, 45)
          
          // Export based on format
          if (format === 'svg') {
            exportAsSVG(canvas)
          } else if (format === 'png') {
            exportAsPNG(canvas)
          } else if (format === 'pdf') {
            exportAsPDF(canvas)
          }
        }
        customerLogoImg.src = customerLogo
      }
      portnoxLogo.src = 'https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png'

    } catch (error) {
      console.error('Export failed:', error)
      showNotification('Export failed. Please try again.', 'error')
    }
  }

  const exportAsSVG = (canvas: HTMLCanvasElement) => {
    const svgData = `
      <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
        <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>
    `
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    downloadFile(blob, `portnox-architecture-${Date.now()}.svg`)
  }

  const exportAsPNG = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (blob) {
        downloadFile(blob, `portnox-architecture-${Date.now()}.png`)
      }
    }, 'image/png')
  }

  const exportAsPDF = (canvas: HTMLCanvasElement) => {
    // Simple PDF export - in a real implementation, you'd use a library like jsPDF
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `portnox-architecture-${Date.now()}.pdf`
    link.href = imgData
    link.click()
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    showNotification(`Exported as ${filename}`, 'success')
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const diagrams = [
    { id: 'corporate-wifi', name: 'Corporate WiFi Authentication', description: 'EAP-TLS certificate-based authentication flow' },
    { id: 'corporate-wired', name: 'Corporate Wired Authentication', description: '802.1X wired network authentication' },
    { id: 'guest-access', name: 'Guest Access Portal', description: 'Captive portal for guest users' },
    { id: 'radsec-proxy', name: 'RADSec Proxy Architecture', description: 'Secure RADIUS over TLS proxy configuration' },
    { id: 'fortigate-tacacs', name: 'FortiGate TACACS+ Integration', description: 'FortiGate firewall with TACACS+ authentication' },
    { id: 'palo-alto-tacacs', name: 'Palo Alto TACACS+ Integration', description: 'Palo Alto firewall with TACACS+ authentication' },
    { id: 'palo-alto-userid', name: 'Palo Alto User-ID Integration', description: 'Palo Alto User-ID for identity-aware policies' },
    { id: 'fortigate-fsso', name: 'FortiGate FSSO Integration', description: 'Fortinet Single Sign-On integration' }
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-[#00c8d7]" />
                <span>Architecture Designer</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Design and visualize your Zero Trust NAC architecture
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimated(!isAnimated)}
              >
                {isAnimated ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isAnimated ? 'Disable' : 'Enable'} Animation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPolicyEditor(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Policy Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Device Onboarding
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportDiagram('svg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  SVG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportDiagram('png')}
                >
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportDiagram('pdf')}
                >
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Diagram Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Architecture Diagrams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {diagrams.map((diagram) => (
              <Button
                key={diagram.id}
                variant={selectedDiagram === diagram.id ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  selectedDiagram === diagram.id 
                    ? 'bg-[#00c8d7] hover:bg-[#0099cc] text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDiagram(diagram.id)}
              >
                <div>
                  <div className="font-medium text-sm">{diagram.name}</div>
                  <div className="text-xs opacity-80 mt-1">{diagram.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Interactive Diagram */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div id="interactive-diagram">
              <InteractiveDiagram 
                type={selectedDiagram} 
                isAnimated={isAnimated}
                customerLogo={customerLogo}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Legend */}
      <ArchitectureLegend />

      {/* Modals */}
      {showPolicyEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PolicyEditor onClose={() => setShowPolicyEditor(false)} />
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <OnboardingScenarios onClose={() => setShowOnboarding(false)} />
        </div>
      )}
    </div>
  )
}
