'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Book, MapPin, Users, Calendar, Settings, Download, FileText, Table } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

// Sample comprehensive site data
const siteDatabase = {
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
    notes: 'Executive network needs priority handling. Board room has custom AV equipment.',
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
      mainAPModels: 'Cisco Catalyst 9130AX',
      vlanCount: 25,
      subnetDetails: '10.10.0.0/16 primary, 192.168.10.0/24 guest',
      existingAAA: 'Microsoft AD with RADIUS'
    },
    portnoxConfig: {
      policyGroups: ['Executives', 'Staff', 'Contractors', 'Guests', 'IoT'],
      authMethods: ['802.1X', 'Web Auth', 'MAB'],
      specialPolicies: 'Executive VLAN isolation, IoT segmentation',
      highAvailability: 'Active-Passive with 2 appliances'
    },
    testingPlan: {
      pilotGroup: 'IT Department (50 users)',
      pilotDate: '2025-08-10',
      pilotDuration: '5 days',
      successCriteria: '95% successful authentications, <2s auth time'
    },
    contacts: [
      { name: 'Alex Rivera', role: 'Project Manager', email: 'alex.rivera@abm.com' },
      { name: 'John Smith', role: 'Network Administrator', email: 'john.smith@abm.com' },
      { name: 'Mark Wilson', role: 'Security Engineer', email: 'mark.wilson@abm.com' }
    ]
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
    notes: '24/7 operation requires careful change windows.',
    wiredVendors: ['Cisco'],
    wirelessVendors: ['Aruba'],
    deviceTypes: ['Windows', 'IoT'],
    radsec: 'LRAD',
    plannedStart: '2025-08-05',
    plannedEnd: '2025-08-12',
    networkDetails: {
      totalSwitches: 25,
      totalAPs: 15,
      mainSwitchModels: 'Cisco Nexus 9000, Cisco Catalyst 9500',
      mainAPModels: 'Aruba 635',
      vlanCount: 12,
      subnetDetails: '10.20.0.0/24 management, 172.16.0.0/16 servers',
      existingAAA: 'Cisco ISE with TACACS+'
    },
    portnoxConfig: {
      policyGroups: ['Admins', 'Operators', 'Monitoring', 'Backup'],
      authMethods: ['802.1X', 'MAB'],
      specialPolicies: 'Critical infrastructure isolation, 24/7 monitoring',
      highAvailability: 'Active-Active cluster with load balancing'
    },
    testingPlan: {
      pilotGroup: 'Night shift operators (10 users)',
      pilotDate: '2025-08-08',
      pilotDuration: '2 days',
      successCriteria: '99% uptime, zero service interruption'
    },
    contacts: [
      { name: 'Marcus Chen', role: 'Project Manager', email: 'marcus.chen@abm.com' },
      { name: 'Emily Jones', role: 'Network Engineer', email: 'emily.jones@abm.com' },
      { name: 'Paul Davis', role: 'IT Manager', email: 'paul.davis@abm.com' }
    ]
  },
  'ABM-EUR003': {
    id: 'ABM-EUR003',
    name: 'European HQ',
    region: 'EMEA',
    country: 'Germany',
    priority: 'Medium',
    phase: '2',
    users: 1200,
    projectManager: 'Sofia Linden',
    technicalOwners: ['Sarah Thompson'],
    status: 'Planned',
    completionPercent: 0,
    notes: 'GDPR compliance required. Multi-language support needed.',
    wiredVendors: ['HPE'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Windows', 'Apple', 'Mobile'],
    radsec: 'Native',
    plannedStart: '2025-09-01',
    plannedEnd: '2025-09-15',
    networkDetails: {
      totalSwitches: 35,
      totalAPs: 85,
      mainSwitchModels: 'HPE Aruba 6300M',
      mainAPModels: 'Cisco Catalyst 9120AX',
      vlanCount: 18,
      subnetDetails: '10.30.0.0/16 primary, 192.168.30.0/24 guest',
      existingAAA: 'Active Directory with NPS'
    },
    portnoxConfig: {
      policyGroups: ['Management', 'Staff', 'Visitors', 'BYOD'],
      authMethods: ['802.1X', 'Web Auth'],
      specialPolicies: 'GDPR compliance, multi-language portal',
      highAvailability: 'Single appliance with backup'
    },
    testingPlan: {
      pilotGroup: 'HR Department (25 users)',
      pilotDate: '2025-09-05',
      pilotDuration: '3 days',
      successCriteria: '90% successful authentications, GDPR compliance'
    },
    contacts: [
      { name: 'Sofia Linden', role: 'Project Manager', email: 'sofia.linden@abm.com' },
      { name: 'Sarah Thompson', role: 'Network Administrator', email: 'sarah.thompson@abm.com' }
    ]
  }
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf')
  
  const siteData = siteId ? siteDatabase[siteId as keyof typeof siteDatabase] : null

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
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${siteData.id}-workbook-${timestamp}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
    
    if (format === 'pdf') {
      // Create PDF content
      const content = `
Site Workbook: ${siteData.name}
Generated: ${new Date().toLocaleDateString()}

SITE INFORMATION
================
Site ID: ${siteData.id}
Name: ${siteData.name}
Region: ${siteData.region}
Country: ${siteData.country}
Priority: ${siteData.priority}
Phase: ${siteData.phase}
Users: ${siteData.users.toLocaleString()}

PROJECT TEAM
============
Project Manager: ${siteData.projectManager}
Technical Owners: ${siteData.technicalOwners.join(', ')}
Status: ${siteData.status}
Completion: ${siteData.completionPercent}%

TIMELINE
========
Planned Start: ${siteData.plannedStart}
Planned End: ${siteData.plannedEnd}

NETWORK DETAILS
===============
Total Switches: ${siteData.networkDetails.totalSwitches}
Total Access Points: ${siteData.networkDetails.totalAPs}
Switch Models: ${siteData.networkDetails.mainSwitchModels}
AP Models: ${siteData.networkDetails.mainAPModels}
VLAN Count: ${siteData.networkDetails.vlanCount}
Subnet Details: ${siteData.networkDetails.subnetDetails}
Existing AAA: ${siteData.networkDetails.existingAAA}

PORTNOX CONFIGURATION
====================
Policy Groups: ${siteData.portnoxConfig.policyGroups.join(', ')}
Auth Methods: ${siteData.portnoxConfig.authMethods.join(', ')}
Special Policies: ${siteData.portnoxConfig.specialPolicies}
High Availability: ${siteData.portnoxConfig.highAvailability}

TESTING PLAN
============
Pilot Group: ${siteData.testingPlan.pilotGroup}
Pilot Date: ${siteData.testingPlan.pilotDate}
Duration: ${siteData.testingPlan.pilotDuration}
Success Criteria: ${siteData.testingPlan.successCriteria}

CONTACTS
========
${siteData.contacts.map(contact => `${contact.name} (${contact.role}): ${contact.email}`).join('\n')}

NOTES
=====
${siteData.notes}
      `
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Create Excel/CSV content
      const csvContent = [
        ['Section', 'Field', 'Value'],
        ['Site Information', 'Site ID', siteData.id],
        ['Site Information', 'Name', siteData.name],
        ['Site Information', 'Region', siteData.region],
        ['Site Information', 'Country', siteData.country],
        ['Site Information', 'Priority', siteData.priority],
        ['Site Information', 'Phase', siteData.phase],
        ['Site Information', 'Users', siteData.users.toString()],
        ['Project Team', 'Project Manager', siteData.projectManager],
        ['Project Team', 'Technical Owners', siteData.technicalOwners.join(', ')],
        ['Project Team', 'Status', siteData.status],
        ['Project Team', 'Completion %', siteData.completionPercent.toString()],
        ['Timeline', 'Planned Start', siteData.plannedStart],
        ['Timeline', 'Planned End', siteData.plannedEnd],
        ['Network Details', 'Total Switches', siteData.networkDetails.totalSwitches.toString()],
        ['Network Details', 'Total APs', siteData.networkDetails.totalAPs.toString()],
        ['Network Details', 'Switch Models', siteData.networkDetails.mainSwitchModels],
        ['Network Details', 'AP Models', siteData.networkDetails.mainAPModels],
        ['Network Details', 'VLAN Count', siteData.networkDetails.vlanCount.toString()],
        ['Network Details', 'Subnet Details', siteData.networkDetails.subnetDetails],
        ['Network Details', 'Existing AAA', siteData.networkDetails.existingAAA],
        ['Portnox Config', 'Policy Groups', siteData.portnoxConfig.policyGroups.join(', ')],
        ['Portnox Config', 'Auth Methods', siteData.portnoxConfig.authMethods.join(', ')],
        ['Portnox Config', 'Special Policies', siteData.portnoxConfig.specialPolicies],
        ['Portnox Config', 'High Availability', siteData.portnoxConfig.highAvailability],
        ['Testing Plan', 'Pilot Group', siteData.testingPlan.pilotGroup],
        ['Testing Plan', 'Pilot Date', siteData.testingPlan.pilotDate],
        ['Testing Plan', 'Duration', siteData.testingPlan.pilotDuration],
        ['Testing Plan', 'Success Criteria', siteData.testingPlan.successCriteria],
        ['Notes', 'Notes', siteData.notes]
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename.replace('.xlsx', '.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-blue-600" />
              <span>Site Workbook: {siteData.name}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
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
                <Table className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
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
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Network Infrastructure Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Total Switches:</span>
                  <span>{siteData.networkDetails.totalSwitches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Total Access Points:</span>
                  <span>{siteData.networkDetails.totalAPs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">VLAN Count:</span>
                  <span>{siteData.networkDetails.vlanCount}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Switch Models:</span>
                  <p className="text-sm mt-1">{siteData.networkDetails.mainSwitchModels}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">AP Models:</span>
                  <p className="text-sm mt-1">{siteData.networkDetails.mainAPModels}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Existing AAA:</span>
                  <p className="text-sm mt-1">{siteData.networkDetails.existingAAA}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">Subnet Details:</span>
              <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {siteData.networkDetails.subnetDetails}
              </p>
            </div>
          </div>

          {/* Portnox Configuration Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Portnox Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Policy Groups:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.portnoxConfig.policyGroups.map((group, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Auth Methods:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.portnoxConfig.authMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Special Policies:</span>
                  <p className="text-sm mt-1">{siteData.portnoxConfig.specialPolicies}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">High Availability:</span>
                  <p className="text-sm mt-1">{siteData.portnoxConfig.highAvailability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Plan Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Testing & Pilot Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Pilot Group:</span>
                  <span>{siteData.testingPlan.pilotGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Pilot Date:</span>
                  <span>{siteData.testingPlan.pilotDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>{siteData.testingPlan.pilotDuration}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Success Criteria:</span>
                <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {siteData.testingPlan.successCriteria}
                </p>
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Project Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteData.contacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{contact.role}</div>
                  <div className="text-sm text-blue-600">{contact.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Project Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                {siteData.notes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
