'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Play, Pause, RotateCcw, Monitor, Smartphone, Printer, Wifi, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react'

interface OnboardingScenariosProps {
  onClose: () => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  duration: number
  details: string[]
}

interface DeviceScenario {
  id: string
  name: string
  deviceType: 'windows' | 'mac' | 'mobile' | 'iot'
  icon: React.ReactNode
  description: string
  steps: OnboardingStep[]
  estimatedTime: number
  complexity: 'simple' | 'moderate' | 'complex'
}

export default function OnboardingScenarios({ onClose }: OnboardingScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('windows-corporate')
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const scenarios: DeviceScenario[] = [
    {
      id: 'windows-corporate',
      name: 'Windows Corporate Device',
      deviceType: 'windows',
      icon: <Monitor className="h-6 w-6" />,
      description: 'Domain-joined Windows device with certificate-based authentication',
      estimatedTime: 45,
      complexity: 'simple',
      steps: [
        {
          id: 'network-detection',
          title: 'Network Detection',
          description: 'Device detects available corporate network',
          status: 'pending',
          duration: 5,
          details: [
            'Scanning for available SSIDs',
            'Corporate SSID "CorpNet" detected',
            'Security type: WPA2-Enterprise identified'
          ]
        },
        {
          id: 'certificate-validation',
          title: 'Certificate Validation',
          description: 'Validating device and user certificates',
          status: 'pending',
          duration: 10,
          details: [
            'Machine certificate retrieved from local store',
            'User certificate retrieved from local store',
            'Certificate chain validation in progress',
            'Certificate revocation check completed'
          ]
        },
        {
          id: 'eap-tls-handshake',
          title: 'EAP-TLS Handshake',
          description: 'Performing secure authentication handshake',
          status: 'pending',
          duration: 15,
          details: [
            'EAP-TLS negotiation initiated',
            'TLS tunnel established',
            'Client certificate presented',
            'Server certificate validated',
            'Mutual authentication completed'
          ]
        },
        {
          id: 'policy-evaluation',
          title: 'Policy Evaluation',
          description: 'Portnox evaluating access policies',
          status: 'pending',
          duration: 8,
          details: [
            'Device identity verified',
            'User identity mapped to Azure AD',
            'Device compliance status checked',
            'Corporate policy rules evaluated',
            'VLAN assignment determined'
          ]
        },
        {
          id: 'network-access',
          title: 'Network Access Granted',
          description: 'Device granted access to corporate network',
          status: 'pending',
          duration: 7,
          details: [
            'RADIUS Access-Accept sent',
            'VLAN 100 assigned',
            'Corporate ACL applied',
            'Network connectivity established',
            'Group policies applied'
          ]
        }
      ]
    },
    {
      id: 'mac-corporate',
      name: 'macOS Corporate Device',
      deviceType: 'mac',
      icon: <Monitor className="h-6 w-6" />,
      description: 'macOS device with SCEP certificate enrollment',
      estimatedTime: 60,
      complexity: 'moderate',
      steps: [
        {
          id: 'network-discovery',
          title: 'Network Discovery',
          description: 'macOS discovering enterprise network',
          status: 'pending',
          duration: 8,
          details: [
            'WiFi scanning initiated',
            'Enterprise SSID detected',
            '802.1X capability confirmed'
          ]
        },
        {
          id: 'scep-enrollment',
          title: 'SCEP Certificate Enrollment',
          description: 'Automatic certificate enrollment via SCEP',
          status: 'pending',
          duration: 20,
          details: [
            'SCEP URL retrieved from configuration',
            'Certificate signing request generated',
            'Challenge password validated',
            'Certificate issued by Portnox CA',
            'Certificate installed in keychain'
          ]
        },
        {
          id: 'authentication',
          title: 'EAP-TLS Authentication',
          description: 'Certificate-based network authentication',
          status: 'pending',
          duration: 15,
          details: [
            'EAP-TLS authentication initiated',
            'Client certificate presented',
            'Server certificate chain validated',
            'TLS handshake completed'
          ]
        },
        {
          id: 'posture-assessment',
          title: 'Device Posture Assessment',
          description: 'Evaluating device security posture',
          status: 'pending',
          duration: 12,
          details: [
            'OS version compliance check',
            'Security patch level verified',
            'Antivirus status confirmed',
            'Firewall configuration validated'
          ]
        },
        {
          id: 'access-granted',
          title: 'Access Granted',
          description: 'Corporate network access provided',
          status: 'pending',
          duration: 5,
          details: [
            'Policy evaluation completed',
            'VLAN 150 assigned',
            'macOS ACL applied',
            'Network access established'
          ]
        }
      ]
    },
    {
      id: 'mobile-byod',
      name: 'Mobile BYOD Device',
      deviceType: 'mobile',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Personal mobile device with MDM enrollment',
      estimatedTime: 90,
      complexity: 'complex',
      steps: [
        {
          id: 'mdm-enrollment',
          title: 'MDM Enrollment',
          description: 'Enrolling device in Mobile Device Management',
          status: 'pending',
          duration: 30,
          details: [
            'MDM enrollment URL accessed',
            'User authentication to Azure AD',
            'Device registration initiated',
            'Compliance policies downloaded',
            'Security profiles installed'
          ]
        },
        {
          id: 'certificate-provisioning',
          title: 'Certificate Provisioning',
          description: 'Installing WiFi authentication certificate',
          status: 'pending',
          duration: 15,
          details: [
            'SCEP profile installation',
            'Certificate request generated',
            'User identity verification',
            'Certificate issued and installed'
          ]
        },
        {
          id: 'wifi-configuration',
          title: 'WiFi Configuration',
          description: 'Configuring enterprise WiFi settings',
          status: 'pending',
          duration: 10,
          details: [
            'WiFi profile installation',
            'EAP-TLS configuration applied',
            'Certificate binding completed'
          ]
        },
        {
          id: 'compliance-check',
          title: 'Compliance Verification',
          description: 'Verifying device meets security requirements',
          status: 'pending',
          duration: 20,
          details: [
            'Device encryption status verified',
            'Screen lock policy enforced',
            'App installation restrictions applied',
            'Jailbreak/root detection performed',
            'Compliance status reported'
          ]
        },
        {
          id: 'network-authentication',
          title: 'Network Authentication',
          description: 'Authenticating to corporate WiFi',
          status: 'pending',
          duration: 10,
          details: [
            'EAP-TLS authentication initiated',
            'Certificate-based authentication',
            'Policy evaluation by Portnox'
          ]
        },
        {
          id: 'limited-access',
          title: 'Limited Access Granted',
          description: 'BYOD network access with restrictions',
          status: 'pending',
          duration: 5,
          details: [
            'BYOD VLAN 400 assigned',
            'Restricted ACL applied',
            'Internet access granted',
            'Corporate resources blocked'
          ]
        }
      ]
    },
    {
      id: 'iot-device',
      name: 'IoT Device',
      deviceType: 'iot',
      icon: <Printer className="h-6 w-6" />,
      description: 'IoT device using MAC Authentication Bypass',
      estimatedTime: 30,
      complexity: 'simple',
      steps: [
        {
          id: 'mac-detection',
          title: 'MAC Address Detection',
          description: 'Network detecting device MAC address',
          status: 'pending',
          duration: 5,
          details: [
            'Device connects to network port',
            'Switch detects MAC address',
            'No 802.1X supplicant detected'
          ]
        },
        {
          id: 'mac-authentication',
          title: 'MAC Authentication Bypass',
          description: 'Authenticating device using MAC address',
          status: 'pending',
          duration: 10,
          details: [
            'MAC-based authentication initiated',
            'MAC address sent as username/password',
            'Device profiling in progress',
            'Vendor identification completed'
          ]
        },
        {
          id: 'device-profiling',
          title: 'Device Profiling',
          description: 'Identifying device type and capabilities',
          status: 'pending',
          duration: 10,
          details: [
            'DHCP fingerprinting analysis',
            'HTTP user agent detection',
            'Device category: Printer identified',
            'Vendor: HP Enterprise confirmed'
          ]
        },
        {
          id: 'iot-policy',
          title: 'IoT Policy Application',
          description: 'Applying IoT-specific access policies',
          status: 'pending',
          duration: 3,
          details: [
            'IoT device policy matched',
            'VLAN 300 assignment',
            'Bandwidth limitations applied'
          ]
        },
        {
          id: 'restricted-access',
          title: 'Restricted Access Granted',
          description: 'Limited network access for IoT device',
          status: 'pending',
          duration: 2,
          details: [
            'IoT VLAN access granted',
            'Print services allowed',
            'Internet access restricted',
            'Lateral movement blocked'
          ]
        }
      ]
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSimulating) {
      interval = setInterval(() => {
        const scenario = scenarios.find(s => s.id === selectedScenario)
        if (!scenario) return

        const currentStepData = scenario.steps[currentStep]
        if (!currentStepData) return

        setSimulationProgress(prev => {
          const newProgress = prev + (100 / currentStepData.duration)
          
          if (newProgress >= 100) {
            // Complete current step
            scenario.steps[currentStep].status = 'completed'
            
            if (currentStep < scenario.steps.length - 1) {
              // Move to next step
              setCurrentStep(currentStep + 1)
              scenario.steps[currentStep + 1].status = 'in-progress'
              return 0
            } else {
              // Simulation complete
              setIsSimulating(false)
              return 100
            }
          }
          
          return newProgress
        })
      }, 100)
    }
    
    return () => clearInterval(interval)
  }, [isSimulating, currentStep, selectedScenario, scenarios])

  const startSimulation = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario)
    if (!scenario) return

    // Reset all steps
    scenario.steps.forEach(step => {
      step.status = 'pending'
    })
    
    // Start first step
    scenario.steps[0].status = 'in-progress'
    setCurrentStep(0)
    setSimulationProgress(0)
    setIsSimulating(true)
  }

  const pauseSimulation = () => {
    setIsSimulating(false)
  }

  const resetSimulation = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario)
    if (!scenario) return

    scenario.steps.forEach(step => {
      step.status = 'pending'
    })
    
    setCurrentStep(0)
    setSimulationProgress(0)
    setIsSimulating(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'complex':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)

  return (
    <Card className="w-full max-w-6xl mx-auto max-h-[90vh] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#00c8d7]" />
            <span>Device Onboarding Scenarios</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive simulations of device authentication and onboarding processes
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-120px)]">
          {/* Scenario Selection */}
          <div className="border-r overflow-y-auto">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">Device Scenarios</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {scenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedScenario === scenario.id ? 'ring-2 ring-[#00c8d7] shadow-md' : ''
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        {scenario.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{scenario.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {scenario.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getComplexityColor(scenario.complexity)}`}>
                            {scenario.complexity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            ~{scenario.estimatedTime}s
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Simulation Controls and Progress */}
          <div className="lg:col-span-2 overflow-y-auto">
            {selectedScenarioData && (
              <div className="p-6">
                {/* Scenario Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-[#00c8d7]/10 rounded-lg">
                      {selectedScenarioData.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedScenarioData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedScenarioData.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetSimulation}
                      disabled={isSimulating}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={isSimulating ? pauseSimulation : startSimulation}
                      size="sm"
                      className="bg-[#00c8d7] hover:bg-[#0099cc]"
                    >
                      {isSimulating ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Simulation
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {selectedScenarioData.steps.length}
                    </span>
                  </div>
                  <Progress 
                    value={((currentStep + (simulationProgress / 100)) / selectedScenarioData.steps.length) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {selectedScenarioData.steps.map((step, index) => (
                    <Card 
                      key={step.id}
                      className={`transition-all duration-300 ${
                        step.status === 'in-progress' ? 'ring-2 ring-blue-500 shadow-md' : ''
                      } ${
                        step.status === 'completed' ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{step.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}s
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {step.description}
                            </p>
                            
                            {/* Step Progress */}
                            {step.status === 'in-progress' && (
                              <div className="mb-3">
                                <Progress value={simulationProgress} className="h-1" />
                              </div>
                            )}
                            
                            {/* Step Details */}
                            <div className="space-y-1">
                              {step.details.map((detail, detailIndex) => (
                                <div 
                                  key={detailIndex}
                                  className={`text-xs flex items-center space-x-2 ${
                                    step.status === 'completed' || 
                                    (step.status === 'in-progress' && detailIndex <= Math.floor((simulationProgress / 100) * step.details.length))
                                      ? 'text-green-600' 
                                      : 'text-gray-400'
                                  }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    step.status === 'completed' || 
                                    (step.status === 'in-progress' && detailIndex <= Math.floor((simulationProgress / 100) * step.details.length))
                                      ? 'bg-green-500' 
                                      : 'bg-gray-300'
                                  }`} />
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Simulation Summary */}
                <Card className="mt-6 bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wifi className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-blue-800">Simulation Summary</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Device Type:</span>
                        <div className="text-blue-800 capitalize">{selectedScenarioData.deviceType}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Complexity:</span>
                        <div className="text-blue-800 capitalize">{selectedScenarioData.complexity}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Est. Time:</span>
                        <div className="text-blue-800">{selectedScenarioData.estimatedTime} seconds</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
