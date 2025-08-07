'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Smartphone, Laptop, Tablet, Cpu, CheckCircle, Clock, AlertTriangle, ArrowRight, Download, Play } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  duration: string
  status: 'completed' | 'current' | 'pending'
  details: string[]
}

interface OnboardingScenario {
  id: string
  name: string
  description: string
  deviceType: string
  icon: any
  estimatedTime: string
  complexity: 'Easy' | 'Medium' | 'Advanced'
  steps: OnboardingStep[]
}

interface OnboardingScenariosProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OnboardingScenarios({ open, onOpenChange }: OnboardingScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate-laptop')
  const [currentStep, setCurrentStep] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate-laptop',
      name: 'Corporate Laptop',
      description: 'Domain-joined Windows/Mac laptop with certificate-based authentication',
      deviceType: 'Managed Device',
      icon: Laptop,
      estimatedTime: '15-20 minutes',
      complexity: 'Easy',
      steps: [
        {
          id: '1',
          title: 'Certificate Installation',
          description: 'Install corporate certificate via Group Policy or MDM',
          duration: '5 minutes',
          status: 'completed',
          details: [
            'Certificate automatically deployed via Active Directory',
            'Device certificate installed in computer certificate store',
            'User certificate installed in user certificate store',
            'Certificate chain validation completed'
          ]
        },
        {
          id: '2',
          title: 'Network Profile Configuration',
          description: 'Configure wireless network profile with EAP-TLS',
          duration: '3 minutes',
          status: 'completed',
          details: [
            'Wireless profile deployed via Group Policy',
            'EAP-TLS authentication method configured',
            'Certificate selection rules applied',
            'Network profile activated automatically'
          ]
        },
        {
          id: '3',
          title: 'Initial Authentication',
          description: 'First-time connection to corporate network',
          duration: '2 minutes',
          status: 'current',
          details: [
            'Device attempts connection to CorpWiFi-Secure',
            'EAP-TLS handshake initiated',
            'Certificate presented to RADIUS server',
            'Portnox Cloud validates device certificate'
          ]
        },
        {
          id: '4',
          title: 'Policy Application',
          description: 'Network access policies applied based on device compliance',
          duration: '1 minute',
          status: 'pending',
          details: [
            'Device compliance status checked',
            'Corporate device policy applied',
            'VLAN 10 assignment completed',
            'Full network access granted'
          ]
        },
        {
          id: '5',
          title: 'Verification & Testing',
          description: 'Verify network connectivity and access to corporate resources',
          duration: '5 minutes',
          status: 'pending',
          details: [
            'Test internet connectivity',
            'Verify access to internal resources',
            'Confirm policy enforcement',
            'Document successful onboarding'
          ]
        }
      ]
    },
    {
      id: 'byod-mobile',
      name: 'BYOD Mobile Device',
      description: 'Personal smartphone/tablet with username/password authentication',
      deviceType: 'Personal Device',
      icon: Smartphone,
      estimatedTime: '10-15 minutes',
      complexity: 'Medium',
      steps: [
        {
          id: '1',
          title: 'User Registration',
          description: 'Register personal device in self-service portal',
          duration: '3 minutes',
          status: 'completed',
          details: [
            'User accesses self-service portal',
            'Device information collected',
            'Terms of service accepted',
            'Device registered in Portnox Cloud'
          ]
        },
        {
          id: '2',
          title: 'Certificate Enrollment',
          description: 'Download and install device certificate via SCEP',
          duration: '4 minutes',
          status: 'current',
          details: [
            'SCEP enrollment URL provided',
            'Device certificate request generated',
            'Certificate issued by corporate CA',
            'Certificate installed on device'
          ]
        },
        {
          id: '3',
          title: 'Network Configuration',
          description: 'Configure device to connect to BYOD network',
          duration: '3 minutes',
          status: 'pending',
          details: [
            'Add CorpWiFi-BYOD network profile',
            'Configure PEAP-MSCHAPv2 authentication',
            'Enter corporate credentials',
            'Save network configuration'
          ]
        },
        {
          id: '4',
          title: 'Policy Enforcement',
          description: 'Apply BYOD policies and restrictions',
          duration: '2 minutes',
          status: 'pending',
          details: [
            'Device compliance assessment',
            'BYOD policy application',
            'VLAN 20 assignment',
            'Bandwidth limitations applied'
          ]
        },
        {
          id: '5',
          title: 'Access Validation',
          description: 'Test connectivity and verify policy compliance',
          duration: '3 minutes',
          status: 'pending',
          details: [
            'Test internet access',
            'Verify corporate resource access',
            'Confirm bandwidth limitations',
            'Complete onboarding process'
          ]
        }
      ]
    },
    {
      id: 'guest-device',
      name: 'Guest Device',
      description: 'Visitor device with web-based authentication',
      deviceType: 'Guest Device',
      icon: Tablet,
      estimatedTime: '5-10 minutes',
      complexity: 'Easy',
      steps: [
        {
          id: '1',
          title: 'Network Discovery',
          description: 'Connect to guest wireless network',
          duration: '1 minute',
          status: 'completed',
          details: [
            'Scan for available networks',
            'Select CorpWiFi-Guest network',
            'Connect without credentials',
            'Redirect to captive portal'
          ]
        },
        {
          id: '2',
          title: 'Guest Registration',
          description: 'Complete guest registration form',
          duration: '3 minutes',
          status: 'current',
          details: [
            'Fill out guest information form',
            'Provide sponsor details',
            'Accept terms and conditions',
            'Submit registration request'
          ]
        },
        {
          id: '3',
          title: 'Sponsor Approval',
          description: 'Wait for sponsor approval (if required)',
          duration: '2 minutes',
          status: 'pending',
          details: [
            'Notification sent to sponsor',
            'Sponsor reviews request',
            'Approval granted',
            'Guest account activated'
          ]
        },
        {
          id: '4',
          title: 'Internet Access',
          description: 'Gain internet-only access with restrictions',
          duration: '1 minute',
          status: 'pending',
          details: [
            'Guest policy applied',
            'VLAN 30 assignment',
            'Internet-only access granted',
            'Bandwidth limits enforced'
          ]
        },
        {
          id: '5',
          title: 'Session Management',
          description: 'Monitor session and handle expiration',
          duration: '3 minutes',
          status: 'pending',
          details: [
            'Session timer activated',
            'Periodic re-authentication',
            'Monitor usage patterns',
            'Handle session expiration'
          ]
        }
      ]
    },
    {
      id: 'iot-device',
      name: 'IoT Device',
      description: 'Internet of Things device with MAC-based authentication',
      deviceType: 'IoT Device',
      icon: Cpu,
      estimatedTime: '20-30 minutes',
      complexity: 'Advanced',
      steps: [
        {
          id: '1',
          title: 'Device Discovery',
          description: 'Identify and catalog IoT device on network',
          duration: '5 minutes',
          status: 'completed',
          details: [
            'Device connects to network',
            'MAC address captured',
            'Device fingerprinting performed',
            'Device type identified'
          ]
        },
        {
          id: '2',
          title: 'MAC Authentication',
          description: 'Authenticate device using MAC address',
          duration: '3 minutes',
          status: 'completed',
          details: [
            'MAC Authentication Bypass (MAB) initiated',
            'MAC address lookup in database',
            'Device authorization verified',
            'Authentication successful'
          ]
        },
        {
          id: '3',
          title: 'Device Profiling',
          description: 'Profile device behavior and characteristics',
          duration: '10 minutes',
          status: 'current',
          details: [
            'Network traffic analysis',
            'Protocol identification',
            'Behavioral pattern learning',
            'Device profile creation'
          ]
        },
        {
          id: '4',
          title: 'Policy Assignment',
          description: 'Apply IoT-specific security policies',
          duration: '5 minutes',
          status: 'pending',
          details: [
            'IoT device policy selection',
            'VLAN 40 assignment',
            'Micro-segmentation rules applied',
            'Traffic filtering enabled'
          ]
        },
        {
          id: '5',
          title: 'Monitoring Setup',
          description: 'Configure continuous monitoring and alerting',
          duration: '7 minutes',
          status: 'pending',
          details: [
            'Baseline behavior established',
            'Anomaly detection configured',
            'Alert thresholds set',
            'Monitoring dashboard updated'
          ]
        }
      ]
    }
  ]

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0]
  const completedSteps = currentScenario.steps.filter(step => step.status === 'completed').length
  const progressPercentage = (completedSteps / currentScenario.steps.length) * 100

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'current': return <Clock className="h-5 w-5 text-blue-600" />
      case 'pending': return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
      default: return null
    }
  }

  const handleExportGuide = () => {
    console.log('Exporting onboarding guide...')
  }

  const handleStartDemo = () => {
    console.log('Starting interactive demo...')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Device Onboarding Scenarios</span>
          </DialogTitle>
          <DialogDescription>
            Step-by-step guides for onboarding different types of devices to your Zero Trust NAC
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedScenario} onValueChange={setSelectedScenario} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {scenarios.map((scenario) => {
              const IconComponent = scenario.icon
              return (
                <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{scenario.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <scenario.icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">{scenario.name}</CardTitle>
                        <CardDescription className="text-base">{scenario.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getComplexityColor(scenario.complexity)}>
                        {scenario.complexity}
                      </Badge>
                      <Badge variant="outline">{scenario.estimatedTime}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Progress:</span>
                      <div className="flex-1 max-w-xs">
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {completedSteps}/{scenario.steps.length} steps
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleExportGuide}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Guide
                      </Button>
                      <Button onClick={handleStartDemo}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {scenario.steps.map((step, index) => (
                  <Card key={step.id} className={`${step.status === 'current' ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStepIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{step.duration}</Badge>
                              {index < scenario.steps.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{step.description}</p>
                          <div className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Certificate Issues</h4>
                        <p className="text-sm text-gray-600">
                          If certificate authentication fails, verify certificate validity, chain of trust, and ensure the device clock is synchronized.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Network Connectivity</h4>
                        <p className="text-sm text-gray-600">
                          Check RADIUS server connectivity, verify shared secrets, and ensure proper VLAN configuration on network switches.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Policy Application</h4>
                        <p className="text-sm text-gray-600">
                          If policies aren't applying correctly, verify device compliance status, check policy priority order, and review condition matching.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
