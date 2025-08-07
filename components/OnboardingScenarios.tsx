'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  name: string
  description: string
  duration: number
  status: 'pending' | 'active' | 'complete' | 'error'
  requirements?: string[]
}

interface OnboardingScenario {
  id: string
  name: string
  description: string
  deviceType: string
  userType: string
  steps: OnboardingStep[]
  totalDuration: number
}

export default function OnboardingScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate',
      name: 'Corporate Device',
      description: 'Intune-managed corporate device onboarding',
      deviceType: 'Windows Laptop',
      userType: 'Employee',
      totalDuration: 45,
      steps: [
        {
          id: '1',
          name: 'Device Detection',
          description: 'Network access attempt detected',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          name: 'Certificate Validation',
          description: 'Validate device certificate from Intune',
          duration: 10,
          status: 'pending',
          requirements: ['Valid device certificate', 'Intune enrollment']
        },
        {
          id: '3',
          name: 'Compliance Check',
          description: 'Verify device compliance status',
          duration: 15,
          status: 'pending',
          requirements: ['Antivirus updated', 'OS patches current', 'Encryption enabled']
        },
        {
          id: '4',
          name: 'User Authentication',
          description: 'Authenticate user via Active Directory',
          duration: 10,
          status: 'pending',
          requirements: ['Valid AD credentials', 'MFA completion']
        },
        {
          id: '5',
          name: 'Network Access Granted',
          description: 'Grant access to corporate network',
          duration: 5,
          status: 'pending'
        }
      ]
    },
    {
      id: 'byod',
      name: 'BYOD Device',
      description: 'Bring Your Own Device self-service onboarding',
      deviceType: 'Personal iPhone',
      userType: 'Employee',
      totalDuration: 120,
      steps: [
        {
          id: '1',
          name: 'Device Detection',
          description: 'Unknown device detected on network',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          name: 'Captive Portal Redirect',
          description: 'Redirect to self-service portal',
          duration: 10,
          status: 'pending'
        },
        {
          id: '3',
          name: 'User Authentication',
          description: 'Employee authenticates with corporate credentials',
          duration: 30,
          status: 'pending',
          requirements: ['Corporate username/password', 'MFA verification']
        },
        {
          id: '4',
          name: 'Device Registration',
          description: 'Register device and install certificates',
          duration: 60,
          status: 'pending',
          requirements: ['Device enrollment', 'Certificate installation']
        },
        {
          id: '5',
          name: 'Policy Application',
          description: 'Apply BYOD security policies',
          duration: 10,
          status: 'pending'
        },
        {
          id: '6',
          name: 'Network Access Granted',
          description: 'Grant limited network access',
          duration: 5,
          status: 'pending'
        }
      ]
    },
    {
      id: 'guest',
      name: 'Guest Access',
      description: 'Sponsored guest access workflow',
      deviceType: 'Personal Laptop',
      userType: 'Visitor',
      totalDuration: 90,
      steps: [
        {
          id: '1',
          name: 'Device Detection',
          description: 'Unknown device detected',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          name: 'Guest Portal Redirect',
          description: 'Redirect to guest registration portal',
          duration: 10,
          status: 'pending'
        },
        {
          id: '3',
          name: 'Sponsor Request',
          description: 'Request sponsorship from employee',
          duration: 45,
          status: 'pending',
          requirements: ['Sponsor email', 'Business justification']
        },
        {
          id: '4',
          name: 'Sponsor Approval',
          description: 'Employee approves guest access',
          duration: 20,
          status: 'pending',
          requirements: ['Sponsor approval', 'Access duration set']
        },
        {
          id: '5',
          name: 'Terms Acceptance',
          description: 'Guest accepts terms and conditions',
          duration: 5,
          status: 'pending'
        },
        {
          id: '6',
          name: 'Guest Network Access',
          description: 'Grant limited guest network access',
          duration: 5,
          status: 'pending'
        }
      ]
    },
    {
      id: 'iot',
      name: 'IoT Device',
      description: 'IoT device MAC-based authentication',
      deviceType: 'IP Camera',
      userType: 'System',
      totalDuration: 30,
      steps: [
        {
          id: '1',
          name: 'Device Detection',
          description: 'New MAC address detected',
          duration: 5,
          status: 'pending'
        },
        {
          id: '2',
          name: 'MAC Authentication',
          description: 'Authenticate using MAC address',
          duration: 10,
          status: 'pending',
          requirements: ['MAC address in whitelist', 'Device fingerprinting']
        },
        {
          id: '3',
          name: 'Device Profiling',
          description: 'Profile device type and capabilities',
          duration: 10,
          status: 'pending',
          requirements: ['DHCP fingerprinting', 'HTTP user agent analysis']
        },
        {
          id: '4',
          name: 'IoT Network Access',
          description: 'Grant access to IoT VLAN',
          duration: 5,
          status: 'pending'
        }
      ]
    }
  ]

  const currentScenario = scenarios.find(s => s.id === selectedScenario)!

  const startSimulation = () => {
    setIsRunning(true)
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
      if (stepIndex < currentScenario.steps.length) {
        const step = currentScenario.steps[stepIndex]
        step.status = 'active'
        setCurrentStep(stepIndex)
        
        setTimeout(() => {
          step.status = 'complete'
          totalProgress += (step.duration / currentScenario.totalDuration) * 100
          setProgress(totalProgress)
          stepIndex++
          
          if (stepIndex < currentScenario.steps.length) {
            processStep()
          } else {
            setIsRunning(false)
          }
        }, step.duration * 50) // Speed up for demo
      }
    }
    
    processStep()
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setProgress(0)
    currentScenario.steps.forEach(step => {
      step.status = 'pending'
    })
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'active': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {scenarios.map((scenario) => (
          <Button
            key={scenario.id}
            variant={selectedScenario === scenario.id ? "default" : "outline"}
            className="h-auto p-3 text-left"
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <div>
              <div className="font-medium text-sm">{scenario.name}</div>
              <div className="text-xs opacity-70">{scenario.deviceType}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Scenario Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{currentScenario.name} Onboarding</span>
                <Badge variant="outline">{currentScenario.userType}</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{currentScenario.description}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startSimulation}
                disabled={isRunning}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulation}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0s</span>
              <span>{currentScenario.totalDuration}s</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {currentScenario.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  step.status === 'active' ? 'bg-blue-50 border-blue-200' :
                  step.status === 'complete' ? 'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {step.duration}s
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.requirements && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {step.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
