import type {
  Site,
  User,
  Vendor,
  DeviceType,
  ChecklistItem,
  BaseVendor,
  UseCase,
  TestMatrixEntry,
  Requirement,
  TestCase,
  Task,
} from "./database"

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

export const initialRegions = ["North America", "EMEA", "APAC", "LATAM", "Africa"]

export const mockCountries = [
  { name: "United States", code: "US", region: "North America" },
  { name: "Canada", code: "CA", region: "North America" },
  { name: "Mexico", code: "MX", region: "North America" },
  { name: "United Kingdom", code: "GB", region: "EMEA" },
  { name: "Germany", code: "DE", region: "EMEA" },
  { name: "France", code: "FR", region: "EMEA" },
  { name: "South Africa", code: "ZA", region: "Africa" },
  { name: "Nigeria", code: "NG", region: "Africa" },
  { name: "Japan", code: "JP", region: "APAC" },
  { name: "China", code: "CN", region: "APAC" },
  { name: "India", code: "IN", region: "APAC" },
  { name: "Australia", code: "AU", region: "APAC" },
  { name: "Brazil", code: "BR", region: "LATAM" },
  { name: "Argentina", code: "AR", region: "LATAM" },
]

export const initialWiredVendors: Vendor[] = [
  { id: 1, name: "Cisco", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Juniper", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Arista", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 4, name: "HPE/Aruba", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Extreme Networks", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 6, name: "Dell", type: "wired", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const initialWirelessVendors: Vendor[] = [
  { id: 14, name: "Cisco/Meraki", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 15, name: "HPE/Aruba", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 16, name: "Ubiquiti", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 17, name: "Ruckus (CommScope)", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 18, name: "Juniper Mist", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 19, name: "Extreme Networks", type: "wireless", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const initialFirewallVendors: BaseVendor[] = [
  { id: 1, name: "Palo Alto Networks" },
  { id: 2, name: "Fortinet" },
  { id: 3, name: "Cisco" },
  { id: 4, name: "Check Point" },
  { id: 5, name: "Juniper" },
  { id: 6, name: "Sophos" },
]

export const initialVpnVendors: BaseVendor[] = [
  { id: 1, name: "Cisco AnyConnect" },
  { id: 2, name: "Palo Alto GlobalProtect" },
  { id: 3, name: "FortiClient" },
  { id: 4, name: "OpenVPN" },
  { id: 5, name: "Zscaler" },
  { id: 6, name: "NetMotion" },
]

export const initialEdrXdrVendors: BaseVendor[] = [
  { id: 1, name: "CrowdStrike Falcon" },
  { id: 2, name: "Microsoft Defender for Endpoint" },
  { id: 3, name: "SentinelOne" },
  { id: 4, name: "Palo Alto Cortex XDR" },
  { id: 5, name: "Trend Micro" },
  { id: 6, name: "Cybereason" },
]

export const initialSiemVendors: BaseVendor[] = [
  { id: 1, name: "Splunk" },
  { id: 2, name: "Microsoft Sentinel" },
  { id: 3, name: "IBM QRadar" },
  { id: 4, name: "LogRhythm" },
  { id: 5, name: "Exabeam" },
  { id: 6, name: "Securonix" },
]

export const initialIdpVendors: BaseVendor[] = [
  { id: 1, name: "Microsoft Entra ID" },
  { id: 2, name: "Okta" },
  { id: 3, name: "Ping Identity" },
  { id: 4, name: "Google Workspace" },
  { id: 5, name: "OneLogin" },
]

export const initialMfaVendors: BaseVendor[] = [
  { id: 1, name: "Duo Security" },
  { id: 2, name: "Microsoft Authenticator" },
  { id: 3, name: "Okta Verify" },
  { id: 4, name: "Google Authenticator" },
]

export const initialDeviceTypes: DeviceType[] = [
  { id: 1, name: "Windows", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "macOS", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "iOS", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Android", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Linux", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 6, name: "Surveillance Camera", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 7, name: "IP Phone", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  { id: 8, name: "Printer", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
]

export const initialChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    name: "Microsoft Intune",
    category: "MDM/UEM",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  { id: 8, name: "Okta", category: "SSO/MFA", is_custom: false, created_at: "2025-01-01T00:00:00Z" },
  {
    id: 12,
    name: "AD Broker Deployed",
    category: "Infrastructure",
    is_custom: false,
    created_at: "2025-01-01T00:00:00Z",
  },
]

export const initialRequirements: Requirement[] = [
  {
    id: "REQ-01",
    description: "Corporate devices must use certificate-based authentication (EAP-TLS).",
    justification: "Ensures only managed and trusted devices can connect.",
    is_custom: false,
  },
  {
    id: "REQ-02",
    description: "Guest network must be isolated from the corporate network.",
    justification: "Prevents unauthorized access to internal resources from guest devices.",
    is_custom: false,
  },
  {
    id: "REQ-03",
    description: "IoT devices must be placed in a segmented VLAN.",
    justification: "Limits the attack surface of potentially vulnerable IoT devices.",
    is_custom: false,
  },
]

export const initialTestCases: TestCase[] = [
  {
    id: "TC-01",
    name: "Deploy machine certificate to managed endpoint",
    description: "Part of End User Compute (EUC) end point enrolment process when onboarding a new device.",
    expected_outcome: "Endpoint enrolment connecting to guest/default network",
    is_custom: false,
  },
  {
    id: "TC-02",
    name: "Deploy user certificate to managed endpoint",
    description:
      "Initial connection is to guest/default network to allow user logon to obtain a valid user certificate.",
    expected_outcome: "Endpoint connects to correct network based on user profile",
    is_custom: false,
  },
  {
    id: "TC-03",
    name: "Expired/Revoked computer certificate",
    description: "Revoked machine cert or deployment a short term machine Cert to test expired cert.",
    expected_outcome: "Endpoint will be placed in the guest/default network.",
    is_custom: false,
  },
]

export const initialUseCases: UseCase[] = [
  {
    id: "UC-01",
    title: "Wired 802.1X for Corporate Windows Devices",
    description:
      "Ensure only corporate-managed Windows devices, authenticated via EAP-TLS with certificates from Intune, can access the wired network.",
    category: "Wired Access",
    priority: "mandatory",
    is_baseline: true,
    is_custom: false,
    applicable_industries: ["All"],
    applicable_goals: ["Zero Trust", "Device Compliance"],
    requirement_ids: ["REQ-01"],
    test_case_ids: ["TC-01", "TC-02", "TC-03"],
  },
  {
    id: "UC-02",
    title: "Guest Wireless Access",
    description: "Provide time-limited, isolated internet access for guest users via a captive portal.",
    category: "Wireless Access",
    priority: "optional",
    is_baseline: true,
    is_custom: false,
    applicable_industries: ["All"],
    applicable_goals: ["Guest Access"],
    requirement_ids: ["REQ-02"],
    test_case_ids: [],
  },
  {
    id: "UC-03",
    title: "IoT Device Onboarding and Segmentation",
    description:
      "Onboard IoT devices (cameras, printers) using MAC authentication (MAB) and place them into a segmented, least-privilege network VLAN.",
    category: "IoT/OT Security",
    priority: "mandatory",
    is_baseline: false,
    is_custom: false,
    applicable_industries: ["Healthcare", "Manufacturing", "Corporate"],
    applicable_goals: ["IoT Security"],
    requirement_ids: ["REQ-03"],
    test_case_ids: [],
  },
]

export const initialTestMatrix: TestMatrixEntry[] = [
  {
    id: "TM-01",
    platform: "MacOS",
    mode: "Agentless(SCEP+Jamf)",
    type: "Wired",
    config_portnox_cloud: "Completed",
    config_nas: "Completed",
    config_mdm: "Completed",
    test_8021x: "Passed",
    test_manual_block: "Block only if re-connect[WIP]Portnox is investigating",
    test_acl: "Passed",
    test_risk_assessment: "Passed",
    test_remediation: "Failed[WIP]Portnox is investigating",
    notes: "Aruba NAS use Local Radius/ Portnox Cloud Radius server",
    is_custom: false,
  },
  {
    id: "TM-02",
    platform: "Windows",
    mode: "Agentless (SCEP + Intune)",
    type: "Wired",
    config_portnox_cloud: "Completed",
    config_nas: "Completed",
    config_mdm: "Completed",
    test_8021x: "Passed",
    test_manual_block: "Block only if re-connect[WIP]Portnox is investigating",
    test_acl: "Passed",
    test_risk_assessment: "Passed",
    test_remediation: "Passed",
    notes:
      "1. China users' machine need to turn off proxy script during the deployment.2. Real time block requires CoA (Local redius Docker version only)",
    is_custom: false,
  },
]

export const initialTasks: Task[] = [
  {
    id: "TASK-01",
    title: "Project Kickoff Meeting",
    description: "Initial meeting with all stakeholders to define scope, goals, and timeline.",
    status: "To Do",
  },
  {
    id: "TASK-02",
    title: "Configure Cloud Tenant",
    description: "Set up the Portnox Cloud tenant, including basic settings and admin accounts.",
    status: "To Do",
  },
  {
    id: "TASK-03",
    title: "Integrate with Identity Provider",
    description: "Connect Portnox to the primary IdP (e.g., Entra ID, Okta) for user authentication.",
    status: "To Do",
  },
  {
    id: "TASK-04",
    title: "Deploy On-Premise Broker/RADIUS",
    description: "If required, deploy and configure the on-premise components (AD Broker, Local RADIUS).",
    status: "To Do",
  },
  {
    id: "TASK-05",
    title: "Configure Network Access Policies",
    description: "Define authentication, authorization, and risk policies in Portnox Cloud.",
    status: "To Do",
  },
  {
    id: "TASK-06",
    title: "Pilot Group Testing",
    description: "Onboard a pilot group of users/devices to test the defined policies and use cases.",
    status: "To Do",
  },
  {
    id: "TASK-07",
    title: "User Acceptance Testing (UAT)",
    description: "Conduct formal UAT with business users and gather feedback.",
    status: "To Do",
  },
  {
    id: "TASK-08",
    title: "Production Rollout",
    description: "Begin phased rollout to all users and sites.",
    status: "To Do",
  },
]

export let mockSites: Site[] = [
  {
    id: "HQ001",
    name: "Global Headquarters",
    industry: "Technology",
    project_goals: ["Zero Trust", "Device Compliance"],
    legacy_nac_systems: [{ name: "Cisco ISE", migration_timeline_months: 6 }],
    region: "North America",
    country: "United States",
    priority: "High",
    phase: 1,
    users_count: 2500,
    project_manager_id: 1,
    radsec: "Native",
    planned_start: "2025-08-01",
    planned_end: "2025-10-31",
    status: "In Progress",
    completion_percent: 35,
    notes: "Executive network needs priority handling.",
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-15T00:00:00Z",
    technical_owner_ids: [7],
    vendor_ids: [1, 14],
    firewall_vendor_ids: [1],
    vpn_vendor_ids: [2],
    edr_xdr_vendor_ids: [2],
    siem_vendor_ids: [2],
    idp_vendor_ids: [1],
    mfa_vendor_ids: [2],
    device_type_ids: [1, 2],
    checklist_item_ids: [1, 8],
    use_case_ids: ["UC-01", "UC-02"],
    tasks: [
      { id: "T-1", title: "Project Kickoff Meeting", description: "", status: "Done" },
      { id: "T-2", title: "Configure Cloud Tenant", description: "", status: "In Progress" },
    ],
    test_case_statuses: [{ test_case_id: "TC-01", status: "passed" }],
    requirement_statuses: [{ requirement_id: "REQ-01", status: "met" }],
  },
  {
    id: "EUR003",
    name: "European HQ",
    industry: "Finance",
    project_goals: ["Guest Access"],
    legacy_nac_systems: [],
    region: "EMEA",
    country: "Germany",
    priority: "Medium",
    phase: 2,
    users_count: 1200,
    project_manager_id: 2,
    radsec: "LRAD",
    planned_start: "2025-09-01",
    planned_end: "2025-11-30",
    status: "Planned",
    completion_percent: 0,
    notes: "GDPR compliance required.",
    created_at: "2025-07-02T00:00:00Z",
    updated_at: "2025-07-02T00:00:00Z",
    technical_owner_ids: [8],
    vendor_ids: [2, 15],
    firewall_vendor_ids: [2],
    vpn_vendor_ids: [3],
    edr_xdr_vendor_ids: [3],
    siem_vendor_ids: [3],
    idp_vendor_ids: [2],
    mfa_vendor_ids: [3],
    device_type_ids: [1, 4],
    checklist_item_ids: [],
    use_case_ids: ["UC-02"],
    tasks: [],
    test_case_statuses: [],
    requirement_statuses: [],
  },
]

// Functions to manipulate the data for the session
export const clearSites = () => {
  mockSites.length = 0
}

export const loadSampleSites = () => {
  // This is a simplified way to reset. In a real app, you'd deep copy.
  mockSites = [
    {
      id: "HQ001",
      name: "Global Headquarters",
      industry: "Technology",
      project_goals: ["Zero Trust", "Device Compliance"],
      legacy_nac_systems: [{ name: "Cisco ISE", migration_timeline_months: 6 }],
      region: "North America",
      country: "United States",
      priority: "High",
      phase: 1,
      users_count: 2500,
      project_manager_id: 1,
      radsec: "Native",
      planned_start: "2025-08-01",
      planned_end: "2025-10-31",
      status: "In Progress",
      completion_percent: 35,
      notes: "Executive network needs priority handling.",
      created_at: "2025-07-01T00:00:00Z",
      updated_at: "2025-07-15T00:00:00Z",
      technical_owner_ids: [7],
      vendor_ids: [1, 14],
      firewall_vendor_ids: [1],
      vpn_vendor_ids: [2],
      edr_xdr_vendor_ids: [2],
      siem_vendor_ids: [2],
      idp_vendor_ids: [1],
      mfa_vendor_ids: [2],
      device_type_ids: [1, 2],
      checklist_item_ids: [1, 8],
      use_case_ids: ["UC-01", "UC-02"],
      tasks: [
        { id: "T-1", title: "Project Kickoff Meeting", description: "", status: "Done" },
        { id: "T-2", title: "Configure Cloud Tenant", description: "", status: "In Progress" },
      ],
      test_case_statuses: [{ test_case_id: "TC-01", status: "passed" }],
      requirement_statuses: [{ requirement_id: "REQ-01", status: "met" }],
    },
    {
      id: "EUR003",
      name: "European HQ",
      industry: "Finance",
      project_goals: ["Guest Access"],
      legacy_nac_systems: [],
      region: "EMEA",
      country: "Germany",
      priority: "Medium",
      phase: 2,
      users_count: 1200,
      project_manager_id: 2,
      radsec: "LRAD",
      planned_start: "2025-09-01",
      planned_end: "2025-11-30",
      status: "Planned",
      completion_percent: 0,
      notes: "GDPR compliance required.",
      created_at: "2025-07-02T00:00:00Z",
      updated_at: "2025-07-02T00:00:00Z",
      technical_owner_ids: [8],
      vendor_ids: [2, 15],
      firewall_vendor_ids: [2],
      vpn_vendor_ids: [3],
      edr_xdr_vendor_ids: [3],
      siem_vendor_ids: [3],
      idp_vendor_ids: [2],
      mfa_vendor_ids: [3],
      device_type_ids: [1, 4],
      checklist_item_ids: [],
      use_case_ids: ["UC-02"],
      tasks: [],
      test_case_statuses: [],
      requirement_statuses: [],
    },
  ]
}
