import { neon } from "@neondatabase/serverless"
import type {
  Site,
  User,
  Vendor,
  DeviceType,
  UseCase,
  SiteStats,
  DashboardMetrics,
  Milestone,
  ChecklistItem,
} from "./types"

const sql = neon(process.env.DATABASE_URL!)

// Sites data functions
export async function getAllSites(): Promise<Site[]> {
  try {
    const sites = await sql`
      SELECT 
        s.*,
        u.name as project_manager_name,
        COALESCE(
          ARRAY_AGG(DISTINCT sto.user_id) FILTER (WHERE sto.user_id IS NOT NULL), 
          ARRAY[]::integer[]
        ) as technical_owner_ids,
        COALESCE(
          ARRAY_AGG(DISTINCT v.name) FILTER (WHERE v.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as vendor_names,
        COALESCE(
          ARRAY_AGG(DISTINCT dt.name) FILTER (WHERE dt.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as device_type_names
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      LEFT JOIN site_technical_owners sto ON s.id = sto.site_id
      LEFT JOIN site_vendors sv ON s.id = sv.site_id
      LEFT JOIN vendors v ON sv.vendor_id = v.id
      LEFT JOIN site_device_types sdt ON s.id = sdt.site_id
      LEFT JOIN device_types dt ON sdt.device_type_id = dt.id
      GROUP BY s.id, u.name
      ORDER BY s.created_at DESC
    `

    return sites.map((site) => ({
      ...site,
      technical_owners: site.technical_owner_ids || [],
      wired_vendors: site.vendor_names?.filter((v: string) => v) || [],
      wireless_vendors: site.vendor_names?.filter((v: string) => v) || [],
      device_types: site.device_type_names || [],
      deployment_checklist: [],
    }))
  } catch (error) {
    console.error("Error fetching sites:", error)
    throw new Error("Failed to fetch sites")
  }
}

export async function getSiteById(id: number): Promise<Site | null> {
  try {
    const sites = await sql`
      SELECT 
        s.*,
        u.name as project_manager_name,
        COALESCE(
          ARRAY_AGG(DISTINCT sto.user_id) FILTER (WHERE sto.user_id IS NOT NULL), 
          ARRAY[]::integer[]
        ) as technical_owner_ids,
        COALESCE(
          ARRAY_AGG(DISTINCT v.name) FILTER (WHERE v.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as vendor_names,
        COALESCE(
          ARRAY_AGG(DISTINCT dt.name) FILTER (WHERE dt.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as device_type_names
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      LEFT JOIN site_technical_owners sto ON s.id = sto.site_id
      LEFT JOIN site_vendors sv ON s.id = sv.site_id
      LEFT JOIN vendors v ON sv.vendor_id = v.id
      LEFT JOIN site_device_types sdt ON s.id = sdt.site_id
      LEFT JOIN device_types dt ON sdt.device_type_id = dt.id
      WHERE s.id = ${id}
      GROUP BY s.id, u.name
    `

    if (sites.length === 0) return null

    const site = sites[0]
    return {
      ...site,
      technical_owners: site.technical_owner_ids || [],
      wired_vendors: site.vendor_names?.filter((v: string) => v) || [],
      wireless_vendors: site.vendor_names?.filter((v: string) => v) || [],
      device_types: site.device_type_names || [],
      deployment_checklist: [],
    }
  } catch (error) {
    console.error("Error fetching site:", error)
    throw new Error("Failed to fetch site")
  }
}

export async function createSite(siteData: Partial<Site>): Promise<Site> {
  try {
    const result = await sql`
      INSERT INTO sites (
        name, site_code, region, country, city, address, timezone,
        priority, phase, users, project_manager, budget, currency,
        radsec, planned_start, planned_end, status, completion_percent,
        health_score, risk_level, notes, network_details, security_requirements,
        compliance_frameworks
      ) VALUES (
        ${siteData.name}, ${siteData.site_code}, ${siteData.region}, ${siteData.country},
        ${siteData.city}, ${siteData.address}, ${siteData.timezone || "UTC"},
        ${siteData.priority || "Medium"}, ${siteData.phase || "Phase 1"}, ${siteData.users || 0},
        ${siteData.project_manager}, ${siteData.budget}, ${siteData.currency || "USD"},
        ${siteData.radsec || false}, ${siteData.planned_start}, ${siteData.planned_end},
        ${siteData.status || "Planning"}, ${siteData.completion_percent || 0},
        ${siteData.health_score || 100}, ${siteData.risk_level || "Low"},
        ${siteData.notes}, ${JSON.stringify(siteData.network_details || {})},
        ${JSON.stringify(siteData.security_requirements || {})},
        ${siteData.compliance_frameworks || []}
      )
      RETURNING *
    `

    const site = result[0]
    return {
      ...site,
      technical_owners: [],
      wired_vendors: [],
      wireless_vendors: [],
      device_types: [],
      deployment_checklist: [],
    }
  } catch (error) {
    console.error("Error creating site:", error)
    throw new Error("Failed to create site")
  }
}

