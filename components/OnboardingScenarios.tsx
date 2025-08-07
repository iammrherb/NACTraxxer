'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Smartphone, Monitor, Wifi, Shield, CheckCircle, Clock, AlertCircle, Users, Settings, Download, QrCode, Mail } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  duration: string
  details: string[]
}

interface OnboardingScenario {
  id: string
  name: string
  type: 'corporate' | 'byod' | 'guest' | 'iot'
  icon: React.ComponentType<any>
  description: string
  steps: OnboardingStep[]
  estimatedTime: string
  requirements: string[]
}

export default function OnboardingScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate')
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate',
      name: 'Corporate Device Onboarding',
      type: 'corporate',
      icon: Monitor,
      description: 'Automated onboarding for corporate-managed devices with certificate deployment via Intune',
      estimatedTime: '5-10 minutes',
      requirements: [
        'Device enrolled in Microsoft Intune',
        'User authenticated with Azure AD',
        'Device compliance policy met',
        'Network connectivity to Portnox Cloud'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Detection',
          description: 'Network infrastructure detects new device connection',
          status: 'completed',
          duration: '< 1 second',
          details: [
            'Switch/AP detects device MAC address',
            'Initial 802.1X authentication request sent',
            'Device placed in pre-authentication VLAN'
          ]
        },
        {
          id: '2',
          title: 'Certificate Request',
          description: 'Device requests certificate from Intune via SCEP',
          status: 'completed',
          duration: '30-60 seconds',
          details: [
            'Device contacts Intune SCEP service',
            'User credentials validated against Azure AD',
            'Device compliance status checked',
            'Certificate generated and deployed'
          ]
        },
        {
          id: '3',
          title: 'EAP-TLS Authentication',
          description: 'Device authenticates using deployed certificate',
          status: 'in_progress',
          duration: '5-10 seconds',
          details: [
            'Device presents certificate to network',
            'Certificate validated against Portnox CA',
            'OCSP check performed for revocation status',
            'User identity extracted from certificate'
          ]
        },
        {
          id: '4',
          title: 'Policy Evaluation',
          description: 'Portnox evaluates access policies for user and device',
          status: 'pending',
          duration: '1-2 seconds',
          details: [
            'User group membership determined',
            'Device compliance status verified',
            'Location and time-based policies applied',
            'VLAN and access permissions calculated'
          ]
        },
        {
          id: '5',
          title: 'Network Access Granted',
          description: 'Device granted appropriate network access',
          status: 'pending',
          duration: '1-2 seconds',
          details: [
            'RADIUS Accept sent to network infrastructure',
            'VLAN assignment and ACLs applied',
            'Device moved to production network',
            'Access logged and monitored'
          ]
        }
      ]
    },
    {
      id: 'byod',
      name: 'BYOD Device Onboarding',
      type: 'byod',
      icon: Smartphone,
      description: 'Self-service onboarding for personal devices with user-initiated certificate enrollment',
      estimatedTime: '10-15 minutes',
      requirements: [
        'Valid corporate user account',
        'Device meets minimum security requirements',
        'User accepts BYOD policy terms',
        'Email access for verification'
      ],
      steps: [
        {
          id: '1',
          title: 'Portal Access',
          description: 'User accesses self-service onboarding portal',
          status: 'completed',
          duration: '1-2 minutes',
          details: [
            'User connects to guest/onboarding WiFi',
            'Captive portal redirects to onboarding site',
            'User authenticates with corporate credentials',
            'Device information collected'
          ]
        },
        {
          id: '2',
          title: 'Policy Acceptance',
          description: 'User reviews and accepts BYOD policies',
          status: 'completed',
          duration: '2-3 minutes',
          details: [
            'BYOD policy document presented',
            'User acknowledges terms and conditions',
            'Device registration information collected',
            'Emergency contact details verified'
          ]
        },
        {
          id: '3',
          title: 'Certificate Installation',
          description: 'User downloads and installs network certificate',
          status: 'in_progress',
          duration: '3-5 minutes',
          details: [
            'Certificate profile generated for device',
            'Installation instructions provided',
            'User downloads certificate bundle',
            'WiFi profile automatically configured'
          ]
        },
        {
          id: '4',
          title: 'Network Connection',
          description: 'Device connects to corporate network',
          status: 'pending',
          duration: '1-2 minutes',
          details: [
            'Device attempts 802.1X authentication',
            'Certificate validated by network',
            'BYOD policies applied',
            'Limited network access granted'
          ]
        },
        {
          id: '5',
          title: 'Compliance Check',
          description: 'Device compliance verified and access finalized',
          status: 'pending',
          duration: '2-3 minutes',
          details: [
            'Device security posture assessed',
            'OS version and patch level checked',
            'Antivirus status verified',
            'Final access permissions applied'
          ]
        }
      ]
    },
    {
      id: 'guest',
      name: 'Guest Access Onboarding',
      type: 'guest',
      icon: Users,
      description: 'Sponsored guest access with approval workflow and time-limited access',
      estimatedTime: '5-20 minutes',
      requirements: [
        'Valid sponsor employee',
        'Guest contact information',
        'Business justification',
        'Sponsor approval'
      ],
      steps: [
        {
          id: '1',
          title: 'Guest Registration',
          description: 'Guest provides contact information and business purpose',
          status: 'completed',
          duration: '2-3 minutes',
          details: [
            'Guest connects to open guest WiFi',
            'Registration form completed',
            'Contact information verified',
            'Business purpose documented'
          ]
        },
        {
          id: '2',
          title: 'Sponsor Selection',
          description: 'Guest selects sponsor from employee directory',
          status: 'completed',
          duration: '1-2 minutes',
          details: [
            'Employee directory searched',
            'Sponsor contact selected',
            'Meeting details provided',
            'Approval request generated'
          ]
        },
        {
          id: '3',
          title: 'Sponsor Approval',
          description: 'Sponsor receives and approves guest access request',
          status: 'in_progress',
          duration: '5-15 minutes',
          details: [
            'Email notification sent to sponsor',
            'Guest details and purpose reviewed',
            'Access duration specified',
            'Approval or denial submitted'
          ]
        },
        {
          id: '4',
          title: 'Access Credentials',
          description: 'Guest receives temporary access credentials',
          status: 'pending',
          duration: '1 minute',
          details: [
            'Temporary username/password generated',
            'Access credentials sent via SMS/email',
            'Guest network SSID provided',
            'Usage guidelines communicated'
          ]
        },
        {
          id: '5',
          title: 'Network Access',
          description: 'Guest connects with time-limited internet access',
          status: 'pending',
          duration: '1 minute',
          details: [
            'Guest authenticates with credentials',
            'Internet-only access granted',
            'Bandwidth limits applied',
            'Session time tracking initiated'
          ]
        }
      ]
    },
    {
      id: 'iot',
      name: 'IoT Device Onboarding',
      type: 'iot',
      icon: Settings,
      description: 'MAC-based authentication for IoT devices with automated profiling and micro-segmentation',
      estimatedTime: '2-5 minutes',
      requirements: [
        'Device MAC address registration',
        'Device type classification',
        'Network segmentation policies',
        'Monitoring and alerting setup'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Discovery',
          description: 'IoT device detected on network',
          status: 'completed',
          duration: '< 1 second',
          details: [
            'Device MAC address detected',
            'Initial network connection attempt',
            'Device placed in quarantine VLAN',
            'Traffic analysis initiated'
          ]
        },
        {
          id: '2',
          title: 'Device Profiling',
          description: 'Automated device classification and profiling',
          status: 'completed',
          duration: '30-60 seconds',
          details: [
            'Device fingerprinting performed',
            'Manufacturer OUI lookup',
            'Traffic pattern analysis',
            'Device type classification'
          ]
        },
        {
          id: '3',
          title: 'MAC Authentication',
          description: 'Device authenticated using MAC address bypass',
          status: 'in_progress',
          duration: '5-10 seconds',
          details: [
            'MAC address validated against whitelist',
            'Device ownership verified',
            'Security posture assessed',
            'Authentication decision made'
          ]
        },
        {
          id: '4',
          title: 'Micro-segmentation',
          description: 'Device placed in appropriate network segment',
          status: 'pending',
          duration: '1-2 seconds',
          details: [
            'IoT VLAN assignment',
            'Firewall rules applied',
            'Communication restrictions enforced',
            'Monitoring policies activated'
          ]
        },
        {
          id: '5',
          title: 'Continuous Monitoring',
          description: 'Device behavior monitoring and anomaly detection',
          status: 'pending',
          duration: 'Ongoing',
          details: [
            'Traffic patterns monitored',
            'Anomaly detection active',
            'Security alerts configured',
            'Compliance reporting enabled'
          ]
        }
      ]
    }
  ]

  const getStatusIcon = (status: OnboardingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: OnboardingStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const simulateOnboarding = async () => {
    setSimulationRunning(true)
    setCurrentStep(0)
    
    const scenario = scenarios.find(s => s.id === selectedScenario)
    if (!scenario) return

    for (let i = 0; i < scenario.steps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay between steps
    }
    
    setSimulationRunning(false)
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)
  const completedSteps = selectedScenarioData?.steps.filter(s => s.status === 'completed').length || 0
  const totalSteps = selectedScenarioData?.steps.length || 0
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-6 w-6 text-blue-600" />
            <span>Device Onboarding Scenarios</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive visualization of different device onboarding workflows and authentication processes.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScenario} onValueChange={setSelectedScenario} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{scenario.name.split(' ')[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {scenarios.map((scenario) => (
              <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
                {/* Scenario Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{scenario.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{scenario.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          {scenario.estimatedTime}
                        </Badge>
                        <Badge variant="outline">
                          {totalSteps} Steps
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-500">{completedSteps}/{totalSteps} completed</span>
                        </div>
                        <Progress value={progressPercentage} className="w-full" />
                      </div>

                      <Button 
                        onClick={simulateOnboarding} 
                        disabled={simulationRunning}
                        className="w-full sm:w-auto"
                      >
                        {simulationRunning ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Simulating...
                          </>
                        ) : (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Simulate Onboarding
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-2">
                        {scenario.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Onboarding Steps */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Onboarding Process</h4>
                  <div className="space-y-4">
                    {scenario.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`border rounded-lg p-4 transition-all ${
                          simulationRunning && currentStep === index
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{step.title}</h5>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            <p className={`text-sm mb-3 ${getStatusColor(step.status)}`}>
                              {step.description}
                            </p>
                            <div className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Guide
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Instructions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Policies
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
