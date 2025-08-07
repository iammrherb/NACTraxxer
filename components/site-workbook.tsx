'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Book, MapPin, Users, Calendar, Settings, Download, Edit, Save, FileText, FileSpreadsheet, Printer } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
  onSiteSelect?: (siteId: string) => void
}

interface SiteData {
  id: string
  name: string
  region: string
  country: string
  priority: string
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  status: string
  completionPercent: number
  notes: string
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: string
  plannedStart: string
  plannedEnd: string
  networkDetails?: {
    totalSwitches: number
    totalAPs: number
    mainSwitchModels: string
    mainAPModels: string
    vlanCount: number
    subnetDetails: string
    existingAAA: string
  }
  portnoxConfig?: {
    policyGroups: string[]
    authMethods: string[]
    specialPolicies: string
    highAvailability: string
  }
  testingPlan?: {
    pilotGroup: string
    pilotDate: string
    pilotDuration: string
    successCriteria: string
  }
  contacts?: Array<{
    name: string
    role: string
    email: string
  }>
  deploymentChecklist?: string[]
}

export default function SiteWorkbook({ siteId, onSiteSelect }: SiteWorkbookProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(siteId)
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<SiteData | null>(null)
  const [availableSites, setAvailableSites] = useState<Array<{id: string, name: string}>>([])

  // Sample comprehensive site data
  const allSitesData: { [key: string]: SiteData } = {
    'ABM-HQ001': {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 2500,
      projectManager: 'Alex Rivera',
      technicalOwners: ['John Smith', 'Mark Wilson'],
      status: 'In Progress',
      completionPercent: 35,
      notes: 'Executive network needs priority handling. Board room has custom AV equipment requiring special VLAN configuration.',
      wiredVendors: ['Cisco', 'Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-08-01',
      plannedEnd: '2025-08-15',
      networkDetails: {
        totalSwitches: 45,
        totalAPs: 120,
        mainSwitchModels: 'Cisco Catalyst 9300, Juniper EX4300',
        mainAPModels: 'Cisco Catalyst 9120AX',
        vlanCount: 25,
        subnetDetails: '10.1.0.0/16 primary, 192.168.1.0/24 guest, 172.16.1.0/24 IoT',
        existingAAA: 'Cisco ISE 3.1 (to be replaced)'
      },
      portnoxConfig: {
        policyGroups: ['Executives', 'Employees', 'Contractors', 'Guests', 'IoT Devices'],
        authMethods: ['802.1X EAP-TLS', 'MAC Authentication Bypass'],
        specialPolicies: 'Executive floor requires enhanced security policies with additional monitoring',
        highAvailability: 'Required with dual RADSec proxies in different availability zones'
      },
      testingPlan: {
        pilotGroup: 'IT Department (25 users)',
        pilotDate: '2025-07-25',
        pilotDuration: '1 week',
        successCriteria: '100% successful authentications, zero business disruption, all device types supported'
      },
      contacts: [
        { name: 'John Smith', role: 'Lead Network Engineer', email: 'john.smith@abm.com' },
        { name: 'Mark Wilson', role: 'Security Architect', email: 'mark.wilson@abm.com' },
        { name: 'Sarah Johnson', role: 'Site IT Manager', email: 'sarah.johnson@abm.com' }
      ],
      deploymentChecklist: ['Intune', 'Native', 'RADIUS', 'Switches', 'Wireless', 'MAB', 'Guest', 'Testing', 'Documentation']
    },
    'ABM-DC002': {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 150,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Emily Jones', 'Paul Davis'],
      status: 'In Progress',
      completionPercent: 65,
      notes: '24/7 operation requires careful change windows. Critical services must not be disrupted during deployment.',
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Linux', 'IoT'],
      radsec: 'LRAD',
      plannedStart: '2025-08-05',
      plannedEnd: '2025-08-12',
      networkDetails: {
        totalSwitches: 32,
        totalAPs: 15,
        mainSwitchModels: 'Cisco Nexus 9000 Series',
        mainAPModels: 'Aruba AP-515',
        vlanCount: 40,
        subnetDetails: '172.16.0.0/16 primary, 10.200.0.0/24 management',
        existingAAA: 'Cisco ACS 5.8 (legacy system)'
      },
      portnoxConfig: {
        policyGroups: ['DataCenter Admins', 'Server Team', 'Security Team', 'Vendors'],
        authMethods: ['802.1X EAP-TLS', 'MAC Authentication Bypass'],
        specialPolicies: 'Server connections require certificate validation and enhanced logging',
        highAvailability: 'Critical - requires redundant servers and 99.99% uptime'
      },
      testingPlan: {
        pilotGroup: 'Non-production server racks (10 switches)',
        pilotDate: '2025-07-30',
        pilotDuration: '3 days',
        successCriteria: '100% successful authentications, zero service disruption, all monitoring functional'
      },
      contacts: [
        { name: 'Emily Jones', role: 'DC Operations Manager', email: 'emily.jones@abm.com' },
        { name: 'Paul Davis', role: 'Senior Network Engineer', email: 'paul.davis@abm.com' },
        { name: 'Mike Rodriguez', role: 'Security Engineer', email: 'mike.rodriguez@abm.com' }
      ],
      deploymentChecklist: ['LRAD', 'RADIUS', 'Switches', 'MAB', 'Monitoring', 'Testing', 'Rollback Plan']
    },
    'ABM-EUR003': {
      id: 'ABM-EUR003',
      name: 'European Headquarters',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Medium',
      phase: '2',
      users: 1200,
      projectManager: 'Sofia Linden',
      technicalOwners: ['Sarah Thompson'],
      status: 'Planned',
      completionPercent: 0,
      notes: 'GDPR compliance required. Local data residency requirements must be met.',
      wiredVendors: ['HPE'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2025-09-01',
      plannedEnd: '2025-09-15',
      networkDetails: {
        totalSwitches: 38,
        totalAPs: 95,
        mainSwitchModels: 'HPE Aruba 6300M',
        mainAPModels: 'Cisco Catalyst 9130AX',
        vlanCount: 18,
        subnetDetails: '10.10.0.0/16 primary, 192.168.10.0/24 guest',
        existingAAA: 'Microsoft NPS (Windows Server 2019)'
      },
      portnoxConfig: {
        policyGroups: ['EU Employees', 'Contractors', 'Guests', 'GDPR Restricted'],
        authMethods: ['802.1X EAP-TLS', 'PEAP-MSCHAPv2'],
        specialPolicies: 'GDPR compliance requires data residency in EU region',
        highAvailability: 'Standard with EU-based RADSec proxies'
      },
      testingPlan: {
        pilotGroup: 'Finance Department (30 users)',
        pilotDate: '2025-08-25',
        pilotDuration: '1 week',
        successCriteria: 'GDPR compliance verified, 95% successful authentications'
      },
      contacts: [
        { name: 'Sarah Thompson', role: 'EU Network Manager', email: 'sarah.thompson@abm.com' },
        { name: 'Klaus Mueller', role: 'Local IT Support', email: 'klaus.mueller@abm.de' }
      ],
      deploymentChecklist: ['GDPR Review', 'Intune', 'Native', 'RADIUS', 'Switches', 'Wireless', 'Testing']
    }
  }

  useEffect(() => {
    // Initialize available sites
    const sites = Object.keys(allSitesData).map(id => ({
      id,
      name: allSitesData[id].name
    }))
    setAvailableSites(sites)

    // Set initial site data
    if (selectedSiteId && allSitesData[selectedSiteId]) {
      setSiteData(allSitesData[selectedSiteId])
    }
  }, [selectedSiteId])

  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId)
    setSiteData(allSitesData[siteId] || null)
    setIsEditing(false)
    if (onSiteSelect) {
      onSiteSelect(siteId)
    }
  }

  const startEditing = () => {
    if (siteData) {
      setEditedData({ ...siteData })
      setIsEditing(true)
    }
  }

  const saveChanges = () => {
    if (editedData) {
      setSiteData(editedData)
      // In a real app, this would save to backend
      console.log('Saving site data:', editedData)
      setIsEditing(false)
    }
  }

  const cancelEditing = () => {
    setEditedData(null)
    setIsEditing(false)
  }

  const exportWorkbook = (format: 'pdf' | 'excel' | 'word') => {
    if (!siteData) return
    
    // In a real app, this would generate and download the file
    console.log(`Exporting workbook for ${siteData.name} as ${format}`)
    
    // Simulate file download
    const element = document.createElement('a')
    const content = generateWorkbookContent(siteData, format)
    const file = new Blob([content], { type: getContentType(format) })
    element.href = URL.createObjectURL(file)
    element.download = `${siteData.id}_workbook.${getFileExtension(format)}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const generateWorkbookContent = (data: SiteData, format: string): string => {
    if (format === 'pdf' || format === 'word') {
      return `
Site Workbook: ${data.name}
================================

Site Information:
- Site ID: ${data.id}
- Name: ${data.name}
- Region: ${data.region}
- Country: ${data.country}
- Priority: ${data.priority}
- Phase: ${data.phase}
- Users: ${data.users}

Project Management:
- Project Manager: ${data.projectManager}
- Technical Owners: ${data.technicalOwners.join(', ')}
- Status: ${data.status}
- Completion: ${data.completionPercent}%

Timeline:
- Planned Start: ${data.plannedStart}
- Planned End: ${data.plannedEnd}

Network Configuration:
- Wired Vendors: ${data.wiredVendors.join(', ')}
- Wireless Vendors: ${data.wirelessVendors.join(', ')}
- Device Types: ${data.deviceTypes.join(', ')}
- RADSEC Implementation: ${data.radsec}

${data.networkDetails ? `
Network Details:
- Total Switches: ${data.networkDetails.totalSwitches}
- Total APs: ${data.networkDetails.totalAPs}
- Switch Models: ${data.networkDetails.mainSwitchModels}
- AP Models: ${data.networkDetails.mainAPModels}
- VLAN Count: ${data.networkDetails.vlanCount}
- Subnet Details: ${data.networkDetails.subnetDetails}
- Existing AAA: ${data.networkDetails.existingAAA}
` : ''}

${data.portnoxConfig ? `
Portnox Configuration:
- Policy Groups: ${data.portnoxConfig.policyGroups.join(', ')}
- Auth Methods: ${data.portnoxConfig.authMethods.join(', ')}
- Special Policies: ${data.portnoxConfig.specialPolicies}
- High Availability: ${data.portnoxConfig.highAvailability}
` : ''}

${data.testingPlan ? `
Testing Plan:
- Pilot Group: ${data.testingPlan.pilotGroup}
- Pilot Date: ${data.testingPlan.pilotDate}
- Duration: ${data.testingPlan.pilotDuration}
- Success Criteria: ${data.testingPlan.successCriteria}
` : ''}

${data.contacts ? `
Contacts:
${data.contacts.map(contact => `- ${contact.name} (${contact.role}): ${contact.email}`).join('\n')}
` : ''}

Notes:
${data.notes}
      `
    } else {
      // Excel/CSV format
      return `Site ID,Name,Region,Country,Priority,Phase,Users,Project Manager,Status,Completion %
${data.id},${data.name},${data.region},${data.country},${data.priority},${data.phase},${data.users},${data.projectManager},${data.status},${data.completionPercent}`
    }
  }

  const getContentType = (format: string): string => {
    switch (format) {
      case 'pdf': return 'application/pdf'
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'word': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      default: return 'text/plain'
    }
  }

  const getFileExtension = (format: string): string => {
    switch (format) {
      case 'pdf': return 'pdf'
      case 'excel': return 'xlsx'
      case 'word': return 'docx'
      default: return 'txt'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planned': return 'text-gray-600'
      case 'Delayed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const currentData = isEditing ? editedData : siteData

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-blue-600" />
              <span>Site Workbook</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedSiteId || ''} onValueChange={handleSiteSelect}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a site..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.id} - {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {currentData && (
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={startEditing}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveChanges}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Workbook</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-4">
                        <Button onClick={() => exportWorkbook('pdf')} className="flex flex-col items-center p-6">
                          <FileText className="h-8 w-8 mb-2" />
                          PDF Report
                        </Button>
                        <Button onClick={() => exportWorkbook('excel')} className="flex flex-col items-center p-6">
                          <FileSpreadsheet className="h-8 w-8 mb-2" />
                          Excel Workbook
                        </Button>
                        <Button onClick={() => exportWorkbook('word')} className="flex flex-col items-center p-6">
                          <Printer className="h-8 w-8 mb-2" />
                          Word Document
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!currentData ? (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Site Selected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please select a site from the dropdown above to view its detailed workbook.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Site Information Section */}
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Site Information</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <Label htmlFor="site-name">Site Name</Label>
                          <Input
                            id="site-name"
                            value={editedData?.name || ''}
                            onChange={(e) => setEditedData(prev => prev ? {...prev, name: e.target.value} : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Select
                            value={editedData?.region || ''}
                            onValueChange={(value) => setEditedData(prev => prev ? {...prev, region: value} : null)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="North America">North America</SelectItem>
                              <SelectItem value="EMEA">EMEA</SelectItem>
                              <SelectItem value="APAC">APAC</SelectItem>
                              <SelectItem value="LATAM">LATAM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={editedData?.country || ''}
                            onChange={(e) => setEditedData(prev => prev ? {...prev, country: e.target.value} : null)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Site ID:</span>
                          <span className="font-mono">{currentData.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                          <span>{currentData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                          <span>{currentData.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Country:</span>
                          <span>{currentData.country}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={editedData?.priority || ''}
                            onValueChange={(value) => setEditedData(prev => prev ? {...prev, priority: value} : null)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="users">Number of Users</Label>
                          <Input
                            id="users"
                            type="number"
                            value={editedData?.users || 0}
                            onChange={(e) => setEditedData(prev => prev ? {...prev, users: parseInt(e.target.value)} : null)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                          <Badge className={getPriorityColor(currentData.priority)}>
                            {currentData.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Phase:</span>
                          <span>Phase {currentData.phase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Users:</span>
                          <span>{currentData.users.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Project Team Section */}
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Project Team</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Project Manager:</span>
                      <span>{currentData.projectManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Technical Owners:</span>
                      <div className="text-right">
                        {currentData.technicalOwners.map((owner, index) => (
                          <div key={index}>{owner}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${getStatusColor(currentData.status)}`}>
                        {currentData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${currentData.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{currentData.completionPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline Section */}
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Project Timeline</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Planned Start:</span>
                    <span>{new Date(currentData.plannedStart).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Planned End:</span>
                    <span>{new Date(currentData.plannedEnd).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                    <span>
                      {Math.ceil((new Date(currentData.plannedEnd).getTime() - new Date(currentData.plannedStart).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Technical Configuration Section */}
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Technical Configuration</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">RADSEC Implementation:</span>
                    <Badge variant="outline">{currentData.radsec}</Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Wired Vendors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentData.wiredVendors.map((vendor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Wireless Vendors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentData.wirelessVendors.map((vendor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Device Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentData.deviceTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Details Section */}
              {currentData.networkDetails && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Network Infrastructure Details</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Total Switches:</span>
                          <span>{currentData.networkDetails.totalSwitches}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Total Access Points:</span>
                          <span>{currentData.networkDetails.totalAPs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">VLAN Count:</span>
                          <span>{currentData.networkDetails.vlanCount}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Switch Models:</span>
                          <p className="text-sm mt-1">{currentData.networkDetails.mainSwitchModels}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">AP Models:</span>
                          <p className="text-sm mt-1">{currentData.networkDetails.mainAPModels}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Subnet Details:</span>
                      <p className="text-sm mt-1">{currentData.networkDetails.subnetDetails}</p>
                    </div>
                    <div className="mt-4">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Existing AAA System:</span>
                      <p className="text-sm mt-1">{currentData.networkDetails.existingAAA}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Portnox Configuration Section */}
              {currentData.portnoxConfig && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Portnox Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Policy Groups:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentData.portnoxConfig.policyGroups.map((group, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Authentication Methods:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentData.portnoxConfig.authMethods.map((method, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Special Policies:</span>
                        <p className="text-sm mt-1">{currentData.portnoxConfig.specialPolicies}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">High Availability:</span>
                        <p className="text-sm mt-1">{currentData.portnoxConfig.highAvailability}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Testing Plan Section */}
              {currentData.testingPlan && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Testing & Pilot Plan</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Pilot Group:</span>
                          <span className="text-sm">{currentData.testingPlan.pilotGroup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Pilot Date:</span>
                          <span>{new Date(currentData.testingPlan.pilotDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                          <span>{currentData.testingPlan.pilotDuration}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Success Criteria:</span>
                          <p className="text-sm mt-1">{currentData.testingPlan.successCriteria}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Contacts Section */}
              {currentData.contacts && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Contacts</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {currentData.contacts.map((contact, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{contact.role}</div>
                          <div className="text-sm text-blue-600">{contact.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Deployment Checklist Section */}
              {currentData.deploymentChecklist && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Deployment Checklist</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {currentData.deploymentChecklist.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`checklist-${index}`}
                            className="rounded"
                            defaultChecked={currentData.completionPercent > (index / currentData.deploymentChecklist!.length) * 100}
                          />
                          <label htmlFor={`checklist-${index}`} className="text-sm">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes Section */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Project Notes</h3>
                {isEditing ? (
                  <Textarea
                    value={editedData?.notes || ''}
                    onChange={(e) => setEditedData(prev => prev ? {...prev, notes: e.target.value} : null)}
                    className="min-h-[100px]"
                    placeholder="Enter project notes, special considerations, dependencies, or requirements..."
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {currentData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
