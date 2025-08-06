'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Laptop, Smartphone, Users, Wifi, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'complete'
  duration: string
}

interface OnboardingScenario {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  steps: OnboardingStep[]
  requirements: string[]
  vlan: string
  authMethod: string
}

export default function OnboardingScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<string>('corporate')

  const scenarios: OnboardingScenario[] = [
    {
      id: 'corporate',
      title: 'Corporate Managed Device',
      icon: <Laptop className="h-6 w-6" />,
      description: 'Automated onboarding for company-owned devices managed by Intune',
      authMethod: 'EAP-TLS Certificate',
      vlan: '100 (Corporate)',
      requirements: [
        'Device enrolled in Microsoft Intune',
        'Corporate Azure AD account',
        'Device compliance policy met',
        'Certificate-capable device'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Enrollment',
          description: 'Device is enrolled in Microsoft Intune MDM during initial setup',
          status: 'complete',
          duration: '5-10 minutes'
        },
        {
          id: '2',
          title: 'Certificate Provisioning',
          description: 'Intune pushes SCEP certificate profile to device',
          status: 'complete',
          duration: '2-5 minutes'
        },
        {
          id: '3',
          title: 'WiFi Profile Deployment',
          description: 'WiFi profile with EAP-TLS configuration deployed',
          status: 'complete',
          duration: '1-2 minutes'
        },
        {
          id: '4',
          title: 'Network Authentication',
          description: 'Device automatically connects using certificate authentication',
          status: 'active',
          duration: '10-30 seconds'
        },
        {
          id: '5',
          title: 'Policy Application',
          description: 'Corporate access policies applied, full network access granted',
          status: 'pending',
          duration: '5-10 seconds'
        }
      ]
    },
    {
      id: 'byod',
      title: 'BYOD Device Onboarding',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Self-service onboarding for personal devices',
      authMethod: 'User Certificate + Device Registration',
      vlan: '150 (BYOD)',
      requirements: [
        'Valid corporate credentials',
        'Device meets minimum security requirements',
        'User accepts BYOD policy',
        'Device supports certificate installation'
      ],
      steps: [
        {
          id: '1',
          title: 'Portal Access',
          description: 'User accesses self-service onboarding portal',
          status: 'complete',
          duration: '1-2 minutes'
        },
        {
          id: '2',
          title: 'Authentication',
          description: 'User authenticates with corporate credentials',
          status: 'complete',
          duration: '30 seconds'
        },
        {
          id: '3',
          title: 'Policy Acceptance',
          description: 'User reviews and accepts BYOD usage policy',
          status: 'complete',
          duration: '2-3 minutes'
        },
        {
          id: '4',
          title: 'Device Registration',
          description: 'Device is registered and certificate is installed',
          status: 'active',
          duration: '3-5 minutes'
        },
        {
          id: '5',
          title: 'Network Access',
          description: 'Device connects to BYOD network with restricted access',
          status: 'pending',
          duration: '30 seconds'
        }
      ]
    },
    {
      id: 'guest',
      title: 'Guest Access',
      icon: <Users className="h-6 w-6" />,
      description: 'Sponsored guest access with approval workflow',
      authMethod: 'Captive Portal + Sponsor Approval',
      vlan: '200 (Guest)',
      requirements: [
        'Sponsor employee account',
        'Valid business justification',
        'Guest contact information',
        'Time-limited access'
      ],
      steps: [
        {
          id: '1',
          title: 'Network Connection',
          description: 'Guest connects to open guest SSID',
          status: 'complete',
          duration: '30 seconds'
        },
        {
          id: '2',
          title: 'Captive Portal',
          description: 'Guest redirected to captive portal for registration',
          status: 'complete',
          duration: '1 minute'
        },
        {
          id: '3',
          title: 'Sponsor Request',
          description: 'Guest enters sponsor information and access request',
          status: 'complete',
          duration: '2-3 minutes'
        },
        {
          id: '4',
          title: 'Sponsor Approval',
          description: 'Sponsor receives notification and approves access',
          status: 'active',
          duration: '5-30 minutes'
        },
        {
          id: '5',
          title: 'Internet Access',
          description: 'Guest granted internet-only access for specified duration',
          status: 'pending',
          duration: '30 seconds'
        }
      ]
    },
    {
      id: 'iot',
      title: 'IoT Device Registration',
      icon: <Wifi className="h-6 w-6" />,
      description: 'MAC Authentication Bypass for IoT devices',
      authMethod: 'MAC Authentication Bypass (MAB)',
      vlan: '300 (IoT)',
      requirements: [
        'Device MAC address registration',
        'Device classification and profiling',
        'Network administrator approval',
        'Micro-segmentation policies'
      ],
      steps: [
        {
          id: '1',
          title: 'Device Discovery',
          description: 'IoT device attempts network connection',
          status: 'complete',
          duration: '10 seconds'
        },
        {
          id: '2',
          title: 'MAC Registration',
          description: 'Administrator registers device MAC address in portal',
          status: 'complete',
          duration: '2-5 minutes'
        },
        {
          id: '3',
          title: 'Device Profiling',
          description: 'System profiles device type and assigns appropriate policies',
          status: 'complete',
          duration: '1-2 minutes'
        },
        {
          id: '4',
          title: 'Policy Assignment',
          description: 'Micro-segmentation policies applied based on device type',
          status: 'active',
          duration: '30 seconds'
        },
        {
          id: '5',
          title: 'Limited Access',
          description: 'Device granted access to specific services only',
          status: 'pending',
          duration: '10 seconds'
        }
      ]
    }
  ]

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepBorderColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      case 'active':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
      case 'pending':
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Onboarding Scenarios</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Interactive step-by-step guides for different device onboarding workflows
          </p>
        </CardHeader>
        <CardContent>
          {/* Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {scenarios.map((scenario) => (
              <Button
                key={scenario.id}
                variant={selectedScenario === scenario.id ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedScenario(scenario.id)}
              >
                {scenario.icon}
                <span className="text-sm font-medium text-center">{scenario.title}</span>
              </Button>
            ))}
          </div>

          {selectedScenarioData && (
            <div className="space-y-6">
              {/* Scenario Overview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    {selectedScenarioData.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedScenarioData.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedScenarioData.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Auth Method:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedScenarioData.authMethod}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Target VLAN:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedScenarioData.vlan}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Prerequisites & Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedScenarioData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Onboarding Workflow
                </h4>
                <div className="space-y-4">
                  {selectedScenarioData.steps.map((step, index) => (
                    <div key={step.id}>
                      <div className={`border rounded-lg p-4 ${getStepBorderColor(step.status)}`}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                Step {index + 1}: {step.title}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {index < selectedScenarioData.steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Implementation Notes
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• All onboarding processes are logged for audit and troubleshooting</li>
                  <li>• Failed onboarding attempts trigger automatic notifications</li>
                  <li>• Devices can be re-onboarded if policies or certificates change</li>
                  <li>• Time-based access controls can be applied to any scenario</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
