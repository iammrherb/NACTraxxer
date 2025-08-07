'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Button } from '@/components/ui/badge'
import { Book, MapPin, Users, Calendar, Settings, Network, CheckCircle, AlertTriangle, Clock, FileText, Download } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  // Sample site data - in a real app this would be fetched based on siteId
  const siteData = siteId ? {
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
    notes: 'Executive network needs priority handling. Board room has custom AV equipment.',
    wiredVendors: ['Cisco', 'Juniper'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
    radsec: 'Native',
    plannedStart: '2025-08-01',
    plannedEnd: '2025-08-15'
  } : null

  if (!siteId || !siteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Site Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a site from the Master List to view its detailed workbook.
            </p>
          </div>
        </CardContent>
      </Card>
    )
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

  const exportWorkbook = (format: 'pdf' | 'excel') => {
    const workbookData = {
      siteInfo: siteData,
      networkDetails: {
        totalSwitches: 32,
        totalAPs: 45,
        switchModels: 'Cisco Catalyst 9300',
        apModels: 'Cisco 9130AXI'
      },
      exportDate: new Date().toISOString(),
      exportFormat: format
    }

    if (format === 'pdf') {
      // Create PDF content
      const pdfContent = `
Site Workbook: ${siteData?.name}
Generated: ${new Date().toLocaleDateString()}

Site Information:
- Site ID: ${siteData?.id}
- Region: ${siteData?.region}
- Users: ${siteData?.users}
- Status: ${siteData?.status}

Network Infrastructure:
- Total Switches: 32
- Total Access Points: 45
- Switch Models: Cisco Catalyst 9300
- AP Models: Cisco 9130AXI

Project Team:
- Project Manager: ${siteData?.projectManager}
- Technical Owners: ${siteData?.technicalOwners.join(', ')}
    `
      
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${siteData?.id}-workbook-${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // Create Excel-compatible CSV
      const csvContent = [
        ['Site Workbook Export'],
        ['Generated', new Date().toLocaleDateString()],
        [''],
        ['Site Information'],
        ['Site ID', siteData?.id],
        ['Site Name', siteData?.name],
        ['Region', siteData?.region],
        ['Country', siteData?.country],
        ['Users', siteData?.users],
        ['Status', siteData?.status],
        [''],
        ['Project Team'],
        ['Project Manager', siteData?.projectManager],
        ['Technical Owners', siteData?.technicalOwners.join(', ')],
        [''],
        ['Network Infrastructure'],
        ['Total Switches', '32'],
        ['Total Access Points', '45'],
        ['Switch Models', 'Cisco Catalyst 9300'],
        ['AP Models', 'Cisco 9130AXI']
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${siteData?.id}-workbook-${Date.now()}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook: {siteData.name}</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportWorkbook('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportWorkbook('excel')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Site Information</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Site ID:</span>
                  <span className="font-mono">{siteData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                  <span>{siteData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Country:</span>
                  <span>{siteData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                  <Badge className={getPriorityColor(siteData.priority)}>
                    {siteData.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Phase:</span>
                  <span>Phase {siteData.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Users:</span>
                  <span>{siteData.users.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Project Team</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Project Manager:</span>
                  <span>{siteData.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Technical Owners:</span>
                  <div className="text-right">
                    {siteData.technicalOwners.map((owner, index) => (
                      <div key={index}>{owner}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor(siteData.status)}`}>
                    {siteData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${siteData.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{siteData.completionPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Project Timeline</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned Start:</span>
                  <span>{new Date(siteData.plannedStart).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned End:</span>
                  <span>{new Date(siteData.plannedEnd).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>
                    {Math.ceil((new Date(siteData.plannedEnd).getTime() - new Date(siteData.plannedStart).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Technical Configuration</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">RADSEC Implementation:</span>
                  <Badge variant="outline">{siteData.radsec}</Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wired Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wiredVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wireless Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wirelessVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Device Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.deviceTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Details Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-600" />
              <span>Network Infrastructure</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Total Switches:</span>
                  <span>32</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Total Access Points:</span>
                  <span>45</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Switch Models:</span>
                  <span>Cisco Catalyst 9300</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">AP Models:</span>
                  <span>Cisco 9130AXI</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">VLANs:</span>
                  <span>12 configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Subnets:</span>
                  <span>10.10.0.0/16</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Existing AAA:</span>
                  <span>ISE (to be replaced)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portnox Configuration */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Portnox Configuration</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Policy Groups:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['Executives', 'IT Staff', 'General Users', 'Contractors', 'Guests'].map((group, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Auth Methods:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['802.1X', 'MAC Auth', 'Web Auth'].map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">High Availability:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Certificate Type:</span>
                  <span>EAP-TLS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Plan */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span>Testing & Validation Plan</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Pilot Phase</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pilot Group:</span> Executive floor (50 users)
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> 5 business days
                  </div>
                  <div>
                    <span className="font-medium">Start Date:</span> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Success Criteria:</span> 95% auth success
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Phase 1: Preparation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Certificate deployment</li>
                    <li>• Network configuration</li>
                    <li>• Policy setup</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Phase 2: Testing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Device authentication</li>
                    <li>• Policy enforcement</li>
                    <li>• Failover scenarios</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-2">Phase 3: Rollout</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Full deployment</li>
                    <li>• User training</li>
                    <li>• Documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Checklist */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span>Deployment Checklist</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { task: 'Intune Integration', status: 'complete' },
                { task: 'Certificate Authority Setup', status: 'complete' },
                { task: 'RADIUS Configuration', status: 'in-progress' },
                { task: 'Switch Configuration', status: 'pending' },
                { task: 'Wireless Configuration', status: 'pending' },
                { task: 'Policy Configuration', status: 'pending' },
                { task: 'User Training', status: 'pending' },
                { task: 'Go-Live Testing', status: 'pending' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  {item.status === 'complete' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {item.status === 'in-progress' && <Clock className="h-5 w-5 text-yellow-600" />}
                  {item.status === 'pending' && <AlertTriangle className="h-5 w-5 text-gray-400" />}
                  <span className={`${item.status === 'complete' ? 'line-through text-gray-500' : ''}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Project Contacts</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Alex Rivera', role: 'Project Manager', email: 'alex.rivera@abm.com', phone: '+1 (555) 123-4567' },
                { name: 'John Smith', role: 'Technical Lead', email: 'john.smith@abm.com', phone: '+1 (555) 123-4568' },
                { name: 'Mark Wilson', role: 'Network Engineer', email: 'mark.wilson@abm.com', phone: '+1 (555) 123-4569' },
                { name: 'Sarah Johnson', role: 'Security Analyst', email: 'sarah.johnson@abm.com', phone: '+1 (555) 123-4570' }
              ].map((contact, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                  <p className="text-sm text-blue-600">{contact.email}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
