'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Smartphone, Laptop, Tablet, Printer, Camera, Wifi, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export default function OnboardingScenarios() {
  const [selectedScenario, setSelectedScenario] = useState('byod')

  const scenarios = [
    {
      id: 'byod',
      title: 'BYOD Device Onboarding',
      icon: Smartphone,
      description: 'Bring Your Own Device enrollment process',
      steps: [
        { id: 1, title: 'Device Registration', status: 'completed', description: 'User registers device via self-service portal' },
        { id: 2, title: 'Identity Verification', status: 'completed', description: 'Multi-factor authentication and identity validation' },
        { id: 3, title: 'Certificate Installation', status: 'in-progress', description: 'Automated certificate deployment via SCEP' },
        { id: 4, title: 'Policy Application', status: 'pending', description: 'Apply appropriate access policies based on device type' },
        { id: 5, title: 'Network Access', status: 'pending', description: 'Grant network access with monitoring enabled' }
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate Device Provisioning',
      icon: Laptop,
      description: 'Managed corporate device deployment',
      steps: [
        { id: 1, title: 'Device Imaging', status: 'completed', description: 'Standard corporate image deployment' },
        { id: 2, title: 'Domain Join', status: 'completed', description: 'Automatic domain registration and GPO application' },
        { id: 3, title: 'Certificate Enrollment', status: 'completed', description: 'Machine and user certificate auto-enrollment' },
        { id: 4, title: 'Policy Sync', status: 'in-progress', description: 'Download and apply corporate security policies' },
        { id: 5, title: 'Compliance Check', status: 'pending', description: 'Verify device meets security requirements' }
      ]
    },
    {
      id: 'guest',
      title: 'Guest Access Workflow',
      icon: Wifi,
      description: 'Temporary guest network access',
      steps: [
        { id: 1, title: 'Sponsor Request', status: 'completed', description: 'Employee sponsors guest access request' },
        { id: 2, title: 'Approval Process', status: 'completed', description: 'Automated or manual approval workflow' },
        { id: 3, title: 'Credential Generation', status: 'completed', description: 'Generate temporary access credentials' },
        { id: 4, title: 'Access Notification', status: 'in-progress', description: 'Send access details to guest via email/SMS' },
        { id: 5, title: 'Time-Limited Access', status: 'pending', description: 'Provide restricted network access with expiration' }
      ]
    },
    {
      id: 'iot',
      title: 'IoT Device Integration',
      icon: Camera,
      description: 'Internet of Things device onboarding',
      steps: [
        { id: 1, title: 'Device Discovery', status: 'completed', description: 'Automatic device detection and fingerprinting' },
        { id: 2, title: 'Classification', status: 'completed', description: 'Identify device type and manufacturer' },
        { id: 3, title: 'Risk Assessment', status: 'in-progress', description: 'Evaluate device security posture and vulnerabilities' },
        { id: 4, title: 'Micro-segmentation', status: 'pending', description: 'Assign to appropriate network segment' },
        { id: 5, title: 'Monitoring Setup', status: 'pending', description: 'Enable continuous monitoring and anomaly detection' }
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'pending':
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Device Onboarding Scenarios</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize and manage different device onboarding workflows and processes.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
            <TabsList className="grid w-full grid-cols-4">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{scenario.title.split(' ')[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {scenarios.map((scenario) => (
              <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
                <div className="space-y-6">
                  {/* Scenario Header */}
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <scenario.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold">{scenario.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{scenario.description}</p>
                    </div>
                  </div>

                  {/* Process Steps */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Onboarding Process</h4>
                    <div className="space-y-4">
                      {scenario.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">Step {step.id}: {step.title}</h5>
                              {getStatusBadge(step.status)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                          </div>
                          {index < scenario.steps.length - 1 && (
                            <div className="absolute left-6 mt-8 w-px h-8 bg-gray-300 dark:bg-gray-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button>Start Onboarding</Button>
                    <Button variant="outline">View Details</Button>
                    <Button variant="outline">Export Workflow</Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
