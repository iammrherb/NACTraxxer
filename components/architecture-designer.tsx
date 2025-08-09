"use client"

import { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import InteractiveDiagram, { type InteractiveDiagramHandle } from "@/components/interactive-diagram"
import { Download, Settings, Play, Layers } from "lucide-react"
import OnboardingScenarios from "@/components/onboarding-scenarios"
import PolicyEditor from "@/components/policy-editor"
import { useSites } from "@/hooks/use-sites"

export default function ArchitectureDesigner() {
  const { sites } = useSites()
  const [selectedView, setSelectedView] = useState("multi-site")
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showDataFlow, setShowDataFlow] = useState(true)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showOnboardingScenarios, setShowOnboardingScenarios] = useState(false)
  const [activeSiteId, setActiveSiteId] = useState<string>(sites[0]?.id || "")

  const diagramRef = useRef<InteractiveDiagramHandle>(null)

  const architectureViews = useMemo(
    () => [
      {
        value: "multi-site",
        label: "Multi-Site Global View",
        description: "All sites with RADSec placement and cloud",
      },
      { value: "complete", label: "Complete Architecture (Site)", description: "End-to-end for selected site" },
      { value: "auth-flow", label: "Authentication Workflow (CoA)", description: "Step-by-step 802.1X with CoA" },
      { value: "pki", label: "PKI & Certificate Management", description: "Root/Issuing CA, CRL and cert flows" },
      {
        value: "policies",
        label: "Policy Enforcement & VLANs",
        description: "User/device policies and VLAN assignment",
      },
      {
        value: "tacacs-admin",
        label: "Admin Access (TACACS+/RADIUS)",
        description: "Admin AAA for firewalls/switches",
      },
      { value: "onboarding", label: "Device Onboarding & Guest/IoT", description: "Captive portal, BYOD, IoT" },
    ],
    [],
  )

  const exportPNG = () => diagramRef.current?.exportPNG(`diagram-${selectedView}.png`)
  const exportSVG = () => diagramRef.current?.exportSVG(`diagram-${selectedView}.svg`)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Portnox NAC Architecture Designer</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportPNG}>
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>
              <Button variant="outline" size="sm" onClick={exportSVG}>
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="view-select">View</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="view-select">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {architectureViews.map((view) => (
                    <SelectItem key={view.value} value={view.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{view.label}</span>
                        <span className="text-xs text-muted-foreground">{view.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-select">Active Site (for site views)</Label>
              <Select value={activeSiteId} onValueChange={setActiveSiteId}>
                <SelectTrigger id="site-select">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium">{s.name}</span>
                        <Badge variant="secondary">{s.region}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation-speed">Animation Speed</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="animation-speed"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                />
                <Badge variant="outline">{animationSpeed[0]}x</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="data-flow" checked={showDataFlow} onCheckedChange={setShowDataFlow} />
              <Label htmlFor="data-flow">Show Data Flow Animation</Label>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPolicyEditor(true)}>
                <Settings className="h-4 w-4 mr-2" /> Policy Editor
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowOnboardingScenarios(true)}>
                <Play className="h-4 w-4 mr-2" /> Onboarding Flows
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{architectureViews.find((v) => v.value === selectedView)?.label || "Diagram"}</CardTitle>
        </CardHeader>
        <CardContent>
          <InteractiveDiagram
            ref={diagramRef}
            view={selectedView}
            animationSpeed={animationSpeed[0]}
            showDataFlow={showDataFlow}
            activeSiteId={activeSiteId}
          />
        </CardContent>
      </Card>

      {showPolicyEditor && <PolicyEditor onClose={() => setShowPolicyEditor(false)} />}
      {showOnboardingScenarios && <OnboardingScenarios onClose={() => setShowOnboardingScenarios(false)} />}
    </div>
  )
}
