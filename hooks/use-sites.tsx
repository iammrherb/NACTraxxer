"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Vendor = "cisco" | "aruba" | "juniper" | "extreme" | "ruckus" | "fortinet" | "paloalto"
export type Cloud = "aws" | "azure" | "gcp" | "onprem"
export type Mdm = "intune" | "jamf" | "airwatch" | "samsung-knox"
export type RadsecDeployment = "onprem" | "aws" | "azure" | "gcp"

export type Site = {
  id: string
  name: string
  region: "NA" | "EMEA" | "APAC" | "LATAM"
  country: string
  users: number
  wiredVendor: Vendor
  wirelessVendor: Vendor
  cloudPreference: Cloud
  mdm: Mdm[]
  idp: "azure-ad" | "okta" | "ad" | "google"
  deviceMix: { windows: number; mac: number; linux: number; ios: number; android: number; iot: number }
  radsecDeployment: RadsecDeployment
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent: number
}

type SitesContextValue = {
  sites: Site[]
  addSite: (s: Site) => void
  updateSite: (id: string, patch: Partial<Site>) => void
  removeSite: (id: string) => void
  resetSites: () => void
}

const SitesContext = createContext<SitesContextValue | null>(null)

const seedSites: Site[] = [
  {
    id: "HQ001",
    name: "Global HQ",
    region: "NA",
    country: "USA",
    users: 2500,
    wiredVendor: "cisco",
    wirelessVendor: "cisco",
    cloudPreference: "azure",
    mdm: ["intune"],
    idp: "azure-ad",
    deviceMix: { windows: 1600, mac: 600, linux: 100, ios: 400, android: 250, iot: 300 },
    radsecDeployment: "azure",
    status: "In Progress",
    completionPercent: 40,
  },
  {
    id: "DC01",
    name: "Primary Data Center",
    region: "NA",
    country: "USA",
    users: 200,
    wiredVendor: "juniper",
    wirelessVendor: "fortinet",
    cloudPreference: "aws",
    mdm: ["intune"],
    idp: "azure-ad",
    deviceMix: { windows: 120, mac: 20, linux: 60, ios: 10, android: 10, iot: 500 },
    radsecDeployment: "onprem",
    status: "In Progress",
    completionPercent: 65,
  },
  {
    id: "EU-HQ",
    name: "European HQ",
    region: "EMEA",
    country: "Germany",
    users: 1200,
    wiredVendor: "aruba",
    wirelessVendor: "aruba",
    cloudPreference: "gcp",
    mdm: ["intune", "jamf"],
    idp: "azure-ad",
    deviceMix: { windows: 700, mac: 350, linux: 50, ios: 200, android: 150, iot: 100 },
    radsecDeployment: "gcp",
    status: "Planned",
    completionPercent: 0,
  },
]

export function SitesProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("portnox-sites-v2")
    if (saved) setSites(JSON.parse(saved))
    else setSites(seedSites)
  }, [])

  useEffect(() => {
    localStorage.setItem("portnox-sites-v2", JSON.stringify(sites))
  }, [sites])

  const value = useMemo(
    () => ({
      sites,
      addSite: (s: Site) => setSites((arr) => [...arr, s]),
      updateSite: (id: string, patch: Partial<Site>) =>
        setSites((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s))),
      removeSite: (id: string) => setSites((arr) => arr.filter((s) => s.id !== id)),
      resetSites: () => setSites(seedSites),
    }),
    [sites],
  )

  return <SitesContext.Provider value={value}>{children}</SitesContext.Provider>
}

export function useSites() {
  const ctx = useContext(SitesContext)
  if (!ctx) throw new Error("useSites must be used within SitesProvider")
  return ctx
}
