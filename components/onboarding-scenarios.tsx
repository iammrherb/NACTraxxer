'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock, Smartphone, Laptop, Users, Wifi } from 'lucide-react'

interface OnboardingScenariosProps {
  onClose: () => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'failed'
  duration: number
  details?: string
}

interface OnboardingScenario {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  steps: OnboardingStep[]
  requirements: string[]
  estimatedTime: string
}

export default function OnboardingScenarios({ onClose }: OnboardingScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate',
      name: 'Corporate Device Onboarding',
      description: 'Automated enrollment for company-managed devices via Intune',
      icon: <Laptop className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-800',
      estimatedTime: '5-10 minutes',
      requirements: [
        'Device enrolled in Intune',
        'Azure AD account',
        'Corporate network access',
        'SCEP certificate profile configured'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Detection',
          description: 'System detects corporate device attempting network access',
          status: 'pending',
          duration: 30,
          details: 'Device MAC address checked against corporate device registry'
        },
        {
          id: '2',
          title: 'Intune Verification',
          description: 'Verify device enrollment status in Microsoft Intune',
          status: 'pending',
          duration: 45,
          details: 'Query Intune Graph API for device compliance and enrollment status'
        },
        {
          id: '3',
          title: 'Certificate Request',
          description: 'Initiate SCEP certificate enrollment process',
          status: 'pending',
          duration: 60,
          details: 'Generate SCEP challenge and send certificate signing request'
        },
        {
          id: '4',
          title: 'Certificate Installation',
          description: 'Deploy certificate to device certificate store',
          status: 'pending',
          duration: 30,
          details: 'Install user and device certificates via Intune policy'
        },
        {
          id: '5',
          title: 'WiFi Profile Deployment',
          description: 'Push WiFi configuration with EAP-TLS settings',
          status: 'pending',
          duration: 45,
          details: 'Deploy WiFi profile with certificate-based authentication'
        },
        {
          id: '6',
          title: 'Network Authentication',
          description: 'Perform 802.1X authentication with new certificate',
          status: 'pending',
          duration: 15,
          details: 'EAP-TLS handshake with network access server'
        },
        {
          id: '7',
          title: 'Policy Application',
          description: 'Apply corporate network policies and VLAN assignment',
          status: 'pending',
          duration: 10,
          details: 'Assign to corporate VLAN with full network access'
        }
      ]
    },
    {
      id: 'byod',
      name: 'BYOD Device Onboarding',
      description: 'Self-service enrollment for personal devices',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-green-100 text-green-800',
      estimatedTime: '10-15 minutes',
      requirements: [
        'Valid corporate email address',
        'Device supports 802.1X',
        'Self-service portal access',
        'User acceptance of BYOD policy'
      ],
      steps: [
        {
          id: '1',
          title: 'Portal Access',
          description: 'User accesses self-service onboarding portal',
          status: 'pending',
          duration: 60,
          details: 'Navigate to corporate BYOD enrollment portal'
        },
        {
          id: '2',
          title: 'User Authentication',
          description: 'Authenticate with corporate credentials',
          status: 'pending',
          duration: 30,
          details: 'Azure AD authentication with MFA if required'
        },
        {
          id: '3',
          title: 'Policy Acceptance',
          description: 'Review and accept BYOD usage policies',
          status: 'pending',
          duration: 120,
          details: 'User must acknowledge data usage and security policies'
        },
        {
          id: '4',
          title: 'Device Registration',
          description: 'Register device details and generate certificate',
          status: 'pending',
          duration: 45,
          details: 'Collect device information and create certificate signing request'
        },
        {
          id: '5',
          title: 'Certificate Download',
          description: 'Download and install user certificate',
          status: 'pending',
          duration: 30,
          details: 'User downloads P12 certificate file with installation instructions'
        },
        {
          id: '6',
          title: 'Network Configuration',
          description: 'Configure WiFi settings for corporate network',
          status: 'pending',
          duration: 90,
          details: 'Manual WiFi configuration with EAP-TLS settings'
        },
        {
          id: '7',
          title: 'Connection Test',
          description: 'Test network connectivity and access',
          status: 'pending',
          duration: 30,
          details: 'Verify successful authentication and limited network access'
        }
      ]
    },
    {
      id: 'guest',
      name: 'Guest Access Onboarding',
      description: 'Temporary access for visitors with sponsor approval',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-800',
      estimatedTime: '5-20 minutes',
      requirements: [
        'Sponsor employee approval',
        'Valid email address or phone',
        'Guest access policy configured',
        'Time-limited access window'
      ],
      steps: [
        {
          id: '1',
          title: 'Guest Portal Access',
          description: 'Guest accesses captive portal for registration',
          status: 'pending',
          duration: 30,
          details: 'Redirect to guest registration portal on network connection'
        },
        {
          id: '2',
          title: 'Information Collection',
          description: 'Collect guest information and contact details',
          status: 'pending',
          duration: 120,
          details: 'Name, email, phone, company, and purpose of visit'
        },
        {
          id: '3',
          title: 'Sponsor Selection',
          description: 'Select corporate sponsor from directory',
          status: 'pending',
          duration: 60,
          details: 'Search and select employee sponsor from corporate directory'
        },
        {
          id: '4',
          title: 'Approval Request',
          description: 'Send approval request to sponsor',
          status: 'pending',
          duration: 300,
          details: 'Email/SMS notification sent to sponsor for approval'
        },
        {
          id: '5',
          title: 'Sponsor Approval',
          description: 'Waiting for sponsor to approve access request',
          status: 'pending',
          duration: 600,
          details: 'Sponsor reviews request and approves/denies access'
        },
        {
          id: '6',
          title: 'Credentials Generation',
          description: 'Generate temporary access credentials',
          status: 'pending',
          duration: 15,
          details: 'Create time-limited guest account with network access'
        },
        {
          id: '7',
          title: 'Network Access',
          description: 'Grant limited network access with restrictions',
          status: 'pending',
          duration: 10,
          details: 'Internet-only access with bandwidth and time limitations'
        }
      ]
    },
    {
      id: 'iot',
      name: 'IoT Device Onboarding',
      description: 'Registration for Internet of Things devices',
      icon: <Wifi className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-800',
      estimatedTime: '2-5 minutes',
      requirements: [
        'Device MAC address registration',
        'IoT device category classification',
        'Network segmentation policy',
        'Device profiling enabled'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Discovery',
          description: 'Detect new IoT device on network',
          status: 'pending',
          duration: 15,
          details: 'Network scanning detects unknown MAC address'
        },
        {
          id: '2',
          title: 'Device Profiling',
          description: 'Analyze device characteristics and behavior',
          status: 'pending',
          duration: 60,
          details: 'DHCP fingerprinting and traffic pattern analysis'
        },
        {
          id: '3',
          title: 'Category Classification',
          description: 'Classify device type and manufacturer',
          status: 'pending',
          duration: 30,
          details: 'Match against device database and OUI lookup'
        },
        {
          id: '4',
          title: 'Security Assessment',
          description: 'Evaluate device security posture',
          status: 'pending',
          duration: 45,
          details: 'Vulnerability scanning and security policy check'
        },
        {
          id: '5',
          title: 'Policy Assignment',
          description: 'Apply appropriate IoT access policies',
          status: 'pending',
          duration: 20,
          details: 'Assign to IoT VLAN with micro-segmentation rules'
        },
        {
          id: '6',
          title: 'Network Placement',
          description: 'Place device in appropriate network segment',
          status: 'pending',
          duration: 15,
          details: 'VLAN assignment and firewall rule application'
        },
        {
          id: '7',
          title: 'Monitoring Setup',
          description: 'Enable continuous monitoring and alerting',
          status: 'pending',
          duration: 10,
          details: 'Configure device monitoring and anomaly detection'
        }
      ]
    }
  ]

  const currentScenario = scenarios.find(s => s.id === selectedScenario)!

  const startSimulation = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setProgress(0)
    
    // Reset all steps to pending
    const updatedSteps = currentScenario.steps.map(step => ({
      ...step,
      status: 'pending' as const
    }))
    
    simulateSteps(updatedSteps, 0)
  }

  const simulateSteps = (steps: OnboardingStep[], stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setIsRunning(false)
      setProgress(100)
      return
    }

    // Mark current step as active
    steps[stepIndex].status = 'active'
    setCurrentStep(stepIndex)

    // Simulate step execution
    setTimeout(() => {
      // Mark step as completed (or failed randomly for demo)
      const success = Math.random() > 0.1 // 90% success rate
      steps[stepIndex].status = success ? 'completed' : 'failed'
      
      if (success) {
        const newProgress = ((stepIndex + 1) / steps.length) * 100
        setProgress(newProgress)
        
        // Continue to next step
        setTimeout(() => {
          simulateSteps(steps, stepIndex + 1)
        }, 500)
      } else {
        // Stop simulation on failure
        setIsRunning(false)
      }
    }, steps[stepIndex].duration * 10) // Speed up for demo
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setProgress(0)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-6 w-6 text-blue-600" />
          <span>Device Onboarding Scenarios</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedScenario} onValueChange={setSelectedScenario} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {scenarios.map((scenario) => (
              <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center space-x-2">
                {scenario.icon}
                <span className="hidden sm:inline">{scenario.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
              {/* Scenario Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {scenario.icon}
                    <span>{scenario.name}</span>
                    <Badge className={scenario.color}>{scenario.estimatedTime}</Badge>
                  </CardTitle>
                  <p className="text-muted-foreground">{scenario.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {scenario.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Simulation Controls</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={startSimulation}
                          disabled={isRunning}
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Simulation
                        </Button>
                        <Button
                          onClick={resetSimulation}
                          variant="outline"
                          size="sm"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Steps Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scenario.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border transition-all ${
                          step.status === 'active' ? 'bg-blue-50 border-blue-200' :
                          step.status === 'completed' ? 'bg-green-50 border-green-200' :
                          step.status === 'failed' ? 'bg-red-50 border-red-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStepIcon(step.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              Step {index + 1}: {step.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              ~{step.duration}s
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                          {step.details && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              {step.details}
                            </p>
                          )}
                          {step.status === 'active' && (
                            <div className="mt-2">
                              <Progress value={50} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Results Summary */}
              {progress > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {scenario.steps.filter(s => s.status === 'completed').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Steps Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {scenario.steps.filter(s => s.status === 'failed').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Steps Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(progress)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Progress</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
