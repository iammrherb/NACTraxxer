"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useThemeSettings } from "@/lib/theme"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function ThemeCustomizer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { theme, updateTheme } = useThemeSettings()

  const updateProto = (key: string, val: string) =>
    updateTheme({ protocolColors: { ...theme.protocolColors, [key]: val } })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Theme Customizer</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Primary</Label>
            <Input type="color" value={theme.primary} onChange={(e) => updateTheme({ primary: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Background Gradient (CSS)</Label>
            <Input value={theme.background} onChange={(e) => updateTheme({ background: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Edge Width</Label>
            <Slider
              min={1}
              max={6}
              step={1}
              value={[theme.edgeWidth]}
              onValueChange={(v) => updateTheme({ edgeWidth: v[0] })}
            />
            <Badge variant="outline">{theme.edgeWidth}px</Badge>
          </div>

          <div className="md:col-span-3">
            <Label className="block mb-2">Protocol Colors</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(theme.protocolColors).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <Badge className="min-w-[80px]" variant="secondary">
                    {k.toUpperCase()}
                  </Badge>
                  <Input type="color" value={v} onChange={(e) => updateProto(k, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
