export interface IndustryScenario {
  id: string
  name: string
  description: string
  icon: string
  color: string
  sites: Array<{
    id: string
    name: string
    type: string
    location: string
    users: number
    devices: number
    infrastructure: {
      wired: { vendor: string; switches: number; model: string }
      wireless: { vendor: string; aps: number; model: string }
      firewall: { vendor: string; model: string }
    }
    compliance: string[]
    riskLevel: string
    specialRequirements?: string[]
  }>
  policies: Array<{
    id: string
    name: string
    category: string
    description: string
  }>
  users: Array<{
    id: string
    name: string
    email: string
    role: string
    department: string
  }>
  applications?: Array<{
    id: string
    name: string
    type: string
    category: string
    users: number
    criticality: string
    compliance: string[]
    authentication: string[]
    conditional_access_policies?: string[]
  }>
  ztna_scenarios?: Array<{
    id: string
    name: string
    description: string
    applications: string[]
    user_groups: string[]
    access_policies: string[]
  }>
}

export const INDUSTRY_SCENARIOS = {
  healthcare: {
    id: "healthcare",
    name: "Regional Healthcare System",
    industry: "healthcare",
    description: "Multi-facility healthcare system with HIPAA compliance requirements and medical device integration",
    userCount: 2500,
    siteCount: 5,
    budget: 1500000,
    timeline: "6 months",
    compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11"],
    specialties: [
      "Medical Device Security",
      "Patient Data Protection",
      "Compliance Automation",
      "Telemedicine Support",
    ],
    icon: "🏥",
    color: "bg-red-50 border-red-200",
    sites: [
      {
        id: "main-hospital",
        name: "Main Hospital Campus",
        type: "hospital",
        location: "New York, NY",
        users: 1200,
        devices: 2100,
        infrastructure: {
          wired: { vendor: "cisco", switches: 48, model: "Catalyst 9300" },
          wireless: { vendor: "aruba", aps: 120, model: "AP-635" },
          firewall: { vendor: "palo_alto", model: "PA-5220" },
        },
        compliance: ["hipaa", "hitech", "fda"],
        riskLevel: "critical",
        specialRequirements: ["Medical Device Network", "Patient Monitoring", "Emergency Systems"],
      },
      {
        id: "outpatient-clinic",
        name: "Outpatient Clinic",
        type: "clinic",
        location: "Brooklyn, NY",
        users: 300,
        devices: 520,
        infrastructure: {
          wired: { vendor: "cisco", switches: 12, model: "Catalyst 9200" },
          wireless: { vendor: "aruba", aps: 25, model: "AP-515" },
          firewall: { vendor: "fortinet", model: "FortiGate-200F" },
        },
        compliance: ["hipaa"],
        riskLevel: "high",
      },
      {
        id: "imaging-center",
        name: "Diagnostic Imaging Center",
        type: "imaging",
        location: "Manhattan, NY",
        users: 150,
        devices: 280,
        infrastructure: {
          wired: { vendor: "aruba", switches: 8, model: "CX 6200" },
          wireless: { vendor: "aruba", aps: 15, model: "AP-515" },
          firewall: { vendor: "checkpoint", model: "1570" },
        },
        compliance: ["hipaa", "dicom"],
        riskLevel: "high",
      },
    ],
    applications: [
      {
        id: "epic-ehr",
        name: "Epic Electronic Health Records",
        type: "on_premise",
        category: "clinical",
        users: 1800,
        criticality: "critical",
        compliance: ["hipaa", "hitech"],
        authentication: ["saml", "certificate"],
        network_requirements: ["low_latency", "high_availability"],
      },
      {
        id: "pacs-system",
        name: "PACS Medical Imaging",
        type: "on_premise",
        category: "imaging",
        users: 200,
        criticality: "high",
        compliance: ["hipaa", "dicom"],
        authentication: ["certificate", "mfa"],
      },
      {
        id: "office365-healthcare",
        name: "Microsoft 365 Healthcare",
        type: "saas",
        category: "productivity",
        users: 2500,
        criticality: "medium",
        compliance: ["hipaa"],
        authentication: ["azure_ad", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_for_admins",
          "block_legacy_auth",
          "require_compliant_device",
          "location_based_access",
        ],
      },
    ],
    ztna_scenarios: [
      {
        id: "clinical_access",
        name: "Clinical Application Access",
        description: "Secure access to clinical applications from any location",
        applications: ["epic-ehr", "pacs-system"],
        user_groups: ["physicians", "nurses", "clinical_staff"],
        access_policies: ["device_compliance_required", "mfa_required", "location_verification", "time_based_access"],
      },
      {
        id: "remote_consultation",
        name: "Remote Consultation Access",
        description: "Secure telemedicine and remote consultation capabilities",
        applications: ["telemedicine_platform", "patient_portal"],
        user_groups: ["physicians", "specialists"],
        access_policies: ["high_security_clearance", "encrypted_communications", "audit_logging"],
      },
    ],
  },

  financial: {
    id: "financial",
    name: "Global Investment Bank",
    industry: "financial services",
    description: "International banking institution with strict regulatory compliance and high-frequency trading",
    userCount: 1800,
    siteCount: 3,
    budget: 1200000,
    timeline: "4 months",
    compliance: ["PCI DSS", "SOX", "GDPR", "MiFID II", "FFIEC"],
    specialties: ["Trading Floor Security", "Fraud Detection", "Regulatory Compliance", "High-Frequency Trading"],
    icon: "🏦",
    color: "bg-green-50 border-green-200",
    sites: [
      {
        id: "trading-floor-ny",
        name: "Trading Floor - New York",
        type: "trading_floor",
        location: "New York, NY",
        users: 800,
        devices: 1400,
        infrastructure: {
          wired: { vendor: "cisco", switches: 36, model: "Nexus 9000" },
          wireless: { vendor: "cisco", aps: 60, model: "Catalyst 9136" },
          firewall: { vendor: "checkpoint", model: "15600" },
        },
        compliance: ["sox", "finra", "sec"],
        riskLevel: "critical",
        specialRequirements: ["Ultra-Low Latency", "Market Data Feeds", "Compliance Recording"],
      },
      {
        id: "corporate-hq",
        name: "Corporate Headquarters",
        type: "headquarters",
        location: "Chicago, IL",
        users: 600,
        devices: 1050,
        infrastructure: {
          wired: { vendor: "aruba", switches: 24, model: "CX 8360" },
          wireless: { vendor: "aruba", aps: 80, model: "AP-635" },
          firewall: { vendor: "palo_alto", model: "PA-7080" },
        },
        compliance: ["sox", "pci_dss"],
        riskLevel: "high",
      },
    ],
    applications: [
      {
        id: "trading-platform",
        name: "Proprietary Trading Platform",
        type: "on_premise",
        category: "trading",
        users: 400,
        criticality: "critical",
        compliance: ["sox", "finra"],
        authentication: ["certificate", "biometric"],
        network_requirements: ["ultra_low_latency", "dedicated_circuits"],
      },
      {
        id: "risk-management",
        name: "Risk Management System",
        type: "on_premise",
        category: "risk",
        users: 200,
        criticality: "critical",
        compliance: ["sox", "basel_iii"],
        authentication: ["smartcard", "mfa"],
      },
      {
        id: "salesforce-financial",
        name: "Salesforce Financial Services Cloud",
        type: "saas",
        category: "crm",
        users: 800,
        criticality: "high",
        compliance: ["sox"],
        authentication: ["saml", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_always",
          "trusted_locations_only",
          "compliant_device_required",
          "session_timeout_30min",
        ],
      },
      {
        id: "bloomberg-terminal",
        name: "Bloomberg Terminal Access",
        type: "saas",
        category: "market_data",
        users: 600,
        criticality: "critical",
        compliance: ["finra"],
        authentication: ["certificate", "biometric"],
      },
    ],
    ztna_scenarios: [
      {
        id: "trading_access",
        name: "Secure Trading Access",
        description: "Ultra-secure access to trading platforms with minimal latency",
        applications: ["trading-platform", "bloomberg-terminal"],
        user_groups: ["traders", "quants", "risk_managers"],
        access_policies: [
          "biometric_authentication",
          "dedicated_network_path",
          "real_time_monitoring",
          "transaction_logging",
        ],
      },
      {
        id: "remote_banking",
        name: "Remote Banking Operations",
        description: "Secure remote access for banking operations and customer service",
        applications: ["core-banking", "customer-portal"],
        user_groups: ["relationship_managers", "customer_service"],
        access_policies: ["multi_factor_auth", "geo_fencing", "session_recording", "data_loss_prevention"],
      },
    ],
  },

  manufacturing: {
    id: "manufacturing",
    name: "Advanced Manufacturing Corp",
    industry: "manufacturing",
    description: "Industrial manufacturing with OT/IT convergence and smart factory initiatives",
    userCount: 1200,
    siteCount: 4,
    budget: 900000,
    timeline: "5 months",
    compliance: ["IEC 62443", "NIST 800-82", "ISO 27001", "OSHA"],
    specialties: ["OT Security", "Industrial Control Systems", "Smart Factory", "Predictive Maintenance"],
    icon: "🏭",
    color: "bg-blue-50 border-blue-200",
    sites: [
      {
        id: "main-factory",
        name: "Main Production Facility",
        type: "factory",
        location: "Detroit, MI",
        users: 500,
        devices: 1200,
        infrastructure: {
          wired: { vendor: "cisco", switches: 28, model: "IE-3400" },
          wireless: { vendor: "cisco", aps: 65, model: "IW-6300H" },
          firewall: { vendor: "fortinet", model: "FortiGate-1500D" },
        },
        compliance: ["iec_62443", "nist_800_82"],
        riskLevel: "critical",
        specialRequirements: ["Industrial Ethernet", "SCADA Systems", "Safety Systems"],
      },
      {
        id: "warehouse-logistics",
        name: "Automated Warehouse",
        type: "warehouse",
        location: "Columbus, OH",
        users: 200,
        devices: 800,
        infrastructure: {
          wired: { vendor: "aruba", switches: 16, model: "CX 6300" },
          wireless: { vendor: "aruba", aps: 40, model: "AP-515" },
          firewall: { vendor: "palo_alto", model: "PA-3220" },
        },
        compliance: ["iec_62443"],
        riskLevel: "high",
      },
    ],
    applications: [
      {
        id: "mes-system",
        name: "Manufacturing Execution System",
        type: "on_premise",
        category: "manufacturing",
        users: 300,
        criticality: "critical",
        compliance: ["iec_62443"],
        authentication: ["certificate", "local_auth"],
        network_requirements: ["real_time", "deterministic"],
      },
      {
        id: "scada-hmi",
        name: "SCADA/HMI Systems",
        type: "on_premise",
        category: "control",
        users: 150,
        criticality: "critical",
        compliance: ["iec_62443", "nist_800_82"],
        authentication: ["local_auth", "role_based"],
      },
      {
        id: "sap-manufacturing",
        name: "SAP Manufacturing Cloud",
        type: "saas",
        category: "erp",
        users: 800,
        criticality: "high",
        compliance: ["iso_27001"],
        authentication: ["saml", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_for_finance",
          "block_personal_devices",
          "require_domain_joined",
          "manufacturing_hours_only",
        ],
      },
    ],
    ztna_scenarios: [
      {
        id: "ot_remote_access",
        name: "Secure OT Remote Access",
        description: "Controlled remote access to operational technology systems",
        applications: ["mes-system", "scada-hmi"],
        user_groups: ["ot_engineers", "maintenance_staff", "vendors"],
        access_policies: [
          "vendor_approval_required",
          "time_limited_access",
          "session_monitoring",
          "change_control_integration",
        ],
      },
      {
        id: "smart_factory_analytics",
        name: "Smart Factory Analytics Access",
        description: "Secure access to manufacturing analytics and IoT data",
        applications: ["analytics-platform", "iot-dashboard"],
        user_groups: ["data_scientists", "process_engineers"],
        access_policies: ["data_classification_aware", "read_only_access", "audit_trail_required"],
      },
    ],
  },

  technology: {
    id: "technology",
    name: "Cloud-Native Tech Startup",
    industry: "technology",
    description: "Fast-growing technology company with cloud-first architecture and global remote workforce",
    userCount: 800,
    siteCount: 2,
    budget: 600000,
    timeline: "3 months",
    compliance: ["SOC 2", "GDPR", "ISO 27001", "FedRAMP"],
    specialties: ["Cloud Security", "DevSecOps", "Zero Trust", "Remote Work Security"],
    icon: "💻",
    color: "bg-purple-50 border-purple-200",
    sites: [
      {
        id: "hq-silicon-valley",
        name: "Silicon Valley HQ",
        type: "headquarters",
        location: "San Francisco, CA",
        users: 500,
        devices: 1200,
        infrastructure: {
          wired: { vendor: "aruba", switches: 24, model: "CX 6400" },
          wireless: { vendor: "aruba", aps: 80, model: "AP-635" },
          firewall: { vendor: "palo_alto", model: "PA-5220" },
        },
        compliance: ["soc2", "iso_27001"],
        riskLevel: "medium",
        specialRequirements: ["High-Speed Internet", "Collaboration Spaces", "Secure Development"],
      },
      {
        id: "dev-center-austin",
        name: "Development Center Austin",
        type: "office",
        location: "Austin, TX",
        users: 300,
        devices: 720,
        infrastructure: {
          wired: { vendor: "cisco", switches: 16, model: "Catalyst 9300" },
          wireless: { vendor: "cisco", aps: 50, model: "Catalyst 9136" },
          firewall: { vendor: "fortinet", model: "FortiGate-600F" },
        },
        compliance: ["soc2"],
        riskLevel: "medium",
      },
    ],
    applications: [
      {
        id: "github-enterprise",
        name: "GitHub Enterprise",
        type: "saas",
        category: "development",
        users: 600,
        criticality: "critical",
        compliance: ["soc2"],
        authentication: ["saml", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_for_repos",
          "trusted_devices_only",
          "ip_whitelist_required",
          "session_timeout_8hours",
        ],
      },
      {
        id: "aws-console",
        name: "AWS Management Console",
        type: "saas",
        category: "cloud",
        users: 200,
        criticality: "critical",
        compliance: ["soc2", "fedramp"],
        authentication: ["saml", "mfa", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_always",
          "privileged_access_workstation",
          "just_in_time_access",
          "break_glass_procedures",
        ],
      },
      {
        id: "internal-tools",
        name: "Internal Development Tools",
        type: "on_premise",
        category: "development",
        users: 400,
        criticality: "high",
        compliance: ["soc2"],
        authentication: ["oidc", "certificate"],
      },
    ],
    ztna_scenarios: [
      {
        id: "developer_access",
        name: "Secure Developer Access",
        description: "Zero trust access to development environments and tools",
        applications: ["github-enterprise", "internal-tools", "ci-cd-pipeline"],
        user_groups: ["developers", "devops", "security_engineers"],
        access_policies: [
          "code_signing_required",
          "peer_review_mandatory",
          "security_scanning",
          "least_privilege_access",
        ],
      },
      {
        id: "cloud_admin_access",
        name: "Cloud Administration Access",
        description: "Highly secure access to cloud infrastructure and admin tools",
        applications: ["aws-console", "kubernetes-dashboard", "monitoring-tools"],
        user_groups: ["cloud_architects", "sre_team", "security_team"],
        access_policies: [
          "privileged_access_management",
          "just_in_time_elevation",
          "session_recording",
          "change_approval_required",
        ],
      },
    ],
  },

  retail: {
    id: "retail",
    name: "Omnichannel Retail Chain",
    industry: "retail",
    description: "Multi-location retail chain with e-commerce integration and customer data analytics",
    userCount: 1500,
    siteCount: 8,
    budget: 1000000,
    timeline: "4 months",
    compliance: ["PCI DSS", "CCPA", "GDPR", "SOX"],
    specialties: ["POS Security", "Customer Data Protection", "Omnichannel Integration", "Loss Prevention"],
    icon: "🛍️",
    color: "bg-yellow-50 border-yellow-200",
    sites: [
      {
        id: "flagship-manhattan",
        name: "Flagship Store Manhattan",
        type: "flagship",
        location: "New York, NY",
        users: 200,
        devices: 400,
        infrastructure: {
          wired: { vendor: "cisco", switches: 12, model: "Catalyst 9200" },
          wireless: { vendor: "aruba", aps: 30, model: "AP-515" },
          firewall: { vendor: "fortinet", model: "FortiGate-200F" },
        },
        compliance: ["pci_dss", "ccpa"],
        riskLevel: "high",
        specialRequirements: ["POS Systems", "Customer WiFi", "Digital Signage", "Security Cameras"],
      },
      {
        id: "distribution-center",
        name: "Distribution Center",
        type: "warehouse",
        location: "Newark, NJ",
        users: 300,
        devices: 600,
        infrastructure: {
          wired: { vendor: "aruba", switches: 20, model: "CX 6300" },
          wireless: { vendor: "aruba", aps: 60, model: "AP-515" },
          firewall: { vendor: "palo_alto", model: "PA-3220" },
        },
        compliance: ["pci_dss"],
        riskLevel: "medium",
      },
    ],
    applications: [
      {
        id: "pos-system",
        name: "Point of Sale System",
        type: "on_premise",
        category: "retail",
        users: 800,
        criticality: "critical",
        compliance: ["pci_dss"],
        authentication: ["local_auth", "pin"],
        network_requirements: ["isolated_network", "encrypted_communications"],
      },
      {
        id: "inventory-management",
        name: "Inventory Management System",
        type: "on_premise",
        category: "operations",
        users: 400,
        criticality: "high",
        compliance: ["sox"],
        authentication: ["ldap", "mfa"],
      },
      {
        id: "shopify-plus",
        name: "Shopify Plus E-commerce",
        type: "saas",
        category: "ecommerce",
        users: 150,
        criticality: "critical",
        compliance: ["pci_dss", "gdpr"],
        authentication: ["saml", "conditional_access"],
        conditional_access_policies: [
          "require_mfa_for_admin",
          "geo_blocking_enabled",
          "device_compliance_check",
          "fraud_detection_integration",
        ],
      },
    ],
    ztna_scenarios: [
      {
        id: "store_operations",
        name: "Store Operations Access",
        description: "Secure access to retail operations and POS systems",
        applications: ["pos-system", "inventory-management"],
        user_groups: ["store_managers", "cashiers", "inventory_staff"],
        access_policies: [
          "location_based_access",
          "shift_based_permissions",
          "transaction_monitoring",
          "loss_prevention_integration",
        ],
      },
      {
        id: "ecommerce_management",
        name: "E-commerce Platform Access",
        description: "Secure access to online retail platforms and customer data",
        applications: ["shopify-plus", "customer-analytics"],
        user_groups: ["ecommerce_team", "marketing", "customer_service"],
        access_policies: [
          "customer_data_protection",
          "gdpr_compliance_check",
          "marketing_permissions",
          "audit_trail_required",
        ],
      },
    ],
  },

  education: {
    id: "education",
    name: "State University System",
    industry: "education",
    description: "Large university campus with research facilities, student housing, and administrative buildings",
    userCount: 25000,
    siteCount: 6,
    budget: 1800000,
    timeline: "8 months",
    compliance: ["FERPA", "CIPA", "FISMA", "HIPAA"],
    specialties: ["Student Privacy", "Research Security", "BYOD Management", "Campus Safety"],
    icon: "🎓",
    color: "bg-indigo-50 border-indigo-200",
    sites: [
      {
        id: "main-campus",
        name: "Main Campus",
        type: "campus",
        location: "Boston, MA",
        users: 15000,
        devices: 30000,
        infrastructure: {
          wired: { vendor: "cisco", switches: 200, model: "Catalyst 9300" },
          wireless: { vendor: "aruba", aps: 800, model: "AP-635" },
          firewall: { vendor: "palo_alto", model: "PA-7080" },
        },
        compliance: ["ferpa", "cipa"],
        riskLevel: "medium",
        specialRequirements: ["Student Network", "Research Network", "Administrative Network", "Guest Access"],
      },
      {
        id: "medical-school",
        name: "Medical School Campus",
        type: "medical",
        location: "Boston, MA",
        users: 2000,
        devices: 3500,
        infrastructure: {
          wired: { vendor: "aruba", switches: 40, model: "CX 8360" },
          wireless: { vendor: "aruba", aps: 120, model: "AP-635" },
          firewall: { vendor: "checkpoint", model: "15600" },
        },
        compliance: ["ferpa", "hipaa"],
        riskLevel: "high",
      },
    ],
    applications: [
      {
        id: "student-information-system",
        name: "Student Information System",
        type: "on_premise",
        category: "academic",
        users: 5000,
        criticality: "critical",
        compliance: ["ferpa"],
        authentication: ["saml", "mfa"],
        network_requirements: ["high_availability", "data_encryption"],
      },
      {
        id: "research-computing",
        name: "Research Computing Platform",
        type: "on_premise",
        category: "research",
        users: 1500,
        criticality: "high",
        compliance: ["fisma", "export_control"],
        authentication: ["certificate", "kerberos"],
      },
      {
        id: "canvas-lms",
        name: "Canvas Learning Management System",
        type: "saas",
        category: "education",
        users: 20000,
        criticality: "high",
        compliance: ["ferpa", "ada"],
        authentication: ["saml", "conditional_access"],
        conditional_access_policies: [
          "student_device_registration",
          "academic_calendar_access",
          "proctoring_integration",
          "accessibility_compliance",
        ],
      },
    ],
    ztna_scenarios: [
      {
        id: "student_access",
        name: "Student Academic Access",
        description: "Secure access to academic resources and student services",
        applications: ["canvas-lms", "student-information-system", "library-resources"],
        user_groups: ["students", "faculty", "staff"],
        access_policies: [
          "enrollment_verification",
          "academic_standing_check",
          "device_registration_required",
          "acceptable_use_agreement",
        ],
      },
      {
        id: "research_access",
        name: "Research Data Access",
        description: "Controlled access to sensitive research data and computing resources",
        applications: ["research-computing", "data-repositories"],
        user_groups: ["researchers", "graduate_students", "postdocs"],
        access_policies: [
          "research_ethics_clearance",
          "data_classification_aware",
          "export_control_compliance",
          "collaboration_controls",
        ],
      },
    ],
  },

  government: {
    id: "government",
    name: "Federal Agency",
    industry: "government",
    description: "Federal government agency with classified and unclassified networks",
    userCount: 2000,
    siteCount: 3,
    budget: 2500000,
    timeline: "12 months",
    compliance: ["FISMA", "NIST 800-53", "FedRAMP", "CJIS"],
    specialties: ["Classified Security", "FISMA Compliance", "Continuous Monitoring", "Insider Threat"],
    icon: "🏛️",
    color: "bg-gray-50 border-gray-200",
    sites: [
      {
        id: "headquarters-dc",
        name: "Headquarters - Washington DC",
        type: "headquarters",
        location: "Washington, DC",
        users: 1200,
        devices: 2000,
        infrastructure: {
          wired: { vendor: "cisco", switches: 60, model: "Catalyst 9400" },
          wireless: { vendor: "cisco", aps: 150, model: "Catalyst 9136" },
          firewall: { vendor: "juniper", model: "SRX5800" },
        },
        compliance: ["fisma", "nist_800_53", "fedramp"],
        riskLevel: "critical",
        specialRequirements: ["Classified Network", "Unclassified Network", "SCIF Areas", "Visitor Network"],
      },
      {
        id: "field-office-chicago",
        name: "Field Office - Chicago",
        type: "field_office",
        location: "Chicago, IL",
        users: 400,
        devices: 650,
        infrastructure: {
          wired: { vendor: "aruba", switches: 20, model: "CX 8360" },
          wireless: { vendor: "aruba", aps: 60, model: "AP-635" },
          firewall: { vendor: "palo_alto", model: "PA-5220" },
        },
        compliance: ["fisma", "cjis"],
        riskLevel: "high",
      },
    ],
    applications: [
      {
        id: "classified-system",
        name: "Classified Information System",
        type: "on_premise",
        category: "classified",
        users: 500,
        criticality: "critical",
        compliance: ["fisma", "nist_800_53"],
        authentication: ["pki", "biometric"],
        network_requirements: ["air_gapped", "tempest_certified"],
      },
      {
        id: "case-management",
        name: "Case Management System",
        type: "on_premise",
        category: "operations",
        users: 800,
        criticality: "high",
        compliance: ["fisma", "cjis"],
        authentication: ["pki", "mfa"],
      },
      {
        id: "max-gov",
        name: "MAX.gov Collaboration",
        type: "saas",
        category: "collaboration",
        users: 1500,
        criticality: "medium",
        compliance: ["fedramp", "fisma"],
        authentication: ["piv", "conditional_access"],
        conditional_access_policies: [
          "piv_card_required",
          "government_device_only",
          "continuous_monitoring",
          "insider_threat_detection",
        ],
      },
    ],
    ztna_scenarios: [
      {
        id: "classified_access",
        name: "Classified System Access",
        description: "Highly secure access to classified information systems",
        applications: ["classified-system", "intelligence-platform"],
        user_groups: ["cleared_personnel", "analysts", "administrators"],
        access_policies: [
          "security_clearance_verification",
          "need_to_know_basis",
          "continuous_monitoring",
          "insider_threat_mitigation",
        ],
      },
      {
        id: "interagency_collaboration",
        name: "Interagency Collaboration",
        description: "Secure collaboration with other government agencies",
        applications: ["max-gov", "shared-services"],
        user_groups: ["federal_employees", "contractors"],
        access_policies: ["piv_authentication", "agency_verification", "data_sharing_agreements", "audit_compliance"],
      },
    ],
  },
}

