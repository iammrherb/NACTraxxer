import type {
  Site,
  User,
  Notification,
  Milestone,
  LibraryItem,
  Vendor,
  Region,
  DeviceType,
  UseCase,
  TestCase,
  Requirement,
} from "./types"

export const mockCountries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
]

export const initialRegions: Region[] = [
  { name: "North America" },
  { name: "Europe" },
  { name: "Asia-Pacific (APAC)" },
  { name: "Latin America (LATAM)" },
  { name: "Middle East & Africa (MEA)" },
]

export const idpVendors: Vendor[] = [
  { id: 1, name: "Okta" },
  { id: 2, name: "Azure AD" },
  { id: 3, name: "Ping Identity" },
]

export const mfaVendors: Vendor[] = [
  { id: 1, name: "Okta Verify" },
  { id: 2, name: "Microsoft Authenticator" },
  { id: 3, name: "Duo Push" },
]

export const edrVendors: Vendor[] = [
  { id: 1, name: "CrowdStrike" },
  { id: 2, name: "SentinelOne" },
  { id: 3, name: "Microsoft Defender" },
]

export const siemVendors: Vendor[] = [
  { id: 1, name: "Splunk" },
  { id: 2, name: "Microsoft Sentinel" },
  { id: 3, name: "LogRhythm" },
]

export const wiredVendors: Vendor[] = [
  { id: 1, name: "Cisco" },
  { id: 2, name: "Aruba" },
  { id: 3, name: "Juniper" },
]

export const wirelessVendors: Vendor[] = [
  { id: 1, name: "Cisco Meraki" },
  { id: 2, name: "Aruba" },
  { id: 3, name: "Mist (Juniper)" },
]

export const firewallVendors: Vendor[] = [
  { id: 1, name: "Palo Alto Networks" },
  { id: 2, name: "Fortinet" },
  { id: 3, name: "Cisco ASA/FTD" },
]

export const vpnVendors: Vendor[] = [
  { id: 1, name: "Palo Alto GlobalProtect" },
  { id: 2, name: "Cisco AnyConnect" },
  { id: 3, name: "FortiClient" },
]

export const mdmVendors: Vendor[] = [
  { id: 1, name: "Microsoft Intune" },
  { id: 2, name: "VMware Workspace ONE" },
  { id: 3, name: "Jamf" },
]

export const deviceTypes: DeviceType[] = [
  { id: 1, name: "Windows Desktop" },
  { id: 2, name: "macOS Laptop" },
  { id: 3, name: "iOS Device" },
  { id: 4, name: "Android Device" },
  { id: 5, name: "VoIP Phone" },
  { id: 6, name: "Printer" },
  { id: 7, name: "IoT Sensor" },
]

export const checklistItems: LibraryItem[] = [
  { id: "p1-1", category: "Planning", title: "Define Project Scope", description: "...", content: "..." },
]

export const mockSites: Site[] = [
  {
    id: "acme-corp-ny",
    name: "ACME Corp - New York",
    customer: "ACME Corporation",
    region: "North America",
    country: "United States",
    status: "In Progress",
    projectManager: {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Project Manager",
      avatar: "/placeholder-user.jpg",
    },
    technicalOwners: [
      {
        id: 2,
        name: "Bob Williams",
        email: "bob@example.com",
        role: "Engineer",
        avatar: "/placeholder-user.jpg",
      },
    ],
    wiredVendors: ["Cisco"],
    wirelessVendors: ["Cisco Meraki"],
    deviceTypes: ["Corporate Laptops", "Smartphones", "VoIP Phones"],
    radsec: "Native",
    plannedStart: "2024-08-01",
    plannedEnd: "2024-09-30",
    completionPercent: 45,
    deploymentChecklist: [],
    notes: "",
    useCaseIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    users_count: 100,
    phase: "Deployment",
    priority: "High",
    project_manager_name: "Alice Johnson",
    checklist_item_ids: [],
  },
]

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Project Manager",
    avatar: "/placeholder-user.jpg",
  },
  { id: 2, name: "Bob Williams", email: "bob@example.com", role: "Engineer", avatar: "/placeholder-user.jpg" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Admin", avatar: "/placeholder-user.jpg" },
]

export const notifications: Notification[] = [
  {
    id: "n-1",
    message: "ACME Corp - New York project is now In Progress.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info",
  },
]

export const milestones: Milestone[] = [
  { id: "m-1", title: "Project Kick-off", date: "2024-08-01", description: "Initial meeting with all stakeholders." },
]

export const useCases: UseCase[] = [
  { id: 1, category: "Access Control", title: "Secure Guest Access", priority: "High", is_custom: false },
  { id: 2, category: "Compliance", title: "Device Posture Check", priority: "High", is_custom: false },
]

export const testCases: TestCase[] = [
  {
    id: 1,
    name: "Guest connects to Wi-Fi",
    expected_outcome: "Guest is redirected to captive portal.",
    is_custom: false,
  },
]

export const requirements: Requirement[] = [
  {
    id: 1,
    description: "The system must support RADIUS.",
    is_custom: false,
  },
]
