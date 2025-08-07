'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'

interface OnboardingScenariosProps {
  onClose: () => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  duration: number
  status: 'pending' | 'active' | 'complete'
}

interface OnboardingScenario {
  id: string
  name: string
  description: string
  deviceType: string
  steps: OnboardingStep[]
  totalDuration: number
}

export default function OnboardingScenarios({ onClose }: OnboardingScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate',
      name: 'Corporate Device Onboarding',
      description: 'Automated enrollment for company-managed devices via Intune',
      deviceType: 'Windows/macOS Corporate Device',
      totalDuration: 120,
      steps: [
        {
          id: '1',
          title: 'Device Detection',
          description: 'Device connects to network and is detected by NAC',
          duration: 10,
          status: 'pending'
        },
        {
          id: '2',
          title: 'Identity Verification',
          description: 'User authenticates with Azure AD credentials',
          duration: 15,
          status: 'pending'
        },
        {
          id: '3',
          title: 'Device Registration',
          description: 'Device is registered in Intune and assigned policies',
          duration: 30,
          status: 'pending'
        },
        {
          id: '4',
          title: 'Certificate Enrollment',
          description: 'Device receives certificate via SCEP from Portnox PKI',
          duration: 25,
          status: 'pending'
        },
        {
          id: '5',
          title: 'Policy Application',
          description: 'NAC policies are applied and VLAN assignment made',
          duration: 20,
          status: 'pending'
        },
        {
          id: '6',
          title: 'Network Access Granted',
          description: 'Device gains full network access with monitoring',
          duration: 20,
          status: 'pending'
        }
      ]
    },
    {
      id: 'byod',
      name: 'BYOD Device Onboarding',
      description: 'Self-service enrollment for personal devices',
      deviceType: 'Personal Mobile/Laptop Device',
      totalDuration: 180,
      steps: [
        {
          id: '1',
          title: 'Captive Portal Redirect',
          description: 'Device is redirected to self-service portal',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          title: 'User Authentication',
          description: 'User logs in with corporate credentials',
          duration: 20,
          status: 'pending'
        },
        {
          id: '3',
          title: 'Device Information Collection',
          description: 'System collects device type and OS information',
          duration: 10,
          status: 'pending'
        },
        {
          id: '4',
          title: 'Policy Acceptance',
          description: 'User accepts BYOD policy and terms of use',
          duration: 30,
          status: 'pending'
        },
        {
          id: '5',
          title: 'Certificate Installation',
          description: 'User downloads and installs device certificate',
          duration: 60,
          status: 'pending'
        },
        {
          id: '6',
          title: 'Network Profile Configuration',
          description: 'WiFi profile is configured for 802.1X authentication',
          duration: 30,
          status: 'pending'
        },
        {
          id: '7',
          title: 'Access Validation',
          description: 'Device reconnects and validates certificate-based access',
          duration: 25,
          status: 'pending'
        }
      ]
    },
    {
      id: 'guest',
      name: 'Guest Access Onboarding',
      description: 'Sponsored guest access with time limitations',
      deviceType: 'Guest Device (Any)',
      totalDuration: 90,
      steps: [
        {
          id: '1',
          title: 'Guest Portal Access',
          description: 'Guest accesses captive portal for registration',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          title: 'Sponsor Request',
          description: 'Guest requests access and provides sponsor information',
          duration: 15,
          status: 'pending'
        },
        {
          id: '3',
          title: 'Sponsor Notification',
          description: 'Sponsor receives email/SMS notification for approval',
          duration: 30,
          status: 'pending'
        },
        {
          id: '4',
          title: 'Access Approval',
          description: 'Sponsor approves access request',
          duration: 20,
          status: 'pending'
        },
        {
          id: '5',
          title: 'Temporary Credentials',
          description: 'Guest receives temporary network credentials',
          duration: 10,
          status: 'pending'
        },
        {
          id: '6',
          title: 'Limited Network Access',
          description: 'Guest gains time-limited access to guest network',
          duration: 10,
          status: 'pending'
        }
      ]
    },
    {
      id: 'iot',
      name: 'IoT Device Onboarding',
      description: 'MAC Authentication Bypass for IoT devices',
      deviceType: 'IoT Device (Headless)',
      totalDuration: 60,
      steps: [
        {
          id: '1',
          title: 'MAC Address Detection',
          description: 'Device MAC address is detected on network',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          title: 'Device Profiling',
          description: 'System profiles device based on network behavior',
          duration: 20,
          status: 'pending'
        },
        {
          id: '3',
          title: 'Administrator Approval',
          description: 'Network admin approves IoT device for access',
          duration: 15,
          status: 'pending'
        },
        {
          id: '4',
          title: 'MAC Whitelist Addition',
          description: 'Device MAC is added to authorized device list',
          duration: 10,
          status: 'pending'
        },
        {
          id: '5',
          title: 'IoT VLAN Assignment',
          description: 'Device is assigned to IoT-specific network segment',
          duration: 10,
          status: 'pending'
        }
      ]
    }
  ]

  const currentScenario = scenarios.find(s => s.id === selectedScenario)!

  const startSimulation = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setProgress(0)
    
    // Reset all steps
    currentScenario.steps.forEach(step => {
      step.status = 'pending'
    })

    simulateSteps()
  }

  const simulateSteps = () => {
    let stepIndex = 0
    let totalProgress = 0

    const processStep = () => {
      if (stepIndex >= currentScenario.steps.length) {
        setIsPlaying(false)
        return
      }

      const step = currentScenario.steps[stepIndex]
      step.status = 'active'
      setCurrentStep(stepIndex)

      const stepDuration = step.duration * 100 // Convert to milliseconds for demo
      const progressIncrement = (step.duration / currentScenario.totalDuration) * 100

      setTimeout(() => {
        step.status = 'complete'
        totalProgress += progressIncrement
        setProgress(totalProgress)
        stepIndex++
        processStep()
      }, stepDuration)
    }

    processStep()
  }

  const resetSimulation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setProgress(0)
    currentScenario.steps.forEach(step => {
      step.status = 'pending'
    })
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Device Onboarding Scenarios</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Onboarding Scenarios</h3>
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-colors ${
                    selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{scenario.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {scenario.deviceType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ~{scenario.totalDuration}s
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Simulation Controls and Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{currentScenario.name}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={startSimulation}
                  disabled={isPlaying}
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
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h4 className="font-medium">Onboarding Steps</h4>
              <div className="space-y-3">
                {currentScenario.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      step.status === 'active' ? 'bg-blue-50 border-blue-200' :
                      step.status === 'complete' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'complete' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : step.status === 'active' ? (
                        <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{step.title}</h5>
                        <Badge
                          variant={
                            step.status === 'complete' ? 'default' :
                            step.status === 'active' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Step {index + 1} of {currentScenario.steps.length}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ~{step.duration}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scenario Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Device Type: </span>
                    <span className="text-sm text-muted-foreground">
                      {currentScenario.deviceType}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Description: </span>
                    <span className="text-sm text-muted-foreground">
                      {currentScenario.description}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Total Duration: </span>
                    <span className="text-sm text-muted-foreground">
                      Approximately {currentScenario.totalDuration} seconds
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Steps: </span>
                    <span className="text-sm text-muted-foreground">
                      {currentScenario.steps.length} automated steps
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
