'use client'

import { useEffect, useRef } from 'react'

interface InteractiveDiagramProps {
  view: string
  vendor: string
  connectivity: string
  identity: string
  deployment: string
}

export default function InteractiveDiagram({
  view,
  vendor,
  connectivity,
  identity,
  deployment
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      drawDiagram()
    }
  }, [view, vendor, connectivity, identity, deployment])

  const drawDiagram = () => {
    const svg = svgRef.current
    if (!svg) return

    // Clear existing content
    svg.innerHTML = ''

    switch (view) {
      case 'radsec-proxy':
        drawRADSecProxyDiagram(svg)
        break
      case 'zero-trust-nac':
        drawZeroTrustDiagram(svg)
        break
      case '802.1x-auth':
        drawAuthFlowDiagram(svg)
        break
      case 'pki-infrastructure':
        drawPKIDiagram(svg)
        break
      default:
        drawDefaultDiagram(svg)
        break
    }
  }

  const drawRADSecProxyDiagram = (svg: SVGSVGElement) => {
    const width = 1200
    const height = 600

    // Site Network (Left side)
    createRect(svg, 50, 150, 200, 300, '#e8f5e9', '#4caf50', 'ABM Site Network')
    
    // Devices
    createCircle(svg, 100, 200, 25, '#81c784', 'Corporate')
    createCircle(svg, 100, 250, 25, '#ffb74d', 'BYOD')
    createCircle(svg, 100, 300, 25, '#f06292', 'IoT')
    
    // Network Equipment
    createRect(svg, 180, 220, 60, 40, '#c8e6c9', '#388e3c', 'Switch/AP')

    // RADSec Proxy (Center)
    createRect(svg, 350, 250, 150, 100, '#fff3e0', '#ff9800', 'RADSec Proxy')
    createText(svg, 425, 285, 'TLS Encryption', 12, '#bf360c')
    createText(svg, 425, 305, 'No Load Balancer', 12, '#bf360c')
    createText(svg, 425, 325, 'No Redis Cache', 12, '#bf360c')

    // Internet/WAN
    createEllipse(svg, 600, 300, 80, 40, '#e3f2fd', '#2196f3', 'Internet/WAN')

    // Portnox Cloud (Right side)
    createRect(svg, 800, 150, 300, 300, '#e3f2fd', '#1976d2', 'Portnox Cloud')
    
    // Cloud Services
    createRect(svg, 820, 200, 120, 50, '#bbdefb', '#1565c0', 'Cloud RADIUS')
    createRect(svg, 960, 200, 120, 50, '#bbdefb', '#1565c0', 'Policy Engine')
    createRect(svg, 820, 280, 120, 50, '#bbdefb', '#1565c0', 'Identity Store')
    createRect(svg, 960, 280, 120, 50, '#bbdefb', '#1565c0', 'PKI Services')
    createRect(svg, 890, 360, 120, 50, '#bbdefb', '#1565c0', 'Analytics')

    // Connections
    createArrow(svg, 125, 225, 180, 240, '#4caf50', 2)
    createArrow(svg, 240, 240, 350, 280, '#ff9800', 3)
    createArrow(svg, 500, 300, 520, 300, '#2196f3', 3)
    createArrow(svg, 680, 300, 800, 280, '#1976d2', 3)

    // Labels
    createText(svg, 150, 180, 'RADIUS', 14, '#388e3c')
    createText(svg, 290, 220, 'RADIUS', 14, '#f57c00')
    createText(svg, 560, 280, 'RADSec/TLS', 14, '#1565c0')
    createText(svg, 740, 260, 'Encrypted', 14, '#1565c0')

    // Benefits box
    createRect(svg, 50, 500, 500, 80, '#e8f5e9', '#4caf50', '')
    createText(svg, 60, 520, 'RADSec Proxy Benefits:', 14, '#2e7d32', 'bold')
    createText(svg, 60, 540, '• Direct cloud connection - no load balancer needed', 12, '#388e3c')
    createText(svg, 60, 555, '• Real-time authentication - no caching required', 12, '#388e3c')
    createText(svg, 60, 570, '• Simplified architecture reduces complexity and cost', 12, '#388e3c')
  }

  const drawZeroTrustDiagram = (svg: SVGSVGElement) => {
    // Zero Trust NAC Architecture
    createRect(svg, 100, 100, 200, 150, '#e8f5e9', '#4caf50', 'Network Infrastructure')
    createRect(svg, 400, 100, 200, 150, '#fff3e0', '#ff9800', 'Identity Provider')
    createRect(svg, 700, 100, 200, 150, '#e3f2fd', '#2196f3', 'Portnox Cloud')
    createRect(svg, 400, 350, 200, 150, '#f3e5f5', '#9c27b0', 'Policy Engine')

    // Connections
    createArrow(svg, 300, 175, 400, 175, '#666', 2)
    createArrow(svg, 600, 175, 700, 175, '#666', 2)
    createArrow(svg, 500, 250, 500, 350, '#666', 2)
  }

  const drawAuthFlowDiagram = (svg: SVGSVGElement) => {
    // 802.1X Authentication Flow
    const steps = [
      { x: 100, y: 150, label: 'Device Connect' },
      { x: 300, y: 150, label: 'EAP Request' },
      { x: 500, y: 150, label: 'Certificate Auth' },
      { x: 700, y: 150, label: 'Policy Decision' },
      { x: 900, y: 150, label: 'VLAN Assignment' }
    ]

    steps.forEach((step, index) => {
      createCircle(svg, step.x, step.y, 40, '#2196f3', step.label)
      if (index < steps.length - 1) {
        createArrow(svg, step.x + 40, step.y, steps[index + 1].x - 40, steps[index + 1].y, '#666', 2)
      }
    })
  }

  const drawPKIDiagram = (svg: SVGSVGElement) => {
    // PKI Infrastructure
    createRect(svg, 400, 50, 200, 100, '#e3f2fd', '#2196f3', 'Portnox PKI CA')
    createRect(svg, 200, 250, 150, 80, '#fff3e0', '#ff9800', 'SCEP Server')
    createRect(svg, 450, 250, 150, 80, '#e8f5e9', '#4caf50', 'OCSP Responder')
    createRect(svg, 700, 250, 150, 80, '#f3e5f5', '#9c27b0', 'Certificate Store')

    // Connections
    createArrow(svg, 450, 150, 275, 250, '#666', 2)
    createArrow(svg, 550, 150, 525, 250, '#666', 2)
    createArrow(svg, 650, 150, 775, 250, '#666', 2)
  }

  const drawDefaultDiagram = (svg: SVGSVGElement) => {
    // Default diagram
    createRect(svg, 300, 200, 200, 100, '#e3f2fd', '#2196f3', 'Portnox NAC')
    createText(svg, 400, 250, 'Architecture Diagram', 16, '#1976d2', 'bold')
  }

  // Helper functions for SVG creation
  const createRect = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, fill: string, stroke: string, label: string) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', height.toString())
    rect.setAttribute('fill', fill)
    rect.setAttribute('stroke', stroke)
    rect.setAttribute('stroke-width', '2')
    rect.setAttribute('rx', '8')
    svg.appendChild(rect)

    if (label) {
      createText(svg, x + width/2, y + height/2, label, 14, stroke, 'bold')
    }
  }

  const createCircle = (svg: SVGSVGElement, cx: number, cy: number, r: number, fill: string, label: string) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', cx.toString())
    circle.setAttribute('cy', cy.toString())
    circle.setAttribute('r', r.toString())
    circle.setAttribute('fill', fill)
    circle.setAttribute('stroke', '#333')
    circle.setAttribute('stroke-width', '2')
    svg.appendChild(circle)

    if (label) {
      createText(svg, cx, cy + r + 15, label, 12, '#333')
    }
  }

  const createEllipse = (svg: SVGSVGElement, cx: number, cy: number, rx: number, ry: number, fill: string, stroke: string, label: string) => {
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
    ellipse.setAttribute('cx', cx.toString())
    ellipse.setAttribute('cy', cy.toString())
    ellipse.setAttribute('rx', rx.toString())
    ellipse.setAttribute('ry', ry.toString())
    ellipse.setAttribute('fill', fill)
    ellipse.setAttribute('stroke', stroke)
    ellipse.setAttribute('stroke-width', '2')
    svg.appendChild(ellipse)

    if (label) {
      createText(svg, cx, cy, label, 14, stroke, 'bold')
    }
  }

  const createArrow = (svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, color: string, width: number) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', width.toString())
    line.setAttribute('marker-end', 'url(#arrowhead)')
    svg.appendChild(line)

    // Create arrowhead marker if it doesn't exist
    if (!svg.querySelector('#arrowhead')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
      marker.setAttribute('id', 'arrowhead')
      marker.setAttribute('markerWidth', '10')
      marker.setAttribute('markerHeight', '7')
      marker.setAttribute('refX', '9')
      marker.setAttribute('refY', '3.5')
      marker.setAttribute('orient', 'auto')

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('points', '0 0, 10 3.5, 0 7')
      polygon.setAttribute('fill', color)

      marker.appendChild(polygon)
      defs.appendChild(marker)
      svg.appendChild(defs)
    }
  }

  const createText = (svg: SVGSVGElement, x: number, y: number, text: string, fontSize: number, fill: string, fontWeight: string = 'normal') => {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textElement.setAttribute('x', x.toString())
    textElement.setAttribute('y', y.toString())
    textElement.setAttribute('text-anchor', 'middle')
    textElement.setAttribute('dominant-baseline', 'middle')
    textElement.setAttribute('font-size', fontSize.toString())
    textElement.setAttribute('fill', fill)
    textElement.setAttribute('font-weight', fontWeight)
    textElement.textContent = text
    svg.appendChild(textElement)
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        viewBox="0 0 1200 600"
        className="w-full h-auto"
        style={{ maxHeight: '600px' }}
      >
        {/* SVG content will be dynamically generated */}
      </svg>
    </div>
  )
}
