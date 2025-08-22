'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, Play, Pause, RotateCcw } from 'lucide-react'

interface OnboardingScenariosProps {
  onClose: () => void
}

export default function OnboardingScenarios({ onClose }: OnboardingScenariosProps) {
  const [activeScenario, setActiveScenario] = useState('windows-corp')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const scenarios = [
    {
      id: 'windows-corp',
      name: 'Windows Corporate Device',
      description: 'Domain-joined Windows device with certificate',
      steps: [
        'Device connects to network',
        'Switch initiates 802.1X authentication',
        'Device presents certificate',
        'RADSec proxy forwards to Portnox Cloud',
        'Certificate validated against CA',
        'Device profiled and policy applied',
        'Access granted to corporate VLAN'
      ]
    },
    {
      id: 'byod-enrollment',
      name: 'BYOD Device Enrollment',
      description: 'Personal device enrolling via captive portal',
      steps: [
        'Device connects to guest network',
        'Captive portal redirects to enrollment',
        'User authenticates with credentials',
        'Device certificate provisioned via SCEP',
        'Device reconnects with certificate',
        'Policy evaluation and VLAN assignment',
        'Access granted to BYOD network'
      ]
    },
    {
      id: 'iot-device',
      name: 'IoT Device Onboarding',
      description: 'Headless IoT device with MAC-based authentication',
      steps: [
        'IoT device connects to network',
        'MAC address authentication initiated',
        'Device profiled by behavior analysis',
        'IoT policy template applied',
        'Micro-segmentation rules enforced',
        'Limited network access granted',
        'Continuous monitoring enabled'
      ]
    }
  ]

  const currentScenario = scenarios.find(s => s.id === activeScenario)

  const playScenario = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= (currentScenario?.steps.length || 0) - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  const resetScenario = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  return (
    <Card className="fixed inset-4 z-50 bg-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Device Onboarding Scenarios</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors ${
                  activeScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveScenario(scenario.id)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{scenario.name}</h4>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scenario Playback */}
        {currentScenario && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{currentScenario.name}</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playScenario}
                  disabled={isPlaying}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetScenario}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Progress 
                value={(currentStep + 1) / currentScenario.steps.length * 100} 
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Step {currentStep + 1} of {currentScenario.steps.length}</span>
                <span>{Math.round((currentStep + 1) / currentScenario.steps.length * 100)}% Complete</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {currentScenario.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    index <= currentStep
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  } border`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`flex-1 ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                  {index < currentStep && (
                    <Badge variant="default" className="bg-green-500">
                      Complete
                    </Badge>
                  )}
                  {index === currentStep && isPlaying && (
                    <Badge variant="default" className="bg-blue-500">
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
