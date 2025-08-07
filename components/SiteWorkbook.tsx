'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Book, FileText, Network, Users, Settings, Download, Save, Edit, Plus, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

interface WorkbookSection {
  id: string
  title: string
  content: string
  lastModified: string
  author: string
  status: 'draft' | 'review' | 'approved'
}

interface SiteConfiguration {
  networkDetails: {
    primaryVLAN: string
    guestVLAN: string
    iotVLAN: string
    managementVLAN: string
    subnets: string[]
    dnsServers: string[]
    ntpServers: string[]
  }
  authentication: {
    radiusServers: string[]
    ldapServers: string[]
    certificateAuthority: string
    authenticationMethods: string[]
  }
  policies: {
    userPolicies: string[]
    devicePolicies: string[]
    guestPolicies: string[]
    compliancePolicies: string[]
  }
  contacts: {
    projectManager: string
    technicalLead: string
    networkAdmin: string
    securityContact: string
  }
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSite, setSelectedSite] = useState('1')

  const [workbookSections, setWorkbookSections] = useState<WorkbookSection[]>([
    {
      id: 'overview',
      title: 'Site Overview',
      content: `# New York Headquarters - Site Overview

## Location Details
- **Address**: 123 Corporate Plaza, New York, NY 10001
- **Building Type**: Corporate Headquarters
- **Floors**: 25 floors
- **Square Footage**: 500,000 sq ft
- **Occupancy**: 2,500 employees

## Network Infrastructure
- **Primary ISP**: Verizon Business (1Gbps)
- **Backup ISP**: AT&T Business (500Mbps)
- **Internal Backbone**: 10Gbps fiber
- **Wireless Coverage**: 95% building coverage
- **Wired Ports**: 5,000 active ports

## Current State
- Legacy 802.1X implementation with Windows NPS
- Mixed vendor environment (Cisco/Aruba)
- Limited guest access capabilities
- Manual device onboarding processes

## Project Scope
- Implement Portnox Cloud NAC solution
- Certificate-based authentication for all devices
- Automated guest access portal
- IoT device segmentation and control
- Integration with Azure AD and Intune`,
      lastModified: '2024-02-15',
      author: 'Alex Rivera',
      status: 'approved'
    },
    {
      id: 'network-design',
      title: 'Network Design',
      content: `# Network Architecture Design

## VLAN Structure
- **VLAN 100**: Corporate Users (192.168.100.0/24)
- **VLAN 200**: Guest Access (192.168.200.0/24)
- **VLAN 300**: IoT Devices (192.168.300.0/24)
- **VLAN 400**: BYOD Devices (192.168.400.0/24)
- **VLAN 999**: Quarantine (192.168.999.0/24)

## Network Segmentation
- Corporate users have full access to internal resources
- Guest users limited to internet access only
- IoT devices restricted to specific services
- BYOD devices have limited corporate access

## Security Zones
- **Trusted Zone**: Corporate devices with certificates
- **Guest Zone**: Temporary access with time limits
- **IoT Zone**: Device-specific access controls
- **Quarantine Zone**: Non-compliant devices

## Access Control Lists
- Detailed ACLs for each VLAN
- Application-based filtering
- Time-based access restrictions
- Bandwidth limitations per device type`,
      lastModified: '2024-02-10',
      author: 'John Smith',
      status: 'approved'
    },
    {
      id: 'implementation-plan',
      title: 'Implementation Plan',
      content: `# Implementation Timeline

## Phase 1: Infrastructure Preparation (Weeks 1-2)
- Network assessment and documentation
- Portnox Cloud tenant setup
- Certificate Authority configuration
- RADIUS integration testing

## Phase 2: Pilot Deployment (Weeks 3-4)
- Select pilot user group (50 users)
- Deploy certificates to pilot devices
- Configure initial policies
- Test authentication flows

## Phase 3: Gradual Rollout (Weeks 5-8)
- Department-by-department rollout
- User training and communication
- Issue tracking and resolution
- Policy refinement

## Phase 4: Full Production (Weeks 9-12)
- Complete user migration
- Guest access portal activation
- IoT device onboarding
- Final testing and validation

## Risk Mitigation
- Maintain parallel legacy system during transition
- 24/7 support during critical phases
- Rollback procedures documented
- Emergency contact procedures established`,
      lastModified: '2024-02-08',
      author: 'Alex Rivera',
      status: 'review'
    },
    {
      id: 'testing-procedures',
      title: 'Testing Procedures',
      content: `# Testing and Validation Procedures

## Pre-Deployment Testing
1. **Certificate Validation**
   - Verify certificate chain trust
   - Test certificate revocation
   - Validate SCEP enrollment process

2. **Authentication Testing**
   - EAP-TLS authentication flows
   - RADIUS server connectivity
   - Policy evaluation accuracy

3. **Network Connectivity**
   - VLAN assignment verification
   - ACL enforcement testing
   - Internet connectivity validation

## User Acceptance Testing
- Test with representative device types
- Validate user experience flows
- Performance and reliability testing
- Guest access portal functionality

## Rollback Procedures
- Document rollback triggers
- Maintain legacy system readiness
- Test rollback procedures regularly
- Communication plan for rollback scenarios`,
      lastModified: '2024-02-05',
      author: 'Emily Jones',
      status: 'draft'
    }
  ])

  const [siteConfiguration, setSiteConfiguration] = useState<SiteConfiguration>({
    networkDetails: {
      primaryVLAN: '100',
      guestVLAN: '200',
      iotVLAN: '300',
      managementVLAN: '999',
      subnets: ['192.168.100.0/24', '192.168.200.0/24', '192.168.300.0/24'],
      dnsServers: ['8.8.8.8', '8.8.4.4'],
      ntpServers: ['pool.ntp.org', 'time.google.com']
    },
    authentication: {
      radiusServers: ['radius1.company.com', 'radius2.company.com'],
      ldapServers: ['ldap.company.com'],
      certificateAuthority: 'Portnox Private CA',
      authenticationMethods: ['EAP-TLS', 'PEAP-MSCHAPv2', 'MAC Authentication']
    },
    policies: {
      userPolicies: ['Corporate Users', 'Contractors', 'Guests'],
      devicePolicies: ['Windows Devices', 'Mac Devices', 'Mobile Devices', 'IoT Devices'],
      guestPolicies: ['Standard Guest', 'VIP Guest', 'Vendor Access'],
      compliancePolicies: ['Antivirus Required', 'OS Updates', 'Encryption Enabled']
    },
    contacts: {
      projectManager: 'Alex Rivera',
      technicalLead: 'John Smith',
      networkAdmin: 'Emily Jones',
      securityContact: 'Michael Zhang'
    }
  })

  const sites = [
    { id: '1', name: 'New York Headquarters', status: 'In Progress' },
    { id: '2', name: 'London Office', status: 'Complete' },
    { id: '3', name: 'Tokyo Branch', status: 'Planned' },
    { id: '4', name: 'Chicago Manufacturing', status: 'In Progress' },
    { id: '5', name: 'Sydney Office', status: 'Delayed' }
  ]

  const handleSectionUpdate = (sectionId: string, newContent: string) => {
    setWorkbookSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: newContent,
              lastModified: new Date().toISOString().split('T')[0],
              status: 'draft' as const
            }
          : section
      )
    )
  }

  const handleAddSection = () => {
    const newSection: WorkbookSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '# New Section\n\nAdd your content here...',
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Current User',
      status: 'draft'
    }
    setWorkbookSections([...workbookSections, newSection])
  }

  const handleDeleteSection = (sectionId: string) => {
    setWorkbookSections(sections => sections.filter(s => s.id !== sectionId))
  }

  const handleExportWorkbook = () => {
    const exportData = {
      site: sites.find(s => s.id === selectedSite),
      sections: workbookSections,
      configuration: siteConfiguration,
      exportDate: new Date().toISOString(),
      version: '20.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `site-workbook-${selectedSite}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    showNotification('Workbook exported successfully!', 'success')
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'draft':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const selectedSiteData = sites.find(s => s.id === selectedSite)
  const currentSection = workbookSections.find(s => s.id === activeSection)

  if (!siteId && !selectedSite) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Site Selected</h3>
          <p className="text-gray-500 mb-4">
            Select a site from the Master Site List to view its workbook
          </p>
          <Button variant="outline">
            Go to Site List
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Book className="h-6 w-6 text-[#00c8d7]" />
              <div>
                <CardTitle className="text-xl">Site Workbook</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive documentation and configuration for site deployment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center space-x-2">
                        <span>{site.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {site.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportWorkbook}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'View' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {selectedSiteData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sections</CardTitle>
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={handleAddSection}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {workbookSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-[#00c8d7] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(section.status)}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSection(section.id)
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-1">
                    <Badge className={`text-xs ${getStatusColor(section.status)}`}>
                      {section.status}
                    </Badge>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Modified: {section.lastModified}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedSiteData.name} - {currentSection?.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Last modified: {currentSection?.lastModified} by {currentSection?.author}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {currentSection && (
                    <Badge className={getStatusColor(currentSection.status)}>
                      {currentSection.status}
                    </Badge>
                  )}
                  {isEditing && (
                    <Button size="sm" className="bg-[#00c8d7] hover:bg-[#0099cc]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentSection ? (
                <div className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={currentSection.content}
                      onChange={(e) => handleSectionUpdate(currentSection.id, e.target.value)}
                      className="min-h-[500px] font-mono text-sm"
                      placeholder="Enter section content in Markdown format..."
                    />
                  ) : (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {currentSection.content}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium mb-2">No Section Selected</div>
                  <div className="text-sm">
                    Select a section from the navigation to view its content
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration Tab */}
      <Tabs defaultValue="documentation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-[#00c8d7]" />
                  <span>Network Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-vlan">Primary VLAN</Label>
                    <Input
                      id="primary-vlan"
                      value={siteConfiguration.networkDetails.primaryVLAN}
                      onChange={(e) => setSiteConfiguration({
                        ...siteConfiguration,
                        networkDetails: {
                          ...siteConfiguration.networkDetails,
                          primaryVLAN: e.target.value
                        }
                      })}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guest-vlan">Guest VLAN</Label>
                    <Input
                      id="guest-vlan"
                      value={siteConfiguration.networkDetails.guestVLAN}
                      onChange={(e) => setSiteConfiguration({
                        ...siteConfiguration,
                        networkDetails: {
                          ...siteConfiguration.networkDetails,
                          guestVLAN: e.target.value
                        }
                      })}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subnets">Subnets</Label>
                  <Textarea
                    id="subnets"
                    value={siteConfiguration.networkDetails.subnets.join('\n')}
                    onChange={(e) => setSiteConfiguration({
                      ...siteConfiguration,
                      networkDetails: {
                        ...siteConfiguration.networkDetails,
                        subnets: e.target.value.split('\n').filter(s => s.trim())
                      }
                    })}
                    rows={3}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Authentication Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-[#00c8d7]" />
                  <span>Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ca">Certificate Authority</Label>
                  <Input
                    id="ca"
                    value={siteConfiguration.authentication.certificateAuthority}
                    onChange={(e) => setSiteConfiguration({
                      ...siteConfiguration,
                      authentication: {
                        ...siteConfiguration.authentication,
                        certificateAuthority: e.target.value
                      }
                    })}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="radius-servers">RADIUS Servers</Label>
                  <Textarea
                    id="radius-servers"
                    value={siteConfiguration.authentication.radiusServers.join('\n')}
                    onChange={(e) => setSiteConfiguration({
                      ...siteConfiguration,
                      authentication: {
                        ...siteConfiguration.authentication,
                        radiusServers: e.target.value.split('\n').filter(s => s.trim())
                      }
                    })}
                    rows={2}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-[#00c8d7]" />
                  <span>Project Contacts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-manager">Project Manager</Label>
                    <Input
                      id="project-manager"
                      value={siteConfiguration.contacts.projectManager}
                      onChange={(e) => setSiteConfiguration({
                        ...siteConfiguration,
                        contacts: {
                          ...siteConfiguration.contacts,
                          projectManager: e.target.value
                        }
                      })}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technical-lead">Technical Lead</Label>
                    <Input
                      id="technical-lead"
                      value={siteConfiguration.contacts.technicalLead}
                      onChange={(e) => setSiteConfiguration({
                        ...siteConfiguration,
                        contacts: {
                          ...siteConfiguration.contacts,
                          technicalLead: e.target.value
                        }
                      })}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="user-policies">User Policies</Label>
                  <Textarea
                    id="user-policies"
                    value={siteConfiguration.policies.userPolicies.join('\n')}
                    onChange={(e) => setSiteConfiguration({
                      ...siteConfiguration,
                      policies: {
                        ...siteConfiguration.policies,
                        userPolicies: e.target.value.split('\n').filter(s => s.trim())
                      }
                    })}
                    rows={3}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="device-policies">Device Policies</Label>
                  <Textarea
                    id="device-policies"
                    value={siteConfiguration.policies.devicePolicies.join('\n')}
                    onChange={(e) => setSiteConfiguration({
                      ...siteConfiguration,
                      policies: {
                        ...siteConfiguration.policies,
                        devicePolicies: e.target.value.split('\n').filter(s => s.trim())
                      }
                    })}
                    rows={3}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
