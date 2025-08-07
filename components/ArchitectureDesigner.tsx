'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Building2, Users, Network, Shield, Settings, FileText, Download, Save, Upload, Eye, EyeOff, Palette, Moon, Sun } from 'lucide-react'
import EnhancedArchitectureDiagrams from './enhanced-architecture-diagrams'
import SiteManagement from './site-management'
import ProgressTracking from './progress-tracking'
import SiteWorkbook from './site-workbook'
import UserManagementModal from './user-management-modal'
import ThemeCustomizer from './theme-customizer'

interface ProjectData {
  company: string
  industry: string
  projectManager: string
  technicalLead: string
  sites: number
  users: number
  devices: number
  timeline: string
  budget: string
  compliance: string[]
  networkVendor: string
  identityProvider: string
  mdmSolution: string
}

export default function ArchitectureDesigner() {
  const [activeTab, setActiveTab] = useState('overview')
  const [projectData, setProjectData] = useState<ProjectData>({
    company: 'Acme Healthcare Corp',
    industry: 'Healthcare',
    projectManager: 'Sarah Johnson',
    technicalLead: 'Mike Chen',
    sites: 12,
    users: 2500,
    devices: 3200,
    timeline: '6 months',
    budget: '$250,000',
    compliance: ['HIPAA', 'SOX'],
    networkVendor: 'Cisco Meraki',
    identityProvider: 'Azure AD',
    mdmSolution: 'Microsoft Intune'
  })
  
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  const handleProjectDataChange = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportProject = () => {
    const dataStr = JSON.stringify(projectData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${projectData.company.replace(/\s+/g, '_')}_NAC_Design.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const saveProject = () => {
    localStorage.setItem('nac-project', JSON.stringify(projectData))
    alert('Project saved successfully!')
  }

  const loadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setProjectData(data)
          alert('Project loaded successfully!')
        } catch (error) {
          alert('Error loading project file')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zero Trust NAC Architecture Designer</h1>
            <p className="text-muted-foreground">Design and deploy enterprise network access control solutions</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowThemeCustomizer(true)}>
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={exportProject}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={saveProject}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('file-input')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={loadProject}
              className="hidden"
            />
          </div>
        </div>

        {/* Project Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Project Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={projectData.company}
                  onChange={(e) => handleProjectDataChange('company', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={projectData.industry} onValueChange={(value) => handleProjectDataChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Financial">Financial Services</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sites">Number of Sites</Label>
                <Input
                  id="sites"
                  type="number"
                  value={projectData.sites}
                  onChange={(e) => handleProjectDataChange('sites', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="users">Total Users</Label>
                <Input
                  id="users"
                  type="number"
                  value={projectData.users}
                  onChange={(e) => handleProjectDataChange('users', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-4">
                <Badge variant="secondary">{projectData.timeline}</Badge>
                <Badge variant="secondary">{projectData.budget}</Badge>
                <Badge variant="secondary">{projectData.compliance.join(', ')}</Badge>
              </div>
              
              <Button onClick={() => setShowUserModal(true)}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Sites</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="workbook" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Workbook</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedArchitectureDiagrams />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sites Configured:</span>
                      <Badge>8/12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Users Enrolled:</span>
                      <Badge>2,247/2,500</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Devices Authenticated:</span>
                      <Badge>3,156/3,200</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Status:</span>
                      <Badge variant="secondary">98.7%</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Network Vendor:</span>
                      <Badge variant="outline">{projectData.networkVendor}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Identity Provider:</span>
                      <Badge variant="outline">{projectData.identityProvider}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>MDM Solution:</span>
                      <Badge variant="outline">{projectData.mdmSolution}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>NAC Platform:</span>
                      <Badge variant="outline">Portnox Cloud</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture">
            <EnhancedArchitectureDiagrams />
          </TabsContent>

          <TabsContent value="sites">
            <SiteManagement onSiteSelect={setSelectedSite} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracking />
          </TabsContent>

          <TabsContent value="workbook">
            <SiteWorkbook selectedSite={selectedSite} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pm">Project Manager</Label>
                    <Input
                      id="pm"
                      value={projectData.projectManager}
                      onChange={(e) => handleProjectDataChange('projectManager', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tl">Technical Lead</Label>
                    <Input
                      id="tl"
                      value={projectData.technicalLead}
                      onChange={(e) => handleProjectDataChange('technicalLead', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select value={projectData.timeline} onValueChange={(value) => handleProjectDataChange('timeline', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 months">3 months</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="9 months">9 months</SelectItem>
                        <SelectItem value="12 months">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      value={projectData.budget}
                      onChange={(e) => handleProjectDataChange('budget', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="network-vendor">Network Vendor</Label>
                    <Select value={projectData.networkVendor} onValueChange={(value) => handleProjectDataChange('networkVendor', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cisco Meraki">Cisco Meraki</SelectItem>
                        <SelectItem value="Cisco Catalyst">Cisco Catalyst</SelectItem>
                        <SelectItem value="Aruba">Aruba</SelectItem>
                        <SelectItem value="Juniper">Juniper</SelectItem>
                        <SelectItem value="Extreme">Extreme Networks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="identity">Identity Provider</Label>
                    <Select value={projectData.identityProvider} onValueChange={(value) => handleProjectDataChange('identityProvider', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Azure AD">Azure AD</SelectItem>
                        <SelectItem value="Active Directory">Active Directory</SelectItem>
                        <SelectItem value="Okta">Okta</SelectItem>
                        <SelectItem value="Google Workspace">Google Workspace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mdm">MDM Solution</Label>
                    <Select value={projectData.mdmSolution} onValueChange={(value) => handleProjectDataChange('mdmSolution', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Microsoft Intune">Microsoft Intune</SelectItem>
                        <SelectItem value="Jamf">Jamf</SelectItem>
                        <SelectItem value="VMware Workspace ONE">VMware Workspace ONE</SelectItem>
                        <SelectItem value="MobileIron">MobileIron</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <UserManagementModal 
          isOpen={showUserModal} 
          onClose={() => setShowUserModal(false)} 
        />
        
        <ThemeCustomizer 
          isOpen={showThemeCustomizer} 
          onClose={() => setShowThemeCustomizer(false)} 
        />
      </div>
    </div>
  )
}
