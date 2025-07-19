import { sql } from "./database"
import type { User, Site, Vendor, DeviceType, ChecklistItem, SiteStats } from "./database"

// Users API
export async function getUsers(type?: "project_manager" | "technical_owner"): Promise<User[]> {
  if (type) {
    return await sql`SELECT * FROM users WHERE user_type = ${type} ORDER BY name`
  } else {
    return await sql`SELECT * FROM users ORDER BY name`
  }
}

export async function createUser(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  const result = await sql`
    INSERT INTO users (name, email, role, user_type)
    VALUES (${user.name}, ${user.email}, ${user.role}, ${user.user_type})
    RETURNING *
  `
  return result[0]
}

export async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const result = await sql`
    UPDATE users 
    SET name = COALESCE(${user.name}, name),
        email = COALESCE(${user.email}, email),
        role = COALESCE(${user.role}, role),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result[0]
}

export async function deleteUser(id: number): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${id}`
}

// Sites API
export async function getSites(): Promise<Site[]> {
  const sites = await sql`
    SELECT s.*, u.name as project_manager_name
    FROM sites s
    LEFT JOIN users u ON s.project_manager_id = u.id
    ORDER BY s.created_at DESC
  `

  // Get related data for each site
  for (const site of sites) {
    // Get technical owners
    site.technical_owners = await sql`
      SELECT u.* FROM users u
      JOIN site_technical_owners sto ON u.id = sto.user_id
      WHERE sto.site_id = ${site.id}
    `

    // Get vendors
    site.vendors = await sql`
      SELECT v.* FROM vendors v
      JOIN site_vendors sv ON v.id = sv.vendor_id
      WHERE sv.site_id = ${site.id}
    `

    // Get device types
    site.device_types = await sql`
      SELECT dt.* FROM device_types dt
      JOIN site_device_types sdt ON dt.id = sdt.device_type_id
      WHERE sdt.site_id = ${site.id}
    `

    // Get checklist items
    site.checklist_items = await sql`
      SELECT ci.*, sc.completed, sc.completed_at
      FROM checklist_items ci
      LEFT JOIN site_checklist sc ON ci.id = sc.checklist_item_id AND sc.site_id = ${site.id}
      ORDER BY ci.name
    `
  }

  return sites
}

export async function getSite(id: string): Promise<Site | null> {
  const sites = await sql`
    SELECT s.*, u.name as project_manager_name
    FROM sites s
    LEFT JOIN users u ON s.project_manager_id = u.id
    WHERE s.id = ${id}
  `

  if (sites.length === 0) return null

  const site = sites[0]

  // Get related data
  site.technical_owners = await sql`
    SELECT u.* FROM users u
    JOIN site_technical_owners sto ON u.id = sto.user_id
    WHERE sto.site_id = ${site.id}
  `

  site.vendors = await sql`
    SELECT v.* FROM vendors v
    JOIN site_vendors sv ON v.id = sv.vendor_id
    WHERE sv.site_id = ${site.id}
  `

  site.device_types = await sql`
    SELECT dt.* FROM device_types dt
    JOIN site_device_types sdt ON dt.id = sdt.device_type_id
    WHERE sdt.site_id = ${site.id}
  `

  site.checklist_items = await sql`
    SELECT ci.*, sc.completed, sc.completed_at
    FROM checklist_items ci
    LEFT JOIN site_checklist sc ON ci.id = sc.checklist_item_id AND sc.site_id = ${site.id}
    ORDER BY ci.name
  `

  return site
}

export async function createSite(siteData: any): Promise<Site> {
  // Insert site
  const siteResult = await sql`
    INSERT INTO sites (
      id, name, region, country, priority, phase, users_count,
      project_manager_id, radsec, planned_start, planned_end,
      status, completion_percent, notes
    ) VALUES (
      ${siteData.id}, ${siteData.name}, ${siteData.region}, ${siteData.country},
      ${siteData.priority}, ${siteData.phase}, ${siteData.users_count},
      ${siteData.project_manager_id}, ${siteData.radsec}, ${siteData.planned_start},
      ${siteData.planned_end}, ${siteData.status}, ${siteData.completion_percent},
      ${siteData.notes}
    )
    RETURNING *
  `

  const site = siteResult[0]

  // Insert technical owners
  if (siteData.technical_owner_ids?.length > 0) {
    for (const ownerId of siteData.technical_owner_ids) {
      await sql`
        INSERT INTO site_technical_owners (site_id, user_id)
        VALUES (${site.id}, ${ownerId})
      `
    }
  }

  // Insert vendors
  if (siteData.vendor_ids?.length > 0) {
    for (const vendorId of siteData.vendor_ids) {
      await sql`
        INSERT INTO site_vendors (site_id, vendor_id)
        VALUES (${site.id}, ${vendorId})
      `
    }
  }

  // Insert device types
  if (siteData.device_type_ids?.length > 0) {
    for (const deviceTypeId of siteData.device_type_ids) {
      await sql`
        INSERT INTO site_device_types (site_id, device_type_id)
        VALUES (${site.id}, ${deviceTypeId})
      `
    }
  }

  // Insert checklist items
  if (siteData.checklist_item_ids?.length > 0) {
    for (const itemId of siteData.checklist_item_ids) {
      await sql`
        INSERT INTO site_checklist (site_id, checklist_item_id, completed, completed_at)
        VALUES (${site.id}, ${itemId}, true, CURRENT_TIMESTAMP)
      `
    }
  }

  return (await getSite(site.id)) as Site
}

