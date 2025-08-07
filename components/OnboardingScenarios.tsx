'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle, Smartphone, Laptop, Wifi, Shield } from 'lucide-react'

export default function OnboardingScenarios() {
  const [activeScenario, setActiveScenario] = useState('corporate')
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const scenarios = [
    {
      id: 'corporate',
      name: 'Corporate Device',
      icon: Laptop,
      description: 'Managed corporate device with pre-installed certificates',
      color: 'bg-blue-100 text-blue-800',
      steps: [
        { name: 'Device Boot', description: 'Corporate laptop starts up', duration: 2000 },
        { name: 'Network Detection', description: 'Detects corporate SSID', duration: 1500 },
        { name: 'Certificate Auth', description: 'Uses pre-installed certificate', duration: 2000 },
        { name: 'Policy Check', description: 'Portnox validates device compliance', duration: 2500 },
        { name: 'VLAN Assignment', description: 'Assigned to corporate VLAN 100', duration: 1500 },
        { name: 'Network Access', description: 'Full network access granted', duration: 1000 }
      ],
      requirements: ['Valid device certificate', 'Domain membership', 'Compliance status: Compliant'],
      outcome: 'Full network access with corporate privileges'
    },
    {
      id: 'byod',
      name: 'BYOD Device',
      icon: Smartphone,
      description: 'Personal device requiring certificate enrollment',
      color: 'bg-green-100 text-green-800',
      steps: [
        { name: 'Device Connection', description: 'Personal device connects to network', duration: 2000 },
        { name: 'Captive Portal', description: 'Redirected to onboarding portal', duration: 2500 },
        { name: 'User Authentication', description: 'User logs in with AD credentials', duration: 3000 },
        { name: 'Certificate Enrollment', description: 'SCEP certificate provisioning', duration: 4000 },
        { name: 'Profile Installation', description: 'Network profile installed', duration: 2000 },
        { name: 'Network Reconnection', description: 'Reconnects with certificate', duration: 2500 },
        { name: 'VLAN Assignment', description: 'Assigned to BYOD VLAN 200', duration: 1500 }
      ],
      requirements: ['Valid AD credentials', 'Device enrollment capability', 'User consent'],
      outcome: 'Limited network access with BYOD restrictions'
    },
    {
      id: 'guest',
      name: 'Guest Access',
      icon: Wifi,
      description: 'Visitor device with sponsor approval',
      color: 'bg-orange-100 text-orange-800',
      steps: [
        { name: 'Guest Connection', description: 'Visitor connects to guest SSID', duration: 1500 },
        { name: 'Captive Portal', description: 'Redirected to guest portal', duration: 2000 },
        { name: 'Sponsor Request', description: 'Requests sponsor approval', duration: 3000 },
        { name: 'Sponsor Notification', description: 'Sponsor receives approval request', duration: 2000 },
        { name: 'Approval Process', description: 'Sponsor approves access', duration: 4000 },
        { name: 'Temporary Access', description: 'Time-limited access granted', duration: 2000 },
        { name: 'Internet Only', description: 'Restricted to internet access', duration: 1000 }
      ],
      requirements: ['Sponsor approval', 'Valid email address', 'Acceptable use agreement'],
      outcome: 'Internet-only access with time restrictions'
    },
    {
      id: 'iot',
      name: 'IoT Device',
      icon: Shield,
      description: 'IoT device with MAC-based authentication',
      color: 'bg-purple-100 text-purple-800',
      steps: [
        { name: 'Device Discovery', description: 'IoT device attempts connection', duration: 2000 },
        { name: 'MAC Authentication', description: 'MAC address lookup in database', duration: 2500 },
        { name: 'Device Profiling', description: 'Automatic device classification', duration: 3000 },
        { name: 'Policy Application', description: 'IoT-specific policies applied', duration: 2000 },
        { name: 'Micro-segmentation', description: 'Isolated network segment', duration: 2500 },
        { name: 'Limited Access', description: 'Restricted to required services only', duration: 1500 }
      ],
      requirements: ['Pre-registered MAC address', 'Device classification', 'IoT policy definition'],
      outcome: 'Micro-segmented access with service restrictions'
    }
  ]

  const currentScenario = scenarios.find(s => s.id === activeScenario) || scenarios[0]

  const startSimulation = () => {
    setSimulationState('running')
    setCurrentStep(0)
    setProgress(0)
    runSimulation()
  }

  const pauseSimulation = () => {
    setSimulationState('paused')
  }

  const resetSimulation = () => {
    setSimulationState('idle')
    setCurrentStep(0)
    setProgress(0)
  }

  const runSimulation = async () => {
    const steps = currentScenario.steps
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)
    let elapsed = 0

    for (let i = 0; i < steps.length; i++) {
      if (simulationState === 'paused') break
      
      setCurrentStep(i)
      
      // Simulate step duration
      const stepDuration = steps[i].duration
      const stepStart = Date.now()
      
      while (Date.now() - stepStart < stepDuration) {
        if (simulationState === 'paused') return
        
        const stepProgress = (Date.now() - stepStart) / stepDuration
        const overallProgress = ((elapsed + (stepProgress * stepDuration)) / totalDuration) * 100
        setProgress(overallProgress)
        
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      elapsed += stepDuration
    }
    
    setSimulationState('completed')
    setProgress(100)
  }

  const getStepIcon = (index: number) => {
    if (index < currentStep) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else if (index === currentStep && simulationState === 'running') {
      return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
    } else {
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep && simulationState === 'running') return 'active'
    return 'pending'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Device Onboarding Scenarios</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Interactive simulations of different device onboarding workflows
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold">Select Scenario</h3>
          <div className="space-y-2">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activeScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setActiveScenario(scenario.id)
                    resetSimulation()
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${scenario.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Simulation Control */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <currentScenario.icon className="h-5 w-5" />
                  <span>{currentScenario.name} Simulation</span>
                </CardTitle>
                <div className="flex space-x-2">
                  {simulationState === 'idle' || simulationState === 'completed' ? (
                    <Button onClick={startSimulation} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  ) : simulationState === 'running' ? (
                    <Button onClick={pauseSimulation} variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={startSimulation} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={resetSimulation} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {currentScenario.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      getStepStatus(index) === 'completed' ? 'bg-green-50' :
                      getStepStatus(index) === 'active' ? 'bg-blue-50' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(index)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-gray-600">{step.description}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(step.duration / 1000).toFixed(1)}s
                    </div>
                  </div>
                ))}
              </div>

              {/* Status */}
              {simulationState === 'completed' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Onboarding Complete!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {currentScenario.outcome}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentScenario.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
