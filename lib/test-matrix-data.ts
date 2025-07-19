export interface TestMatrixEntry {
  platform: string
  mode: string
  type: string
  configurationPortnoxCloud: string
  configurationCalixNAS: string
  configurationIntuneJamf: string
  dot1xConnectionTest: string
  manualBlockByAdmin: string
  aclTest: string
  riskAssessmentPolicyTest: string
  remediationPolicyTest: string
  notes: string
  detectRisk: string
  blockAction: string
  remark: string
}

export const testMatrixData: TestMatrixEntry[] = [
  {
    platform: "MacOS",
    mode: "Agentless(SCEP+Jamf)",
    type: "Wired",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Passed",
    manualBlockByAdmin: "Block only if re-connect[WIP]Portnox is investigating",
    aclTest: "Passed",
    riskAssessmentPolicyTest: "Passed",
    remediationPolicyTest: "Failed[WIP]Portnox is investigating",
    notes: "Aruba NAS use Local Radius/ Portnox Cloud Radius server",
    detectRisk: "All risk attributes",
    blockAction: "N/A",
    remark: "Not Start",
  },
  {
    platform: "MacOS",
    mode: "Agentless(SCEP+Jamf)",
    type: "Wireless - NAC",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Passed",
    manualBlockByAdmin: "Block only if re-connect[WIP]Portnox is investigating",
    aclTest: "Failed[WIP]Portnox is investigating",
    riskAssessmentPolicyTest: "Failed[WIP]Portnox is investigating",
    remediationPolicyTest: "Failed[WIP]Portnox is investigating",
    notes: "Cisco switch is connected to Local Radius(Docker) 192.168.32.96",
    detectRisk: "All risk attributes",
    blockAction: "N/A",
    remark: "Not Start",
  },
  {
    platform: "MacOS",
    mode: "AgentP + Jamf",
    type: "Wired",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Failed to deploy the AgentP[WIP] Jamf Case#CS1303012",
    manualBlockByAdmin: "Not Start",
    aclTest: "Not Start",
    riskAssessmentPolicyTest: "Not Start",
    remediationPolicyTest: "Not Start",
    notes: "",
    detectRisk: "All risk attributes",
    blockAction: "Not Start",
    remark: "Not Start",
  },
  {
    platform: "Windows",
    mode: "Agentless (SCEP + Intune)",
    type: "Wired",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Passed",
    manualBlockByAdmin: "Block only if re-connect[WIP]Portnox is investigating",
    aclTest: "Passed",
    riskAssessmentPolicyTest: "Passed",
    remediationPolicyTest: "Passed",
    notes:
      "1. China users' machine need to turn off proxy script during the deployment.2. Real time block requires CoA (Local redius Docker version only)",
    detectRisk: "Limited risk attributes",
    blockAction: "Block only if re-connect[WIP]Portnox is investigating",
    remark: "N/A",
  },
  {
    platform: "Windows",
    mode: "AgentP + Intune",
    type: "Wired",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Passed",
    manualBlockByAdmin: "Block only if re-connect[WIP]Portnox is investigating",
    aclTest: "Passed",
    riskAssessmentPolicyTest: "Passed",
    remediationPolicyTest: "Risk attributes identifyRisk block level",
    notes: "",
    detectRisk: "All risk attributes",
    blockAction: "Block only if re-connect[WIP]Portnox is investigating",
    remark: "Not Start",
  },
  {
    platform: "iOS(iPhone & iPad)",
    mode: "Agentless (SCEP + Intune + iOS)",
    type: "Wireless",
    configurationPortnoxCloud: "Completed",
    configurationCalixNAS: "Completed",
    configurationIntuneJamf: "Completed",
    dot1xConnectionTest: "Passed",
    manualBlockByAdmin: "Block only if re-connect[WIP]Portnox is investigating",
    aclTest: "Failed[WIP]Portnox is investigating",
    riskAssessmentPolicyTest: "Failed[WIP]Portnox is investigating",
    remediationPolicyTest: "In Progress",
    notes: "SCEP cert has been deployed, but not found SSID - NAC, will open intune case",
    detectRisk: "Limited risk attributes",
    blockAction: "Not Start",
    remark: "N/A",
  },
]

export interface UseCaseData {
  id: string
  title: string
  description: string
  requirementIds: string[]
  pocScope: string
  testCaseId?: string
  comments: string
  portnoxChecklist: boolean
  portnoxPocNotes: string
}

export const useCasesData: UseCaseData[] = [
  {
    id: "UC1",
    title: "CA-MDM-SOE Certificate deployment and lifecycle management",
    description:
      "Demonstrate Portnox NAC's built-in certificate authority (CA) to issue, manage, and revoke certificates for Entra ID users and Intune managed endpoints (Win 11)",
    requirementIds: ["FR-03", "NFR-06"],
    pocScope: "Mandatory",
    comments: "",
    portnoxChecklist: false,
    portnoxPocNotes: "",
  },
  {
    id: "UC2.1",
    title: "Corp Wifi Auth user certs",
    description:
      "Demonstrate Portnox NAC's with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued user certificates can connect to the corporate SSID.",
    requirementIds: ["FR-01", "FR-02", "FR-03", "NFR-08"],
    pocScope: "Mandatory",
    comments: "need to test machine cert need to test user cert",
    portnoxChecklist: true,
    portnoxPocNotes: "",
  },
  {
    id: "UC2.2",
    title: "Corp Wifi Auth machine certs",
    description:
      "Demonstrate Portnox NAC's with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued machine certificates can connect to the corporate SSID.",
    requirementIds: ["FR-01", "FR-02", "FR-03", "NFR-08"],
    pocScope: "Mandatory",
    comments: "need to test machine cert need to test user cert",
    portnoxChecklist: true,
    portnoxPocNotes: "",
  },
  {
    id: "UC16",
    title: "Radius Server/proxy",
    description:
      "verify HA and caching capabilities of radius server and verify secure communications from local radius to cloud instance TLS",
    requirementIds: ["FR-02", "NFR-02", "NFR-05"],
    pocScope: "Mandatory",
    comments: "",
    portnoxChecklist: true,
    portnoxPocNotes: "",
  },
]

export interface RequirementData {
  id: string
  description: string
  justification: string
  metStatus: string
}

export const requirementsData: RequirementData[] = [
  {
    id: "FR-01",
    description: "Support 802.1X authentication for wired and wireless access",
    justification: "Ensures authenticated network access for corporate-managed devices",
    metStatus: "Met",
  },
  {
    id: "FR-02",
    description: "Provide RADIUS server functionality with RADSec support",
    justification: "Enables secure, cloud-based authentication and integration with Meraki",
    metStatus: "Met",
  },
  {
    id: "FR-03",
    description: "Issue and manage client certificates for users and/or devices",
    justification: "Enables secure, certificate-based device identification and trust",
    metStatus: "Met",
  },
  {
    id: "FR-04",
    description: "Certificate solution must support SCEP and Intune MDM",
    justification: "Intune will be used to configure the client certificate profiles and authentication profiles",
    metStatus: "Met",
  },
  {
    id: "FR-13",
    description: "Identify and block rogue hubs, switches, and wireless APs connecting to switch ports",
    justification:
      "Device profiling should achieve this along with port settings limiting number of MAC addresses per port",
    metStatus: "Met",
  },
]