export async function updateSite(id: string, siteData: any): Promise<Site> {
  // Update site
  await sql`
    UPDATE sites SET
      name = ${siteData.name},
      region = ${siteData.region},
      country = ${siteData.country},
      priority = ${siteData.priority},
      phase = ${siteData.phase},
      users_count = ${siteData.users_count},
      project_manager_id = ${siteData.project_manager_id},
      radsec = ${siteData.radsec},
      planned_start = ${siteData.planned_start},
      planned_end = ${siteData.planned_end},
      status = ${siteData.status},
      completion_percent = ${siteData.completion_percent},
      notes = ${siteData.notes},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `

  // Update technical owners
  await sql`DELETE FROM site_technical_owners WHERE site_id = ${id}`
  if (siteData.technical_owner_ids?.length > 0) {
    for (const ownerId of siteData.technical_owner_ids) {
      await sql`
        INSERT INTO site_technical_owners (site_id, user_id)
        VALUES (${id}, ${ownerId})
      `
    }
  }

  // Update vendors
  await sql`DELETE FROM site_vendors WHERE site_id = ${id}`
  if (siteData.vendor_ids?.length > 0) {
    for (const vendorId of siteData.vendor_ids) {
      await sql`
        INSERT INTO site_vendors (site_id, vendor_id)
        VALUES (${id}, ${vendorId})
      `
    }
  }

  // Update device types
  await sql`DELETE FROM site_device_types WHERE site_id = ${id}`
  if (siteData.device_type_ids?.length > 0) {
    for (const deviceTypeId of siteData.device_type_ids) {
      await sql`
        INSERT INTO site_device_types (site_id, device_type_id)
        VALUES (${id}, ${deviceTypeId})
      `
    }
  }

  // Update checklist items
  await sql`DELETE FROM site_checklist WHERE site_id = ${id}`
  if (siteData.checklist_item_ids?.length > 0) {
    for (const itemId of siteData.checklist_item_ids) {
      await sql`
        INSERT INTO site_checklist (site_id, checklist_item_id, completed, completed_at)
        VALUES (${id}, ${itemId}, true, CURRENT_TIMESTAMP)
      `
    }
  }

  return (await getSite(id)) as Site
}

export async function deleteSite(id: string): Promise<void> {
  await sql`DELETE FROM sites WHERE id = ${id}`
}

// Vendors API
export async function getVendors(type?: "wired" | "wireless"): Promise<Vendor[]> {
  if (type) {
    return await sql`SELECT * FROM vendors WHERE type = ${type} ORDER BY name`
  } else {
    return await sql`SELECT * FROM vendors ORDER BY type, name`
  }
}

export async function createVendor(vendor: Omit<Vendor, "id" | "created_at">): Promise<Vendor> {
  const result = await sql`
    INSERT INTO vendors (name, type, is_custom)
    VALUES (${vendor.name}, ${vendor.type}, ${vendor.is_custom})
    RETURNING *
  `
  return result[0]
}

// Device Types API
export async function getDeviceTypes(): Promise<DeviceType[]> {
  return await sql`SELECT * FROM device_types ORDER BY name`
}

export async function createDeviceType(deviceType: Omit<DeviceType, "id" | "created_at">): Promise<DeviceType> {
  const result = await sql`
    INSERT INTO device_types (name, is_custom)
    VALUES (${deviceType.name}, ${deviceType.is_custom})
    RETURNING *
  `
  return result[0]
}

// Checklist Items API
export async function getChecklistItems(): Promise<ChecklistItem[]> {
  return await sql`SELECT * FROM checklist_items ORDER BY name`
}

export async function createChecklistItem(item: Omit<ChecklistItem, "id" | "created_at">): Promise<ChecklistItem> {
  const result = await sql`
    INSERT INTO checklist_items (name, is_custom)
    VALUES (${item.name}, ${item.is_custom})
    RETURNING *
  `
  return result[0]
}

// Statistics API
export async function getSiteStats(): Promise<SiteStats> {
  const stats = await sql`
    SELECT 
      COUNT(*) as total_sites,
      COUNT(CASE WHEN status = 'Complete' THEN 1 END) as completed_sites,
      COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_sites,
      COUNT(CASE WHEN status = 'Planned' THEN 1 END) as planned_sites,
      COUNT(CASE WHEN status = 'Delayed' THEN 1 END) as delayed_sites,
      SUM(users_count) as total_users,
      ROUND(AVG(completion_percent)) as overall_completion
    FROM sites
  `

  return stats[0]
}