export const industryScenarios: IndustryScenario[] = Object.values(INDUSTRY_SCENARIOS)

export function getIndustryScenario(id: string): IndustryScenario | undefined {
  return industryScenarios.find((scenario) => scenario.id === id)
}

export function getAllIndustryScenarios(): IndustryScenario[] {
  return industryScenarios
}

export function generateRandomSiteData(industry: string, count: number) {
  const scenario = getIndustryScenario(industry)
  if (!scenario) return []

  const sites = []
  const siteTypes = scenario.sites.map((s) => s.type)
  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
  ]

  for (let i = 0; i < count; i++) {
    const baseUsers = Math.floor(Math.random() * 500) + 50
    const baseDevices = Math.floor(baseUsers * 1.8)

    sites.push({
      id: `site-${industry}-${i + 1}`,
      name: `${scenario.name} Site ${i + 1}`,
      type: siteTypes[Math.floor(Math.random() * siteTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      users: baseUsers,
      devices: baseDevices,
      infrastructure: {
        wired: {
          vendor: ["cisco", "aruba", "juniper"][Math.floor(Math.random() * 3)],
          switches: Math.floor(Math.random() * 20) + 4,
          model: "Generic Model",
        },
        wireless: {
          vendor: ["cisco", "aruba", "ruckus"][Math.floor(Math.random() * 3)],
          aps: Math.floor(Math.random() * 50) + 10,
          model: "Generic Model",
        },
        firewall: {
          vendor: ["palo_alto", "fortinet", "checkpoint"][Math.floor(Math.random() * 3)],
          model: "Enterprise Model",
        },
      },
      compliance: scenario.sites[0].compliance,
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    })
  }

  return sites
}
