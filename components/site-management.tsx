"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSites, type Site, type Vendor, type Cloud, type Mdm, type RadsecDeployment } from "@/hooks/use-sites"
import { Plus, Trash2, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SiteManagement({ onSiteSelect }: { onSiteSelect: (id: string) => void }) {
  const { sites, addSite, removeSite, updateSite, resetSites } = useSites()
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Site | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return sites.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.country.toLowerCase().includes(q),
    )
  }, [sites, search])

  const empty: Site = {
    id: "",
    name: "",
    region: "NA",
    country: "",
    users: 0,
    wiredVendor: "cisco",
    wirelessVendor: "cisco",
    cloudPreference: "azure",
    mdm: ["intune"],
    idp: "azure-ad",
    deviceMix: { windows: 0, mac: 0, linux: 0, ios: 0, android: 0, iot: 0 },
    radsecDeployment: "azure",
    status: "Planned",
    completionPercent: 0,
  }

  const openNew = () => {
    setEdit(empty)
    setOpen(true)
  }

  const save = () => {
    if (!edit) return
    if (!edit.id || !edit.name) return
    const exists = sites.some((s) => s.id === edit.id)
    if (exists) updateSite(edit.id, edit)
    else addSite(edit)
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Master Site List</span>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search sites..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
            <Button variant="outline" onClick={resetSites}>
              Seed Data
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Region</th>
              <th className="p-2">Country</th>
              <th className="p-2">Users</th>
              <th className="p-2">Wired</th>
              <th className="p-2">Wireless</th>
              <th className="p-2">Cloud</th>
              <th className="p-2">RADSec</th>
              <th className="p-2">MDM</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b hover:bg-neutral-50">
                <td className="p-2 font-mono">{s.id}</td>
                <td className="p-2">
                  <button className="text-emerald-700 hover:underline" onClick={() => onSiteSelect(s.id)}>
                    {s.name}
                  </button>
                </td>
                <td className="p-2">{s.region}</td>
                <td className="p-2">{s.country}</td>
                <td className="p-2">{s.users.toLocaleString()}</td>
                <td className="p-2 uppercase">{s.wiredVendor}</td>
                <td className="p-2 uppercase">{s.wirelessVendor}</td>
                <td className="p-2 uppercase">{s.cloudPreference}</td>
                <td className="p-2 uppercase">{s.radsecDeployment}</td>
                <td className="p-2 uppercase">
                  {s.mdm.map((m) => (
                    <Badge key={m} variant="secondary" className="mr-1">
                      {m.toUpperCase()}
                    </Badge>
                  ))}
                </td>
                <td className="p-2">{s.status}</td>
                <td className="p-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEdit(s)
                      setOpen(true)
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeSite(s.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} className="p-6 text-center text-neutral-500">
                  No sites found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Edit Site" : "New Site"}</DialogTitle>
          </DialogHeader>
          {edit && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Site ID</Label>
                <Input value={edit.id} onChange={(e) => setEdit({ ...edit, id: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Name</Label>
                <Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </div>
              <div>
                <Label>Region</Label>
                <Select value={edit.region} onValueChange={(v) => setEdit({ ...edit, region: v as Site["region"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">NA</SelectItem>
                    <SelectItem value="EMEA">EMEA</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                    <SelectItem value="LATAM">LATAM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Input value={edit.country} onChange={(e) => setEdit({ ...edit, country: e.target.value })} />
              </div>
              <div>
                <Label>Users</Label>
                <Input
                  type="number"
                  value={edit.users}
                  onChange={(e) => setEdit({ ...edit, users: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Wired Vendor</Label>
                <Select value={edit.wiredVendor} onValueChange={(v) => setEdit({ ...edit, wiredVendor: v as Vendor })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["cisco", "aruba", "juniper", "extreme", "ruckus", "fortinet", "paloalto"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wireless Vendor</Label>
                <Select
                  value={edit.wirelessVendor}
                  onValueChange={(v) => setEdit({ ...edit, wirelessVendor: v as Vendor })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["cisco", "aruba", "juniper", "extreme", "ruckus", "fortinet", "paloalto"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cloud Preference</Label>
                <Select
                  value={edit.cloudPreference}
                  onValueChange={(v) => setEdit({ ...edit, cloudPreference: v as Cloud })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["aws", "azure", "gcp", "onprem"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>RADSec Deployment</Label>
                <Select
                  value={edit.radsecDeployment}
                  onValueChange={(v) => setEdit({ ...edit, radsecDeployment: v as RadsecDeployment })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["onprem", "aws", "azure", "gcp"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>MDM</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["intune", "jamf", "airwatch", "samsung-knox"] as Mdm[]).map((m) => {
                    const checked = edit.mdm.includes(m)
                    return (
                      <Button
                        key={m}
                        type="button"
                        variant={checked ? "default" : "outline"}
                        onClick={() =>
                          setEdit({
                            ...edit,
                            mdm: checked ? edit.mdm.filter((x) => x !== m) : [...edit.mdm, m],
                          })
                        }
                      >
                        {m.toUpperCase()}
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={edit.status} onValueChange={(v) => setEdit({ ...edit, status: v as Site["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Planned", "In Progress", "Complete", "Delayed"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Completion %</Label>
                <Input
                  type="number"
                  value={edit.completionPercent}
                  onChange={(e) => setEdit({ ...edit, completionPercent: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button onClick={save}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
