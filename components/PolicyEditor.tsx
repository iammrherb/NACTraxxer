'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Settings, Shield } from 'lucide-react'

interface PolicyRule {
  id: string
  userGroup: string
  authMethod: string
  condition: string
  action: 'Allow' | 'Deny' | 'Quarantine'
  vlan: string
  priority: number
}

export default function PolicyEditor() {
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>([
    {
      id: '1',
      userGroup: 'corporate-users',
      authMethod: 'eap-tls',
      condition: 'Certificate Valid',
      action: 'Allow',
      vlan: '100',
      priority: 1
    },
    {
      id: '2',
      userGroup: 'guest-users',
      authMethod: 'captive-portal',
      condition: 'Sponsor Approved',
      action: 'Allow',
      vlan: '200',
      priority: 2
    },
    {
      id: '3',
      userGroup: 'iot-devices',
      authMethod: 'mab',
      condition: 'MAC Registered',
      action: 'Allow',
      vlan: '300',
      priority: 3
    },
    {
      id: '4',
      userGroup: 'unknown-devices',
      authMethod: 'any',
      condition: 'Not Compliant',
      action: 'Quarantine',
      vlan: '999',
      priority: 4
    }
  ])

  const addPolicyRule = () => {
    const newRule: PolicyRule = {
      id: Date.now().toString(),
      userGroup: 'corporate-users',
      authMethod: 'eap-tls',
      condition: '',
      action: 'Allow',
      vlan: '',
      priority: policyRules.length + 1
    }
    setPolicyRules([...policyRules, newRule])
  }

  const removePolicyRule = (id: string) => {
    setPolicyRules(policyRules.filter(rule => rule.id !== id))
  }

  const updatePolicyRule = (id: string, field: keyof PolicyRule, value: string | number) => {
    setPolicyRules(policyRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ))
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'Allow': return 'bg-green-100 text-green-800 border-green-200'
      case 'Deny': return 'bg-red-100 text-red-800 border-red-200'
      case 'Quarantine': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Access Control Policy Editor</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure authentication policies and access rules for different user groups and device types.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {policyRules.map((rule, index) => (
            <div key={rule.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {rule.priority}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-3">
                <Select 
                  value={rule.userGroup} 
                  onValueChange={(value) => updatePolicyRule(rule.id, 'userGroup', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="User Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate-users">Corporate Users</SelectItem>
                    <SelectItem value="guest-users">Guest Users</SelectItem>
                    <SelectItem value="iot-devices">IoT Devices</SelectItem>
                    <SelectItem value="byod">BYOD</SelectItem>
                    <SelectItem value="contractors">Contractors</SelectItem>
                    <SelectItem value="unknown-devices">Unknown Devices</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={rule.authMethod} 
                  onValueChange={(value) => updatePolicyRule(rule.id, 'authMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auth Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eap-tls">EAP-TLS</SelectItem>
                    <SelectItem value="peap-mschapv2">PEAP-MSCHAPv2</SelectItem>
                    <SelectItem value="mab">MAB</SelectItem>
                    <SelectItem value="captive-portal">Captive Portal</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Condition"
                  value={rule.condition}
                  onChange={(e) => updatePolicyRule(rule.id, 'condition', e.target.value)}
                />

                <Select 
                  value={rule.action} 
                  onValueChange={(value) => updatePolicyRule(rule.id, 'action', value as 'Allow' | 'Deny' | 'Quarantine')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="VLAN"
                  value={rule.vlan}
                  onChange={(e) => updatePolicyRule(rule.id, 'vlan', e.target.value)}
                  className="w-20"
                />

                <Badge className={getActionBadgeColor(rule.action)}>
                  {rule.action}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => removePolicyRule(rule.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button onClick={addPolicyRule} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Policy Rule
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Policy Evaluation Order</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Policies are evaluated in priority order (1 = highest). The first matching policy determines the access decision.
                Use specific conditions for higher priority rules and broader conditions for lower priority rules.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
