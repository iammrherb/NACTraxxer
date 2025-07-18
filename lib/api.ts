import { sql, type Site, type User, type SiteStats, type Vendor, type DeviceType, type ChecklistItem } from "./database"

// Sites API
export async function getSites(): Promise<Site[]> {
  try {
    const sites = await sql`
      SELECT 
        s.*,
        u.name as project_manager_name
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      ORDER BY s.created_at DESC
    `
    return sites as Site[]
  } catch (error) {
    console.error("Error fetching sites:", error)
    throw new Error("Failed to fetch sites")
  }
}

export async function getSite(id: string): Promise<Site | null> {
  try {
    const [site] = await sql`
      SELECT 
        s.*,
        u.name as project_manager_name
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      WHERE s.id = ${id}
    `
    return (site as Site) || null
  } catch (error) {
    console.error("Error fetching site:", error)
    throw new Error("Failed to fetch site")
  }
}

export async function createSite(siteData: Omit<Site, "id" | "created_at" | "updated_at">): Promise<Site> {
  try {
    const [site] = await sql`
      INSERT INTO sites (
        id, name, region, country, priority, phase, users_count,
        project_manager_id, radsec, planned_start, planned_end,
        status, completion_percent, notes
      ) VALUES (
        ${crypto.randomUUID()}, ${siteData.name}, ${siteData.region}, 
        ${siteData.country}, ${siteData.priority}, ${siteData.phase},
        ${siteData.users_count}, ${siteData.project_manager_id},
        ${siteData.radsec}, ${siteData.planned_start}, ${siteData.planned_end},
        ${siteData.status}, ${siteData.completion_percent}, ${siteData.notes}
      )
      RETURNING *
    `
    return site as Site
  } catch (error) {
    console.error("Error creating site:", error)
    throw new Error("Failed to create site")
  }
}

export async function updateSite(id: string, updates: Partial<Site>): Promise<Site> {
  try {
    const [site] = await sql`
      UPDATE sites 
      SET 
        name = COALESCE(${updates.name}, name),
        region = COALESCE(${updates.region}, region),
        country = COALESCE(${updates.country}, country),
        priority = COALESCE(${updates.priority}, priority),
        phase = COALESCE(${updates.phase}, phase),
        users_count = COALESCE(${updates.users_count}, users_count),
        project_manager_id = COALESCE(${updates.project_manager_id}, project_manager_id),
        radsec = COALESCE(${updates.radsec}, radsec),
        planned_start = COALESCE(${updates.planned_start}, planned_start),
        planned_end = COALESCE(${updates.planned_end}, planned_end),
        status = COALESCE(${updates.status}, status),
        completion_percent = COALESCE(${updates.completion_percent}, completion_percent),
        notes = COALESCE(${updates.notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return site as Site
  } catch (error) {
    console.error("Error updating site:", error)
    throw new Error("Failed to update site")
  }
}

export async function deleteSite(id: string): Promise<void> {
  try {
    await sql`DELETE FROM sites WHERE id = ${id}`
  } catch (error) {
    console.error("Error deleting site:", error)
    throw new Error("Failed to delete site")
  }
}

// Users API
export async function getUsers(): Promise<User[]> {
  try {
    const users = await sql`
      SELECT id, name, email, role, user_type, is_active, created_at, updated_at
      FROM users
      ORDER BY name ASC
    `
    return users as User[]
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  try {
    const [user] = await sql`
      INSERT INTO users (name, email, role, user_type, password_hash, is_active)
      VALUES (${userData.name}, ${userData.email}, ${userData.role}, 
              ${userData.user_type}, ${userData.password_hash}, ${userData.is_active})
      RETURNING id, name, email, role, user_type, is_active, created_at, updated_at
    `
    return user as User
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Stats API
export async function getSiteStats(): Promise<SiteStats> {
  try {
    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_sites,
        COUNT(CASE WHEN status = 'Complete' THEN 1 END) as completed_sites,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_sites,
        COUNT(CASE WHEN status = 'Planned' THEN 1 END) as planned_sites,
        COUNT(CASE WHEN status = 'Delayed' THEN 1 END) as delayed_sites,
        COALESCE(AVG(completion_percent), 0) as overall_completion
      FROM sites
    `

    const [userCount] = await sql`SELECT COUNT(*) as total_users FROM users`

    return {
      ...stats,
      total_users: userCount.total_users,
      overall_completion: Math.round(stats.overall_completion),
    } as SiteStats
  } catch (error) {
    console.error("Error fetching stats:", error)
    throw new Error("Failed to fetch stats")
  }
}

// Vendors API
export async function getVendors(): Promise<Vendor[]> {
  try {
    const vendors = await sql`
      SELECT * FROM vendors
      ORDER BY name ASC
    `
    return vendors as Vendor[]
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw new Error("Failed to fetch vendors")
  }
}

export async function createVendor(vendorData: Omit<Vendor, "id" | "created_at">): Promise<Vendor> {
  try {
    const [vendor] = await sql`
      INSERT INTO vendors (name, type, is_custom)
      VALUES (${vendorData.name}, ${vendorData.type}, ${vendorData.is_custom})
      RETURNING *
    `
    return vendor as Vendor
  } catch (error) {
    console.error("Error creating vendor:", error)
    throw new Error("Failed to create vendor")
  }
}

// Device Types API
export async function getDeviceTypes(): Promise<DeviceType[]> {
  try {
    const deviceTypes = await sql`
      SELECT * FROM device_types
      ORDER BY name ASC
    `
    return deviceTypes as DeviceType[]
  } catch (error) {
    console.error("Error fetching device types:", error)
    throw new Error("Failed to fetch device types")
  }
}

export async function createDeviceType(deviceTypeData: Omit<DeviceType, "id" | "created_at">): Promise<DeviceType> {
  try {
    const [deviceType] = await sql`
      INSERT INTO device_types (name, is_custom)
      VALUES (${deviceTypeData.name}, ${deviceTypeData.is_custom})
      RETURNING *
    `
    return deviceType as DeviceType
  } catch (error) {
    console.error("Error creating device type:", error)
    throw new Error("Failed to create device type")
  }
}

// Checklist Items API
export async function getChecklistItems(): Promise<ChecklistItem[]> {
  try {
    const items = await sql`
      SELECT * FROM checklist_items
      ORDER BY name ASC
    `
    return items as ChecklistItem[]
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    throw new Error("Failed to fetch checklist items")
  }
}

export async function createChecklistItem(itemData: Omit<ChecklistItem, "id" | "created_at">): Promise<ChecklistItem> {
  try {
    const [item] = await sql`
      INSERT INTO checklist_items (name, is_custom)
      VALUES (${itemData.name}, ${itemData.is_custom})
      RETURNING *
    `
    return item as ChecklistItem
  } catch (error) {
    console.error("Error creating checklist item:", error)
    throw new Error("Failed to create checklist item")
  }
}