export async function updateSite(id: number, siteData: Partial<Site>): Promise<Site> {
  try {
    const result = await sql`
      UPDATE sites SET
        name = COALESCE(${siteData.name}, name),
        site_code = COALESCE(${siteData.site_code}, site_code),
        region = COALESCE(${siteData.region}, region),
        country = COALESCE(${siteData.country}, country),
        city = COALESCE(${siteData.city}, city),
        address = COALESCE(${siteData.address}, address),
        timezone = COALESCE(${siteData.timezone}, timezone),
        priority = COALESCE(${siteData.priority}, priority),
        phase = COALESCE(${siteData.phase}, phase),
        users = COALESCE(${siteData.users}, users),
        project_manager = COALESCE(${siteData.project_manager}, project_manager),
        budget = COALESCE(${siteData.budget}, budget),
        currency = COALESCE(${siteData.currency}, currency),
        radsec = COALESCE(${siteData.radsec}, radsec),
        planned_start = COALESCE(${siteData.planned_start}, planned_start),
        planned_end = COALESCE(${siteData.planned_end}, planned_end),
        actual_start = COALESCE(${siteData.actual_start}, actual_start),
        actual_end = COALESCE(${siteData.actual_end}, actual_end),
        status = COALESCE(${siteData.status}, status),
        completion_percent = COALESCE(${siteData.completion_percent}, completion_percent),
        health_score = COALESCE(${siteData.health_score}, health_score),
        risk_level = COALESCE(${siteData.risk_level}, risk_level),
        notes = COALESCE(${siteData.notes}, notes),
        network_details = COALESCE(${JSON.stringify(siteData.network_details)}, network_details),
        security_requirements = COALESCE(${JSON.stringify(siteData.security_requirements)}, security_requirements),
        compliance_frameworks = COALESCE(${siteData.compliance_frameworks}, compliance_frameworks),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const site = result[0]
    return {
      ...site,
      technical_owners: [],
      wired_vendors: [],
      wireless_vendors: [],
      device_types: [],
      deployment_checklist: [],
    }
  } catch (error) {
    console.error("Error updating site:", error)
    throw new Error("Failed to update site")
  }
}

export async function deleteSite(id: number): Promise<void> {
  try {
    await sql`DELETE FROM sites WHERE id = ${id}`
  } catch (error) {
    console.error("Error deleting site:", error)
    throw new Error("Failed to delete site")
  }
}

// Users data functions
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await sql`
      SELECT 
        id, name, email, role, department, phone, timezone,
        avatar_url, is_active, last_login, preferences,
        created_at, updated_at
      FROM users 
      WHERE is_active = true
      ORDER BY name ASC
    `
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const result = await sql`
      INSERT INTO users (
        name, email, role, department, phone, timezone,
        avatar_url, is_active, preferences
      ) VALUES (
        ${userData.name}, ${userData.email}, ${userData.role || "Viewer"},
        ${userData.department}, ${userData.phone}, ${userData.timezone || "UTC"},
        ${userData.avatar_url}, ${userData.is_active !== false}, 
        ${JSON.stringify(userData.preferences || {})}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Vendors data functions
export async function getAllVendors(): Promise<Vendor[]> {
  try {
    const vendors = await sql`
      SELECT 
        id, name, type, contact_person, contact_email, contact_phone,
        website, description, logo_url, is_active, created_at, updated_at
      FROM vendors 
      WHERE is_active = true
      ORDER BY name ASC
    `
    return vendors
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw new Error("Failed to fetch vendors")
  }
}

export async function createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
  try {
    const result = await sql`
      INSERT INTO vendors (
        name, type, contact_person, contact_email, contact_phone,
        website, description, logo_url, is_active
      ) VALUES (
        ${vendorData.name}, ${vendorData.type}, ${vendorData.contact_person},
        ${vendorData.contact_email}, ${vendorData.contact_phone},
        ${vendorData.website}, ${vendorData.description}, ${vendorData.logo_url},
        ${vendorData.is_active !== false}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating vendor:", error)
    throw new Error("Failed to create vendor")
  }
}

// Device Types data functions
export async function getAllDeviceTypes(): Promise<DeviceType[]> {
  try {
    const deviceTypes = await sql`
      SELECT 
        id, name, category, description, icon, authentication_methods,
        compliance_requirements, is_active, created_at, updated_at
      FROM device_types 
      WHERE is_active = true
      ORDER BY name ASC
    `
    return deviceTypes
  } catch (error) {
    console.error("Error fetching device types:", error)
    throw new Error("Failed to fetch device types")
  }
}

export async function createDeviceType(deviceTypeData: Partial<DeviceType>): Promise<DeviceType> {
  try {
    const result = await sql`
      INSERT INTO device_types (
        name, category, description, icon, authentication_methods,
        compliance_requirements, is_active
      ) VALUES (
        ${deviceTypeData.name}, ${deviceTypeData.category}, ${deviceTypeData.description},
        ${deviceTypeData.icon}, ${deviceTypeData.authentication_methods || []},
        ${deviceTypeData.compliance_requirements || []}, ${deviceTypeData.is_active !== false}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating device type:", error)
    throw new Error("Failed to create device type")
  }
}

// Use Cases data functions
export async function getAllUseCases(): Promise<UseCase[]> {
  try {
    const useCases = await sql`
      SELECT 
        uc.*,
        u1.name as assigned_to_name,
        u2.name as reviewer_name
      FROM use_cases uc
      LEFT JOIN users u1 ON uc.assigned_to = u1.id
      LEFT JOIN users u2 ON uc.reviewer_id = u2.id
      ORDER BY uc.created_at DESC
    `
    return useCases
  } catch (error) {
    console.error("Error fetching use cases:", error)
    throw new Error("Failed to fetch use cases")
  }
}

export async function createUseCase(useCaseData: Partial<UseCase>): Promise<UseCase> {
  try {
    const result = await sql`
      INSERT INTO use_cases (
        title, subtitle, description, category, priority, status,
        completion_percentage, estimated_effort_hours, actual_effort_hours,
        business_value, technical_requirements, acceptance_criteria,
        test_scenarios, dependencies, risks, assigned_to, reviewer_id,
        start_date, target_date, tags, attachments
      ) VALUES (
        ${useCaseData.title}, ${useCaseData.subtitle}, ${useCaseData.description},
        ${useCaseData.category}, ${useCaseData.priority || "Medium"},
        ${useCaseData.status || "Draft"}, ${useCaseData.completion_percentage || 0},
        ${useCaseData.estimated_effort_hours}, ${useCaseData.actual_effort_hours},
        ${useCaseData.business_value}, ${useCaseData.technical_requirements},
        ${useCaseData.acceptance_criteria}, ${useCaseData.test_scenarios},
        ${useCaseData.dependencies || []}, ${useCaseData.risks || []},
        ${useCaseData.assigned_to}, ${useCaseData.reviewer_id},
        ${useCaseData.start_date}, ${useCaseData.target_date},
        ${useCaseData.tags || []}, ${JSON.stringify(useCaseData.attachments || [])}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating use case:", error)
    throw new Error("Failed to create use case")
  }
}

// Statistics and metrics functions
export async function getSiteStats(): Promise<SiteStats> {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Complete' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'Planning' THEN 1 END) as planning,
        COUNT(CASE WHEN status = 'Testing' THEN 1 END) as testing,
        COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold,
        COALESCE(AVG(completion_percent), 0) as avg_completion,
        COALESCE(SUM(budget), 0) as total_budget,
        COALESCE(SUM(users), 0) as total_users,
        COUNT(CASE WHEN risk_level IN ('High', 'Critical') THEN 1 END) as high_risk_sites
      FROM sites
      WHERE status != 'Cancelled'
    `

    const milestoneStats = await sql`
      SELECT COUNT(CASE WHEN status = 'Overdue' THEN 1 END) as overdue_milestones
      FROM milestones
    `

    const result = stats[0]
    const milestoneResult = milestoneStats[0]

    return {
      total: Number(result.total),
      completed: Number(result.completed),
      inProgress: Number(result.in_progress),
      planning: Number(result.planning),
      testing: Number(result.testing),
      onHold: Number(result.on_hold),
      avgCompletion: Math.round(Number(result.avg_completion)),
      totalBudget: Number(result.total_budget),
      totalUsers: Number(result.total_users),
      overdueMilestones: Number(milestoneResult.overdue_milestones),
      highRiskSites: Number(result.high_risk_sites),
    }
  } catch (error) {
    console.error("Error fetching site stats:", error)
    throw new Error("Failed to fetch site stats")
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const siteStats = await getSiteStats()

    const useCaseStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
        COALESCE(AVG(completion_percentage), 0) as avg_completion
      FROM use_cases
    `

    const milestoneStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'Overdue' THEN 1 END) as overdue,
        COUNT(CASE WHEN due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as due_this_week
      FROM milestones
    `

    const checklistStats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed
      FROM checklist_items
    `

    const useCaseResult = useCaseStats[0]
    const milestoneResult = milestoneStats[0]
    const checklistResult = checklistStats[0]

    return {
      sites: siteStats,
      useCases: {
        total: Number(useCaseResult.total),
        completed: Number(useCaseResult.completed),
        inProgress: Number(useCaseResult.in_progress),
        avgCompletion: Math.round(Number(useCaseResult.avg_completion)),
      },
      milestones: {
        total: Number(milestoneResult.total),
        completed: Number(milestoneResult.completed),
        overdue: Number(milestoneResult.overdue),
        dueThisWeek: Number(milestoneResult.due_this_week),
      },
      checklist: {
        total: Number(checklistResult.total),
        completed: Number(checklistResult.completed),
        completionRate:
          Number(checklistResult.total) > 0
            ? Math.round((Number(checklistResult.completed) / Number(checklistResult.total)) * 100)
            : 0,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    throw new Error("Failed to fetch dashboard metrics")
  }
}

// Milestones data functions
export async function getAllMilestones(): Promise<Milestone[]> {
  try {
    const milestones = await sql`
      SELECT 
        m.*,
        s.name as site_name,
        u.name as assigned_to_name
      FROM milestones m
      LEFT JOIN sites s ON m.site_id = s.id
      LEFT JOIN users u ON m.assigned_to = u.id
      ORDER BY m.due_date ASC
    `
    return milestones
  } catch (error) {
    console.error("Error fetching milestones:", error)
    throw new Error("Failed to fetch milestones")
  }
}

export async function getMilestonesBySite(siteId: number): Promise<Milestone[]> {
  try {
    const milestones = await sql`
      SELECT 
        m.*,
        u.name as assigned_to_name
      FROM milestones m
      LEFT JOIN users u ON m.assigned_to = u.id
      WHERE m.site_id = ${siteId}
      ORDER BY m.due_date ASC
    `
    return milestones
  } catch (error) {
    console.error("Error fetching milestones for site:", error)
    throw new Error("Failed to fetch milestones for site")
  }
}

export async function createMilestone(milestoneData: Partial<Milestone>): Promise<Milestone> {
  try {
    const result = await sql`
      INSERT INTO milestones (
        site_id, title, description, milestone_type, due_date,
        status, priority, assigned_to, dependencies, deliverables,
        success_criteria
      ) VALUES (
        ${milestoneData.site_id}, ${milestoneData.title}, ${milestoneData.description},
        ${milestoneData.milestone_type || "Delivery"}, ${milestoneData.due_date},
        ${milestoneData.status || "Pending"}, ${milestoneData.priority || "Medium"},
        ${milestoneData.assigned_to}, ${milestoneData.dependencies || []},
        ${milestoneData.deliverables || []}, ${milestoneData.success_criteria}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating milestone:", error)
    throw new Error("Failed to create milestone")
  }
}

// Checklist data functions
export async function getAllChecklistItems(): Promise<ChecklistItem[]> {
  try {
    const items = await sql`
      SELECT 
        ci.*,
        s.name as site_name,
        uc.title as use_case_title,
        u1.name as completed_by_name,
        u2.name as verified_by_name
      FROM checklist_items ci
      LEFT JOIN sites s ON ci.site_id = s.id
      LEFT JOIN use_cases uc ON ci.use_case_id = uc.id
      LEFT JOIN users u1 ON ci.completed_by = u1.id
      LEFT JOIN users u2 ON ci.verified_by = u2.id
      ORDER BY ci.created_at DESC
    `
    return items
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    throw new Error("Failed to fetch checklist items")
  }
}

export async function getChecklistItemsBySite(siteId: number): Promise<ChecklistItem[]> {
  try {
    const items = await sql`
      SELECT 
        ci.*,
        uc.title as use_case_title,
        u1.name as completed_by_name,
        u2.name as verified_by_name
      FROM checklist_items ci
      LEFT JOIN use_cases uc ON ci.use_case_id = uc.id
      LEFT JOIN users u1 ON ci.completed_by = u1.id
      LEFT JOIN users u2 ON ci.verified_by = u2.id
      WHERE ci.site_id = ${siteId}
      ORDER BY ci.priority DESC, ci.created_at ASC
    `
    return items
  } catch (error) {
    console.error("Error fetching checklist items for site:", error)
    throw new Error("Failed to fetch checklist items for site")
  }
}

export async function createChecklistItem(itemData: Partial<ChecklistItem>): Promise<ChecklistItem> {
  try {
    const result = await sql`
      INSERT INTO checklist_items (
        site_id, use_case_id, title, description, category,
        priority, completed, verification_required, notes, attachments
      ) VALUES (
        ${itemData.site_id}, ${itemData.use_case_id}, ${itemData.title},
        ${itemData.description}, ${itemData.category}, ${itemData.priority || "Medium"},
        ${itemData.completed || false}, ${itemData.verification_required || false},
        ${itemData.notes}, ${JSON.stringify(itemData.attachments || [])}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating checklist item:", error)
    throw new Error("Failed to create checklist item")
  }
}
