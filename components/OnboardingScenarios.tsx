'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Smartphone, Laptop, Tablet, Monitor, Wifi, Shield, Key, CheckCircle, AlertCircle, Clock, Play, Pause, RotateCcw, Download, Settings, Users, Globe } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  duration: number
  details: string[]
}

interface OnboardingScenario {
  id: string
  name: string
  deviceType: string
  platform: string
  icon: React.ReactNode
  description: string
  steps: OnboardingStep[]
  estimatedTime: number
  complexity: 'simple' | 'moderate' | 'complex'
}

export default function OnboardingScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'windows-corporate',
      name: 'Windows Corporate Device',
      deviceType: 'Windows PC',
      platform: 'Windows 10/11',
      icon: <Monitor className="w-6 h-6" />,
      description: 'Domain-joined Windows device with certificate-based authentication',
      estimatedTime: 5,
      complexity: 'simple',
      steps: [
        {
          id: '1',
          title: 'Device Discovery',
          description: 'Network adapter detects 802.1X enabled network',
          status: 'pending',
          duration: 30,
          details: [
            'Network interface scans for available networks',
            'Detects enterprise SSID with 802.1X security',
            'Initiates connection attempt'
          ]
        },
        {
          id: '2',
          title: 'Certificate Validation',
          description: 'System validates device certificate from domain CA',
          status: 'pending',
          duration: 45,
          details: [
            'Retrieves machine certificate from local store',
            'Validates certificate chain to domain CA',
            'Checks certificate revocation status'
          ]
        },
        {
          id: '3',
          title: 'RADIUS Authentication',
          description: 'EAP-TLS authentication with Portnox RADIUS',
          status: 'pending',
          duration: 60,
          details: [
            'Initiates EAP-TLS handshake',
            'Presents machine certificate to RADIUS server',
            'RADIUS server validates certificate and device identity'
          ]
        },
        {
          id: '4',
          title: 'Policy Evaluation',
          description: 'Portnox evaluates device compliance and policies',
          status: 'pending',
          duration: 30,
          details: [
            'Queries Active Directory for device information',
            'Checks device compliance status',
            'Evaluates applicable network access policies'
          ]
        },
        {
          id: '5',
          title: 'Network Access Granted',
          description: 'Device receives network access with appropriate VLAN',
          status: 'pending',
          duration: 15,
          details: [
            'RADIUS server sends Access-Accept',
            'Switch assigns device to corporate VLAN',
            'Device receives IP address via DHCP'
          ]
        }
      ]
    },
    {
      id: 'ios-byod',
      name: 'iOS BYOD Device',
      deviceType: 'iPhone/iPad',
      platform: 'iOS 15+',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Personal iOS device onboarding with certificate provisioning',
      estimatedTime: 8,
      complexity: 'moderate',
      steps: [
        {
          id: '1',
          title: 'Captive Portal Detection',
          description: 'Device connects to guest network and detects captive portal',
          status: 'pending',
          duration: 20,
          details: [
            'Device connects to open guest SSID',
            'iOS detects captive portal requirement',
            'Captive portal page loads automatically'
          ]
        },
        {
          id: '2',
          title: 'User Authentication',
          description: 'User authenticates with corporate credentials',
          status: 'pending',
          duration: 60,
          details: [
            'User enters corporate username and password',
            'Portal validates credentials against Azure AD',
            'Multi-factor authentication if required'
          ]
        },
        {
          id: '3',
          title: 'Device Registration',
          description: 'Device information is collected and registered',
          status: 'pending',
          duration: 45,
          details: [
            'System collects device MAC address and type',
            'User provides device description/name',
            'Device is registered in Portnox database'
          ]
        },
        {
          id: '4',
          title: 'Certificate Provisioning',
          description: 'Device certificate is generated and installed',
          status: 'pending',
          duration: 90,
          details: [
            'Certificate signing request generated',
            'CA issues device-specific certificate',
            'Certificate installed via iOS configuration profile'
          ]
        },
        {
          id: '5',
          title: 'Network Reconnection',
          description: 'Device reconnects to secure network with certificate',
          status: 'pending',
          duration: 60,
          details: [
            'Device disconnects from guest network',
            'Connects to secure enterprise SSID',
            'Uses installed certificate for EAP-TLS authentication'
          ]
        },
        {
          id: '6',
          title: 'Policy Application',
          description: 'BYOD policies are applied to device access',
          status: 'pending',
          duration: 30,
          details: [
            'Portnox identifies device as BYOD',
            'Applies appropriate BYOD access policies',
            'Device assigned to BYOD VLAN with limited access'
          ]
        }
      ]
    },
    {
      id: 'android-guest',
      name: 'Android Guest Device',
      deviceType: 'Android Phone',
      platform: 'Android 10+',
      icon: <Tablet className="w-6 h-6" />,
      description: 'Guest device with temporary network access',
      estimatedTime: 3,
      complexity: 'simple',
      steps: [
        {
          id: '1',
          title: 'Guest Network Connection',
          description: 'Device connects to open guest network',
          status: 'pending',
          duration: 15,
          details: [
            'Device scans and finds guest SSID',
            'Connects to open guest network',
            'Receives limited IP address'
          ]
        },
        {
          id: '2',
          title: 'Captive Portal Registration',
          description: 'User completes guest registration form',
          status: 'pending',
          duration: 120,
          details: [
            'Browser redirected to guest portal',
            'User fills out registration form',
            'Accepts terms and conditions'
          ]
        },
        {
          id: '3',
          title: 'Temporary Access Granted',
          description: 'Device receives time-limited internet access',
          status: 'pending',
          duration: 30,
          details: [
            'Portal validates registration information',
            'Device MAC address whitelisted temporarily',
            'Internet access granted for specified duration'
          ]
        }
      ]
    },
    {
      id: 'macos-managed',
      name: 'macOS Managed Device',
      deviceType: 'MacBook',
      platform: 'macOS 12+',
      icon: <Laptop className="w-6 h-6" />,
      description: 'Intune-managed macOS device with automated onboarding',
      estimatedTime: 6,
      complexity: 'moderate',
      steps: [
        {
          id: '1',
          title: 'MDM Profile Installation',
          description: 'Intune management profile is installed',
          status: 'pending',
          duration: 90,
          details: [
            'User enrolls device in Intune',
            'Management profile downloaded and installed',
            'Device compliance policies applied'
          ]
        },
        {
          id: '2',
          title: 'Certificate Deployment',
          description: 'Network authentication certificate deployed via MDM',
          status: 'pending',
          duration: 60,
          details: [
            'Intune pushes network certificate profile',
            'Certificate installed in system keychain',
            'Network profile configured for 802.1X'
          ]
        },
        {
          id: '3',
          title: 'Automatic Network Connection',
          description: 'Device automatically connects to enterprise network',
          status: 'pending',
          duration: 45,
          details: [
            'macOS detects configured enterprise network',
            'Automatically initiates 802.1X authentication',
            'Uses deployed certificate for EAP-TLS'
          ]
        },
        {
          id: '4',
          title: 'Compliance Verification',
          description: 'Portnox verifies device compliance status',
          status: 'pending',
          duration: 30,
          details: [
            'Queries Intune for device compliance status',
            'Verifies required security policies are applied',
            'Confirms device meets corporate standards'
          ]
        },
        {
          id: '5',
          title: 'Full Access Granted',
          description: 'Compliant device receives full network access',
          status: 'pending',
          duration: 15,
          details: [
            'Device compliance confirmed',
            'Full corporate network access granted',
            'Device assigned to appropriate VLAN'
          ]
        }
      ]
    }
  ]

  const startSimulation = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) return

    setSelectedScenario(scenarioId)
    setIsSimulating(true)
    setCurrentStep(0)
    setSimulationProgress(0)

    // Reset all steps to pending
    scenario.steps.forEach(step => {
      step.status = 'pending'
    })

    simulateSteps(scenario.steps, 0)
  }

  const simulateSteps = (steps: OnboardingStep[], stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setIsSimulating(false)
      return
    }

    const currentStepObj = steps[stepIndex]
    currentStepObj.status = 'in-progress'
    setCurrentStep(stepIndex)

    const stepDuration = currentStepObj.duration * 50 // Speed up for demo
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 2
      setSimulationProgress((stepIndex / steps.length) * 100 + (progress / steps.length))
      
      if (progress >= 100) {
        clearInterval(progressInterval)
        currentStepObj.status = 'completed'
        setTimeout(() => simulateSteps(steps, stepIndex + 1), 500)
      }
    }, stepDuration / 50)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setCurrentStep(0)
    setSimulationProgress(0)
    if (selectedScenario) {
      const scenario = scenarios.find(s => s.id === selectedScenario)
      if (scenario) {
        scenario.steps.forEach(step => {
          step.status = 'pending'
        })
      }
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'complex': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-6 w-6 text-blue-600" />
            <span>Device Onboarding Scenarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Interactive simulations of device onboarding workflows for different device types and scenarios.
            Select a scenario below to see the step-by-step onboarding process.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">Onboarding Scenarios</TabsTrigger>
          <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {scenario.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <p className="text-sm text-gray-600">{scenario.deviceType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={`${getComplexityColor(scenario.complexity)} text-white`}>
                        {scenario.complexity}
                      </Badge>
                      <span className="text-xs text-gray-500">{scenario.estimatedTime} min</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{scenario.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm">Onboarding Steps:</h4>
                    <div className="space-y-1">
                      {scenario.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2 text-sm">
                          <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{step.title}</span>
                        </div>
                      ))}
                      {scenario.steps.length > 3 && (
                        <div className="text-xs text-gray-500 ml-6">
                          +{scenario.steps.length - 3} more steps
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startSimulation(scenario.id)}
                    className="w-full"
                    disabled={isSimulating}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Simulation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          {selectedScenarioData ? (
            <div className="space-y-6">
              {/* Simulation Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {selectedScenarioData.icon}
                      </div>
                      <div>
                        <CardTitle>{selectedScenarioData.name}</CardTitle>
                        <p className="text-gray-600">{selectedScenarioData.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSimulation}
                        disabled={isSimulating}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSimulating(!isSimulating)}
                      >
                        {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round(simulationProgress)}%</span>
                      </div>
                      <Progress value={simulationProgress} className="w-full" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{currentStep + 1}</div>
                        <div className="text-sm text-gray-600">Current Step</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {selectedScenarioData.steps.filter(s => s.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">
                          {selectedScenarioData.steps.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Steps</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simulation Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedScenarioData.steps.map((step, index) => (
                      <div 
                        key={step.id} 
                        className={`border rounded-lg p-4 transition-all ${
                          step.status === 'in-progress' ? 'border-blue-500 bg-blue-50' :
                          step.status === 'completed' ? 'border-green-500 bg-green-50' :
                          step.status === 'failed' ? 'border-red-500 bg-red-50' :
                          'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{step.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                Step {index + 1}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            
                            {(step.status === 'in-progress' || step.status === 'completed') && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Process Details:</h4>
                                <ul className="space-y-1">
                                  {step.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-600">{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {step.status === 'in-progress' && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Step Progress</span>
                                  <span>{Math.round(((simulationProgress % (100 / selectedScenarioData.steps.length)) / (100 / selectedScenarioData.steps.length)) * 100)}%</span>
                                </div>
                                <Progress 
                                  value={((simulationProgress % (100 / selectedScenarioData.steps.length)) / (100 / selectedScenarioData.steps.length)) * 100} 
                                  className="w-full h-2" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Simulation Selected</h3>
                <p className="text-gray-500 mb-4">Choose a scenario from the Onboarding Scenarios tab to start a simulation</p>
                <Button onClick={() => document.querySelector('[value="scenarios"]')?.click()}>
                  View Scenarios
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
