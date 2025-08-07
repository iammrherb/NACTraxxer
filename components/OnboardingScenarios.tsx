'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle, Clock, Play, Pause, RotateCcw, Smartphone, Laptop, Tablet, Wifi, Shield, Users, Settings, Zap } from 'lucide-react'

interface OnboardingScenario {
  id: string
  name: string
  type: 'corporate' | 'byod' | 'guest' | 'iot'
  status: 'idle' | 'running' | 'completed' | 'failed'
  progress: number
  steps: OnboardingStep[]
  deviceType: string
  estimatedTime: number
  description: string
}

interface OnboardingStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration: number
  description: string
  details?: string
}

export default function OnboardingScenarios() {
  const [scenarios, setScenarios] = useState<OnboardingScenario[]>([
    {
      id: '1',
      name: 'Corporate Windows Laptop',
      type: 'corporate',
      status: 'completed',
      progress: 100,
      deviceType: 'Windows Laptop',
      estimatedTime: 5,
      description: 'Automated enrollment for corporate-managed Windows devices',
      steps: [
        { id: '1', name: 'Device Detection', status: 'completed', duration: 30, description: 'Detect device connection to network' },
        { id: '2', name: 'Certificate Request', status: 'completed', duration: 60, description: 'Request device certificate via SCEP' },
        { id: '3', name: 'Intune Enrollment', status: 'completed', duration: 120, description: 'Enroll device in Microsoft Intune' },
        { id: '4', name: 'Policy Application', status: 'completed', duration: 90, description: 'Apply corporate security policies' },
        { id: '5', name: 'Network Access', status: 'completed', duration: 30, description: 'Grant network access with appropriate VLAN' }
      ]
    },
    {
      id: '2',
      name: 'BYOD iPhone',
      type: 'byod',
      status: 'running',
      progress: 60,
      deviceType: 'iPhone',
      estimatedTime: 8,
      description: 'Self-service enrollment for personal iOS devices',
      steps: [
        { id: '6', name: 'User Registration', status: 'completed', duration: 60, description: 'User creates account in onboarding portal' },
        { id: '7', name: 'Device Verification', status: 'completed', duration: 45, description: 'Verify device ownership via SMS/email' },
        { id: '8', name: 'Certificate Installation', status: 'running', duration: 90, description: 'Install user certificate on device' },
        { id: '9', name: 'WiFi Profile Setup', status: 'pending', duration: 60, description: 'Configure enterprise WiFi profile' },
        { id: '10', name: 'Compliance Check', status: 'pending', duration: 30, description: 'Verify device meets minimum requirements' }
      ]
    },
    {
      id: '3',
      name: 'Guest Access',
      type: 'guest',
      status: 'idle',
      progress: 0,
      deviceType: 'Various',
      estimatedTime: 3,
      description: 'Sponsored guest access with time limitations',
      steps: [
        { id: '11', name: 'Guest Registration', status: 'pending', duration: 60, description: 'Guest provides contact information' },
        { id: '12', name: 'Sponsor Approval', status: 'pending', duration: 300, description: 'Wait for sponsor approval via email' },
        { id: '13', name: 'Access Credentials', status: 'pending', duration: 30, description: 'Generate temporary access credentials' },
        { id: '14', name: 'Network Access', status: 'pending', duration: 15, description: 'Grant limited network access' }
      ]
    },
    {
      id: '4',
      name: 'IoT Sensor',
      type: 'iot',
      status: 'failed',
      progress: 25,
      deviceType: 'IoT Sensor',
      estimatedTime: 2,
      description: 'Automated IoT device registration and profiling',
      steps: [
        { id: '15', name: 'MAC Detection', status: 'completed', duration: 15, description: 'Detect device MAC address' },
        { id: '16', name: 'Device Profiling', status: 'failed', duration: 60, description: 'Identify device type and capabilities', details: 'Unknown device fingerprint' },
        { id: '17', name: 'Policy Assignment', status: 'pending', duration: 30, description: 'Assign appropriate IoT policies' },
        { id: '18', name: 'Network Segmentation', status: 'pending', duration: 15, description: 'Place device in IoT VLAN' }
      ]
    }
  ])

  const [selectedScenario, setSelectedScenario] = useState<OnboardingScenario | null>(scenarios[0])
  const [simulationSpeed, setSimulationSpeed] = useState('1')

  const scenarioTypes = [
    { id: 'corporate', label: 'Corporate Device', icon: <Laptop className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
    { id: 'byod', label: 'BYOD', icon: <Smartphone className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'guest', label: 'Guest Access', icon: <Users className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'iot', label: 'IoT Device', icon: <Wifi className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const startScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'running', progress: 0 }
        : s
    ))
    
    // Simulate scenario execution
    simulateScenario(scenarioId)
  }

  const pauseScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'idle' }
        : s
    ))
  }

  const resetScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { 
            ...s, 
            status: 'idle', 
            progress: 0,
            steps: s.steps.map(step => ({ ...step, status: 'pending' }))
          }
        : s
    ))
  }

  const simulateScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) return

    let currentStep = 0
    const speed = parseFloat(simulationSpeed)
    
    const executeStep = () => {
      if (currentStep >= scenario.steps.length) {
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? { ...s, status: 'completed', progress: 100 }
            : s
        ))
        return
      }

      const step = scenario.steps[currentStep]
      
      // Start step
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? {
              ...s,
              steps: s.steps.map((st, idx) => 
                idx === currentStep 
                  ? { ...st, status: 'running' }
                  : st
              )
            }
          : s
      ))

      // Complete step after duration
      setTimeout(() => {
        const shouldFail = scenario.type === 'iot' && currentStep === 1 // Simulate IoT failure
        
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? {
                ...s,
                progress: Math.round(((currentStep + 1) / scenario.steps.length) * 100),
                status: shouldFail ? 'failed' : s.status,
                steps: s.steps.map((st, idx) => 
                  idx === currentStep 
                    ? { ...st, status: shouldFail ? 'failed' : 'completed' }
                    : st
                )
              }
            : s
        ))

        if (!shouldFail) {
          currentStep++
          executeStep()
        }
      }, (step.duration * 1000) / speed)
    }

    executeStep()
  }

  const getScenarioTypeInfo = (type: string) => {
    return scenarioTypes.find(st => st.id === type) || scenarioTypes[0]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-[#00c8d7]" />
              <span>Device Onboarding Scenarios</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="speed-select" className="text-sm">Simulation Speed:</Label>
              <Select value={simulationSpeed} onValueChange={setSimulationSpeed}>
                <SelectTrigger id="speed-select" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenarios" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scenarios">Scenario List</TabsTrigger>
              <TabsTrigger value="details">Scenario Details</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="grid gap-4">
                {scenarios.map((scenario) => {
                  const typeInfo = getScenarioTypeInfo(scenario.type)
                  return (
                    <Card 
                      key={scenario.id} 
                      className={`cursor-pointer transition-all ${selectedScenario?.id === scenario.id ? 'ring-2 ring-[#00c8d7]' : ''}`}
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                              {typeInfo.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{scenario.name}</h3>
                                <Badge variant="outline" className={getStatusColor(scenario.status)}>
                                  {getStatusIcon(scenario.status)}
                                  <span className="ml-1">{scenario.status}</span>
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {scenario.deviceType}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {scenario.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>~{scenario.estimatedTime} minutes</span>
                                <span>{scenario.steps.length} steps</span>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{scenario.progress}%</span>
                                </div>
                                <Progress value={scenario.progress} className="h-2" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {scenario.status === 'idle' || scenario.status === 'failed' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startScenario(scenario.id)
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            ) : scenario.status === 'running' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  pauseScenario(scenario.id)
                                }}
                                className="text-yellow-600 hover:text-yellow-700"
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            ) : null}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                resetScenario(scenario.id)
                              }}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {selectedScenario ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getScenarioTypeInfo(selectedScenario.type).color}`}>
                          {getScenarioTypeInfo(selectedScenario.type).icon}
                        </div>
                        <div>
                          <CardTitle>{selectedScenario.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {selectedScenario.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(selectedScenario.status)}>
                        {getStatusIcon(selectedScenario.status)}
                        <span className="ml-1">{selectedScenario.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[#00c8d7]">{selectedScenario.progress}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[#00c8d7]">{selectedScenario.estimatedTime}m</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Est. Time</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[#00c8d7]">{selectedScenario.steps.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Steps</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Onboarding Steps</h3>
                      {selectedScenario.steps.map((step, index) => (
                        <Card key={step.id} className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                step.status === 'completed' ? 'bg-green-100 text-green-800' :
                                step.status === 'running' ? 'bg-blue-100 text-blue-800' :
                                step.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{step.name}</h4>
                                  {getStatusIcon(step.status)}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {step.duration}s
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {step.description}
                              </p>
                              {step.details && step.status === 'failed' && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                  <p className="text-sm text-red-800 dark:text-red-200">
                                    <strong>Error:</strong> {step.details}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Select a scenario to view details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
