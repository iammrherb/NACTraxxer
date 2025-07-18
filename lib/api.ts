import { sql } from "./database"
import type { Site, User, ChecklistItem, DeviceType, Vendor, SiteStats } from "./database"

// Sites API
export async function getSites(): Promise<Site[]> {
  try {
    const sites = await sql`
      SELECT s.*, u.name as project_manager_name
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
    const sites = await sql`
      SELECT s.*, u.name as project_manager_name
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      WHERE s.id = ${id}
    `
    return (sites[0] as Site) || null
  } catch (error) {
    console.error("Error fetching site:", error)
    throw new Error("Failed to fetch site")
  }
}

export async function createSite(siteData: Partial<Site>): Promise<Site> {
  try {
    const sites = await sql`
      INSERT INTO sites (
        id, name, region, country, priority, phase, users_count,
        project_manager_id, radsec, planned_start, planned_end,
        status, completion_percent, notes
      )
      VALUES (
        ${siteData.id}, ${siteData.name}, ${siteData.region},
        ${siteData.country}, ${siteData.priority}, ${siteData.phase},
        ${siteData.users_count}, ${siteData.project_manager_id},
        ${siteData.radsec}, ${siteData.planned_start}, ${siteData.planned_end},
        ${siteData.status || "Planned"}, ${siteData.completion_percent || 0},
        ${siteData.notes}
      )
      RETURNING *
    `
    return sites[0] as Site
  } catch (error) {
    console.error("Error creating site:", error)
    throw new Error("Failed to create site")
  }
}

export async function updateSite(id: string, siteData: Partial<Site>): Promise<Site> {
  try {
    const sites = await sql`
      UPDATE sites
      SET
        name = COALESCE(${siteData.name}, name),
        region = COALESCE(${siteData.region}, region),
        country = COALESCE(${siteData.country}, country),
        priority = COALESCE(${siteData.priority}, priority),
        phase = COALESCE(${siteData.phase}, phase),
        users_count = COALESCE(${siteData.users_count}, users_count),
        project_manager_id = COALESCE(${siteData.project_manager_id}, project_manager_id),
        radsec = COALESCE(${siteData.radsec}, radsec),
        planned_start = COALESCE(${siteData.planned_start}, planned_start),
        planned_end = COALESCE(${siteData.planned_end}, planned_end),
        status = COALESCE(${siteData.status}, status),
        completion_percent = COALESCE(${siteData.completion_percent}, completion_percent),
        notes = COALESCE(${siteData.notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return sites[0] as Site
  } catch (error) {
    console.error("Error updating site:", error)
    throw new Error("Failed to update site")
  }
}

export async function deleteSite(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM sites WHERE id = ${id}`
    return true
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
      ORDER BY name
    `
    return users as User[]
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function getUser(id: number): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, name, email, role, user_type, is_active, created_at, updated_at
      FROM users
      WHERE id = ${id}
    `
    return (users[0] as User) || null
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT *
      FROM users
      WHERE email = ${email}
    `
    return (users[0] as User) || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const users = await sql`
      INSERT INTO users (name, email, role, user_type, password_hash, is_active)
      VALUES (
        ${userData.name}, ${userData.email}, ${userData.role},
        ${userData.user_type}, ${userData.password_hash}, ${userData.is_active || true}
      )
      RETURNING id, name, email, role, user_type, is_active, created_at, updated_at
    `
    return users[0] as User
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Checklist Items API
export async function getChecklistItems(): Promise<ChecklistItem[]> {
  try {
    const items = await sql`
      SELECT * FROM checklist_items
      ORDER BY name
    `
    return items as ChecklistItem[]
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    throw new Error("Failed to fetch checklist items")
  }
}

export async function createChecklistItem(itemData: Partial<ChecklistItem>): Promise<ChecklistItem> {
  try {
    const items = await sql`
      INSERT INTO checklist_items (name, is_custom)
      VALUES (${itemData.name}, ${itemData.is_custom || false})
      RETURNING *
    `
    return items[0] as ChecklistItem
  } catch (error) {
    console.error("Error creating checklist item:", error)
    throw new Error("Failed to create checklist item")
  }
}

// Device Types API
export async function getDeviceTypes(): Promise<DeviceType[]> {
  try {
    const types = await sql`
      SELECT * FROM device_types
      ORDER BY name
    `
    return types as DeviceType[]
  } catch (error) {
    console.error("Error fetching device types:", error)
    throw new Error("Failed to fetch device types")
  }
}

export async function createDeviceType(typeData: Partial<DeviceType>): Promise<DeviceType> {
  try {
    const types = await sql`
      INSERT INTO device_types (name, is_custom)
      VALUES (${typeData.name}, ${typeData.is_custom || false})
      RETURNING *
    `
    return types[0] as DeviceType
  } catch (error) {
    console.error("Error creating device type:", error)
    throw new Error("Failed to create device type")
  }
}

// Vendors API
export async function getVendors(): Promise<Vendor[]> {
  try {
    const vendors = await sql`
      SELECT * FROM vendors
      ORDER BY name
    `
    return vendors as Vendor[]
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw new Error("Failed to fetch vendors")
  }
}

export async function createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
  try {
    const vendors = await sql`
      INSERT INTO vendors (name, type, is_custom)
      VALUES (${vendorData.name}, ${vendorData.type}, ${vendorData.is_custom || false})
      RETURNING *
    `
    return vendors[0] as Vendor
  } catch (error) {
    console.error("Error creating vendor:", error)
    throw new Error("Failed to create vendor")
  }
}

// Stats API
export async function getSiteStats(): Promise<SiteStats> {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_sites,
        COUNT(CASE WHEN status = 'Complete' THEN 1 END) as completed_sites,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_sites,
        COUNT(CASE WHEN status = 'Planned' THEN 1 END) as planned_sites,
        COUNT(CASE WHEN status = 'Delayed' THEN 1 END) as delayed_sites,
        COALESCE(SUM(users_count), 0) as total_users,
        COALESCE(AVG(completion_percent), 0) as overall_completion
      FROM sites
    `

    const userCount = await sql`SELECT COUNT(*) as count FROM users`

    return {
      ...stats[0],
      total_users: Number.parseInt(stats[0].total_users),
      overall_completion: Math.round(Number.parseFloat(stats[0].overall_completion)),
    } as SiteStats
  } catch (error) {
    console.error("Error fetching site stats:", error)
    throw new Error("Failed to fetch site stats")
  }
}
