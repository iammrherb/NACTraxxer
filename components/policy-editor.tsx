"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Globe, Building } from "lucide-react"

interface Policy {
  id: string
  name: string
  condition: string
  action: string
  vlan: string
  priority: number
  type: "global" | "site-specific"
  siteId?: string
  description?: string
}

interface PolicyEditorProps {
  onClose: () => void
  siteId?: string
  siteName?: string
}

export default function PolicyEditor({ onClose, siteId, siteName }: PolicyEditorProps) {
  const [globalPolicies, setGlobalPolicies] = useState<Policy[]>([])
  const [sitePolicies, setSitePolicies] = useState<Policy[]>([])
  const [activeTab, setActiveTab] = useState(siteId ? "site" : "global")

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    condition: "",
    action: "Allow",
    vlan: "",
    priority: 1,
    description: "",
    type: "global" as "global" | "site-specific",
  })

  // Load policies from localStorage
  useEffect(() => {
    const savedGlobalPolicies = localStorage.getItem("portnox-global-policies")
    if (savedGlobalPolicies) {
      setGlobalPolicies(JSON.parse(savedGlobalPolicies))
    }

    if (siteId) {
      const savedSitePolicies = localStorage.getItem(`portnox-site-policies-${siteId}`)
      if (savedSitePolicies) {
        setSitePolicies(JSON.parse(savedSitePolicies))
      }
    }
  }, [siteId])

  // Save policies to localStorage
  const saveGlobalPolicies = (policies: Policy[]) => {
    localStorage.setItem("portnox-global-policies", JSON.stringify(policies))
    setGlobalPolicies(policies)
  }

  const saveSitePolicies = (policies: Policy[]) => {
    if (siteId) {
      localStorage.setItem(`portnox-site-policies-${siteId}`, JSON.stringify(policies))
      setSitePolicies(policies)
    }
  }

  const addPolicy = () => {
    if (newPolicy.name && newPolicy.condition) {
      const policy: Policy = {
        ...newPolicy,
        id: `policy-${Date.now()}`,
        type: activeTab === "global" ? "global" : "site-specific",
        siteId: activeTab === "site" ? siteId : undefined,
      }

      if (activeTab === "global") {
        const updatedPolicies = [...globalPolicies, policy]
        saveGlobalPolicies(updatedPolicies)
      } else {
        const updatedPolicies = [...sitePolicies, policy]
        saveSitePolicies(updatedPolicies)
      }

      setNewPolicy({
        name: "",
        condition: "",
        action: "Allow",
        vlan: "",
        priority: 1,
        description: "",
        type: "global",
      })
    }
  }

  const removePolicy = (id: string, type: "global" | "site") => {
    if (type === "global") {
      const updatedPolicies = globalPolicies.filter((p) => p.id !== id)
      saveGlobalPolicies(updatedPolicies)
    } else {
      const updatedPolicies = sitePolicies.filter((p) => p.id !== id)
      saveSitePolicies(updatedPolicies)
    }
  }

  const PolicyList = ({ policies, type }: { policies: Policy[]; type: "global" | "site" }) => (
    <div className="space-y-3">
      {policies.map((policy) => (
        <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">Priority {policy.priority}</Badge>
              <span className="font-medium">{policy.name}</span>
              {type === "global" && (
                <Badge variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  Global
                </Badge>
              )}
              {type === "site" && (
                <Badge variant="default">
                  <Building className="h-3 w-3 mr-1" />
                  Site
                </Badge>
              )}
            </div>
            {policy.description && <div className="text-sm text-muted-foreground mb-1">{policy.description}</div>}
            <div className="text-sm text-muted-foreground mb-1">
              <strong>Condition:</strong> {policy.condition}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Action:</strong> {policy.action} (VLAN {policy.vlan})
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePolicy(policy.id, type)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {policies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No {type} policies defined yet.</p>
        </div>
      )}
    </div>
  )

  return (
    <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>NAC Policy Editor</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Global Policies</span>
            </TabsTrigger>
            <TabsTrigger value="site" disabled={!siteId} className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Site Policies {siteName && `(${siteName})`}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Global Policies</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Global policies apply to all sites and have lower priority than site-specific policies.
              </p>
              <PolicyList policies={globalPolicies} type="global" />
            </div>
          </TabsContent>

          <TabsContent value="site" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <span>Site-Specific Policies {siteName && `for ${siteName}`}</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Site-specific policies override global policies and have higher priority.
              </p>
              <PolicyList policies={sitePolicies} type="site" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Add New Policy */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Add New {activeTab === "global" ? "Global" : "Site-Specific"} Policy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policy-name">Policy Name</Label>
              <Input
                id="policy-name"
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                placeholder="e.g., Mobile Devices"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-action">Action</Label>
              <Select value={newPolicy.action} onValueChange={(value) => setNewPolicy({ ...newPolicy, action: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allow">Allow Full Access</SelectItem>
                  <SelectItem value="Quarantine">Quarantine</SelectItem>
                  <SelectItem value="Deny">Deny Access</SelectItem>
                  <SelectItem value="Limited">Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-vlan">VLAN ID</Label>
              <Input
                id="policy-vlan"
                value={newPolicy.vlan}
                onChange={(e) => setNewPolicy({ ...newPolicy, vlan: e.target.value })}
                placeholder="e.g., 300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-priority">Priority</Label>
              <Input
                id="policy-priority"
                type="number"
                value={newPolicy.priority}
                onChange={(e) => setNewPolicy({ ...newPolicy, priority: Number.parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="policy-description">Description (Optional)</Label>
              <Input
                id="policy-description"
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                placeholder="Brief description of this policy"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="policy-condition">Condition</Label>
              <Textarea
                id="policy-condition"
                value={newPolicy.condition}
                onChange={(e) => setNewPolicy({ ...newPolicy, condition: e.target.value })}
                placeholder="e.g., Device Type = iOS AND Certificate Valid = True"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setNewPolicy({
                  name: "",
                  condition: "",
                  action: "Allow",
                  vlan: "",
                  priority: 1,
                  description: "",
                  type: "global",
                })
              }
            >
              Clear
            </Button>
            <Button onClick={addPolicy}>
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === "global" ? "Global" : "Site"} Policy
            </Button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
