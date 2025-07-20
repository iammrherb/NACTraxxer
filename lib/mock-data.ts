import type { Site, User, Vendor, DeviceType, ChecklistItem, BaseVendor } from "./database"

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "Senior Project Manager",
    user_type: "project_manager",
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Bob Williams",
    email: "bob.w@example.com",
    role: "Project Manager",
    user_type: "project_manager",
    created_at: "2025-01-11T11:00:00Z",
    updated_at: "2025-01-11T11:00:00Z",
  },
  {
    id: 7,
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "Network Engineer",
    user_type: "technical_owner",
    created_at: "2025-01-12T12:00:00Z",
    updated_at: "2025-01-12T12:00:00Z",
  },
  {
    id: 8,
    name: "Diana Prince",
    email: "diana.p@example.com",
    role: "Security Engineer",
    user_type: "technical_owner",
    created_at: "2025-01-13T13:00:00Z",
    updated_at: "2025-01-13T13:00:00Z",
  },
]

export const mockWiredVendors: Vendor[] = [
  { id: 1, name: "Cisco", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Juniper", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Arista", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 4, name: "HPE/Aruba", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Extreme Networks", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 6, name: "Dell", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const mockWirelessVendors: Vendor[] = [
  { id: 14, name: "Cisco/Meraki", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 15, name: "HPE/Aruba", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 16, name: "Ubiquiti", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 17, name: "Ruckus (CommScope)", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 18, name: "Juniper Mist", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 19, name: "Extreme Networks", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const mockFirewallVendors: BaseVendor[] = [
  { id: 1, name: "Palo Alto Networks" },
  { id: 2, name: "Fortinet" },
  { id: 3, name: "Cisco" },
  { id: 4, name: "Check Point" },
  { id: 5, name: "Juniper" },
  { id: 6, name: "Sophos" },
]

export const mockVpnVendors: BaseVendor[] = [
  { id: 1, name: "Cisco AnyConnect" },
  { id: 2, name: "Palo Alto GlobalProtect" },
  { id: 3, name: "FortiClient" },
  { id: 4, name: "OpenVPN" },
  { id: 5, name: "Zscaler" },
  { id: 6, name: "NetMotion" },
]

export const mockEdrXdrVendors: BaseVendor[] = [
  { id: 1, name: "CrowdStrike Falcon" },
  { id: 2, name: "Microsoft Defender for Endpoint" },
  { id: 3, name: "SentinelOne" },
  { id: 4, name: "Palo Alto Cortex XDR" },
  { id: 5, name: "Trend Micro" },
  { id: 6, name: "Cybereason" },
]

export const mockSiemVendors: BaseVendor[] = [
  { id: 1, name: "Splunk" },
  { id: 2, name: "Microsoft Sentinel" },
  { id: 3, name: "IBM QRadar" },
  { id: 4, name: "LogRhythm" },
  { id: 5, name: "Exabeam" },
  { id: 6, name: "Securonix" },
]

export const mockDeviceTypes: DeviceType[] = [
  { id: 1, name: "Windows", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "macOS", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "iOS", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Android", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Linux", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 6, name: "Surveillance Camera", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 7, name: "IP Phone", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 8, name: "Printer", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 9, name: "Scanner", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 10, name: "HVAC Controller", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 11, name: "Badge Reader", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 12, name: "Industrial Sensor", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const mockChecklistItems: ChecklistItem[] = [
  { id: 1, name: "Microsoft Intune", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "VMware Workspace ONE", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Jamf Pro", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Kandji", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 5, name: "MaaS360", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 6, name: "ManageEngine", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 7, name: "NinjaOne", category: "MDM/UEM", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 8, name: "Okta", category: "SSO/MFA", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 9, name: "Microsoft Entra ID", category: "SSO/MFA", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 10, name: "Ping Identity", category: "SSO/MFA", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 11, name: "Duo Security", category: "SSO/MFA", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  {
    id: 12,
    name: "AD Broker Deployed",
    category: "Infrastructure",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 13,
    name: "Local RADIUS (Container)",
    category: "Infrastructure",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 14,
    name: "Local RADIUS (VM)",
    category: "Infrastructure",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 15,
    name: "TACACS+ Deployed",
    category: "Infrastructure",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  { id: 16, name: "ZTNA (SaaS)", category: "Infrastructure", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const mockSites: Site[] = [
  {
    id: "HQ001",
    name: "Global Headquarters",
    region: "North America",
    country: "United States",
    priority: "High",
    phase: 1,
    users_count: 2500,
    project_manager_id: 1,
    radsec: "Native",
    planned_start: "2025-08-01",
    planned_end: "2025-08-15",
    status: "In Progress",
    completion_percent: 35,
    notes: "Executive network needs priority handling.",
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-15T00:00:00Z",
    technical_owners: [mockUsers[2]],
    vendors: [mockWiredVendors[0], mockWirelessVendors[0]],
    firewall_vendors: [mockFirewallVendors[0]],
    vpn_vendors: [mockVpnVendors[1]],
    edr_xdr_vendors: [mockEdrXdrVendors[1]],
    siem_vendors: [mockSiemVendors[1]],
    device_types: [mockDeviceTypes[0], mockDeviceTypes[1]],
    deployment_type: "hybrid",
    auth_methods: ["EAP-TLS", "SAML"],
    os_details: { windows: true, macos: true, ios: true, android: false, linux: false },
    checklist_items: [
      { ...mockChecklistItems[0], completed: true },
      { ...mockChecklistItems[8], completed: true },
    ],
  },
  {
    id: "EUR003",
    name: "European HQ",
    region: "EMEA",
    country: "Germany",
    priority: "Medium",
    phase: 2,
    users_count: 1200,
    project_manager_id: 2,
    radsec: "LRAD",
    planned_start: "2025-09-01",
    planned_end: "2025-09-15",
    status: "Planned",
    completion_percent: 0,
    notes: "GDPR compliance required.",
    created_at: "2025-07-02T00:00:00Z",
    updated_at: "2025-07-02T00:00:00Z",
    technical_owners: [mockUsers[3]],
    vendors: [mockWiredVendors[1], mockWirelessVendors[1]],
    firewall_vendors: [mockFirewallVendors[1]],
    vpn_vendors: [mockVpnVendors[2]],
    edr_xdr_vendors: [mockEdrXdrVendors[2]],
    siem_vendors: [mockSiemVendors[2]],
    device_types: [mockDeviceTypes[0], mockDeviceTypes[3]],
    deployment_type: "wired",
    auth_methods: ["EAP-TLS"],
    os_details: { windows: true, macos: false, ios: false, android: true, linux: false },
    checklist_items: [],
  },
]

export const mockCountries = [
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "Mexico", code: "MX" },
  { name: "United Kingdom", code: "GB" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "India", code: "IN" },
  { name: "Brazil", code: "BR" },
  { name: "Australia", code: "AU" },
  // Add more countries as needed
]
