"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PolicyEditorProps {
  onClose: () => void
}

interface Policy {
  id: string
  name: string
  type: "user" | "device" | "network" | "compliance"
  priority: number
  conditions: string[]
  actions: string[]
  vlan: number
  description: string
  enabled: boolean
}

type Rule = {
  id: string
  name: string
  when: string
  then: string
}

export default function PolicyEditor({ onClose }: PolicyEditorProps) {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      name: "Corporate Windows Devices",
      type: "device",
      priority: 1,
      conditions: ["Device Type: Windows", "Certificate Present: True", "Domain Joined: True"],
      actions: ["Allow Access", "Assign VLAN 100"],
      vlan: 100,
      description: "Policy for corporate Windows devices with valid certificates",
      enabled: true,
    },
    {
      id: "2",
      name: "Guest Access",
      type: "user",
      priority: 3,
      conditions: ["User Group: Guests", "Sponsor Approval: Required"],
      actions: ["Limited Access", "Assign VLAN 200", "Time Limit: 8 hours"],
      vlan: 200,
      description: "Temporary access for guest users with sponsor approval",
      enabled: true,
    },
    {
      id: "3",
      name: "IoT Devices",
      type: "device",
      priority: 2,
      conditions: ["Authentication: MAC", "Device Category: IoT"],
      actions: ["Allow Access", "Assign VLAN 300", "Bandwidth Limit: 10Mbps"],
      vlan: 300,
      description: "Policy for IoT devices using MAC authentication bypass",
      enabled: true,
    },
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [rules, setRules] = useState<Rule[]>([
    { id: "r1", name: "Corp-Managed", when: "User in Corp + Device Compliant", then: "VLAN 10 + ACL CORP" },
    { id: "r2", name: "BYOD", when: "User not managed + MFA", then: "VLAN 30 + ACL INTERNET" },
    { id: "r3", name: "Guest", when: "Guest token valid", then: "VLAN 50 + ACL GUEST" },
    { id: "r4", name: "IoT", when: "Device in IoT group", then: "VLAN 70 + ACL IOT" },
  ])
  const [newRule, setNewRule] = useState<Rule>({ id: "", name: "", when: "", then: "" })

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy({ ...policy })
    setIsEditing(true)
  }

  const handleSavePolicy = () => {
    if (!selectedPolicy) return

    if (selectedPolicy.id === "new") {
      const newPolicy = {
        ...selectedPolicy,
        id: Date.now().toString(),
      }
      setPolicies([...policies, newPolicy])
    } else {
      setPolicies(policies.map((p) => (p.id === selectedPolicy.id ? selectedPolicy : p)))
    }

    setSelectedPolicy(null)
    setIsEditing(false)
  }

  const handleDeletePolicy = (id: string) => {
    setPolicies(policies.filter((p) => p.id !== id))
    if (selectedPolicy?.id === id) {
      setSelectedPolicy(null)
      setIsEditing(false)
    }
  }

  const handleAddPolicy = () => {
    setSelectedPolicy({
      id: "new",
      name: "",
      type: "user",
      priority: policies.length + 1,
      conditions: [],
      actions: [],
      vlan: 100,
      description: "",
      enabled: true,
    })
    setIsEditing(true)
  }

  const addCondition = () => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: [...selectedPolicy.conditions, ""],
    })
  }

  const updateCondition = (index: number, value: string) => {
    if (!selectedPolicy) return
    const newConditions = [...selectedPolicy.conditions]
    newConditions[index] = value
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: newConditions,
    })
  }

  const removeCondition = (index: number) => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: selectedPolicy.conditions.filter((_, i) => i !== index),
    })
  }

  const addAction = () => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      actions: [...selectedPolicy.actions, ""],
    })
  }

  const updateAction = (index: number, value: string) => {
    if (!selectedPolicy) return
    const newActions = [...selectedPolicy.actions]
    newActions[index] = value
    setSelectedPolicy({
      ...selectedPolicy,
      actions: newActions,
    })
  }

  const removeAction = (index: number) => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      actions: selectedPolicy.actions.filter((_, i) => i !== index),
    })
  }

  const add = () => {
    if (!newRule.name) return
    setRules((arr) => [...arr, { ...newRule, id: crypto.randomUUID() }])
    setNewRule({ id: "", name: "", when: "", then: "" })
  }

  const remove = (id: string) => setRules((arr) => arr.filter((r) => r.id !== id))

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>NAC Policy Editor</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Policies</h3>
              <Button onClick={handleAddPolicy} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>

            <div className="space-y-2">
              {policies.map((policy) => (
                <Card
                  key={policy.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPolicy?.id === policy.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleEditPolicy(policy)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{policy.name}</h4>
                          <Badge variant={policy.enabled ? "default" : "secondary"}>
                            {policy.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <Badge variant="outline">Priority {policy.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {policy.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            VLAN {policy.vlan}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePolicy(policy.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Policy Editor */}
          <div className="space-y-4">
            {isEditing && selectedPolicy ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {selectedPolicy.id === "new" ? "New Policy" : "Edit Policy"}
                  </h3>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePolicy}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-name">Policy Name</Label>
                      <Input
                        id="policy-name"
                        value={selectedPolicy.name}
                        onChange={(e) =>
                          setSelectedPolicy({
                            ...selectedPolicy,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter policy name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-type">Policy Type</Label>
                      <Select
                        value={selectedPolicy.type}
                        onValueChange={(value: "user" | "device" | "network" | "compliance") =>
                          setSelectedPolicy({
                            ...selectedPolicy,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User-based</SelectItem>
                          <SelectItem value="device">Device-based</SelectItem>
                          <SelectItem value="network">Network-based</SelectItem>
                          <SelectItem value="compliance">Compliance-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-priority">Priority</Label>
                      <Input
                        id="policy-priority"
                        type="number"
                        value={selectedPolicy.priority}
                        onChange={(e) =>
                          setSelectedPolicy({
                            ...selectedPolicy,
                            priority: Number.parseInt(e.target.value) || 1,
                          })
                        }
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-vlan">VLAN Assignment</Label>
                      <Input
                        id="policy-vlan"
                        type="number"
                        value={selectedPolicy.vlan}
                        onChange={(e) =>
                          setSelectedPolicy({
                            ...selectedPolicy,
                            vlan: Number.parseInt(e.target.value) || 100,
                          })
                        }
                        min="1"
                        max="4094"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="policy-description">Description</Label>
                    <Input
                      id="policy-description"
                      value={selectedPolicy.description}
                      onChange={(e) =>
                        setSelectedPolicy({
                          ...selectedPolicy,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter policy description"
                    />
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Conditions</Label>
                      <Button variant="outline" size="sm" onClick={addCondition}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedPolicy.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={condition}
                            onChange={(e) => updateCondition(index, e.target.value)}
                            placeholder="Enter condition"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Actions</Label>
                      <Button variant="outline" size="sm" onClick={addAction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedPolicy.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={action}
                            onChange={(e) => updateAction(index, e.target.value)}
                            placeholder="Enter action"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Select a policy to edit or create a new one
              </div>
            )}

            {/* Rules Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  placeholder="Name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
                <Input
                  placeholder="When (conditions)"
                  value={newRule.when}
                  onChange={(e) => setNewRule({ ...newRule, when: e.target.value })}
                />
                <Input
                  placeholder="Then (actions)"
                  value={newRule.then}
                  onChange={(e) => setNewRule({ ...newRule, then: e.target.value })}
                />
                <Button onClick={add}>Add Rule</Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Name</th>
                    <th className="p-2">When</th>
                    <th className="p-2">Then</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.when}</td>
                      <td className="p-2">{r.then}</td>
                      <td className="p-2 text-right">
                        <Button variant="ghost" className="text-red-600" onClick={() => remove(r.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {rules.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-neutral-500">
                        No rules yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
