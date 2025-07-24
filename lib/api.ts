import { supabase, supabaseAdmin } from "./database"
import type {
  Site,
  User,
  Notification,
  Milestone,
  LibraryData,
  SiteStats,
  ChecklistItem,
  DeviceType,
  Vendor,
  ScopingQuestionnaire,
} from "./types"

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function getSites(): Promise<Site[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        *,
        project_manager:users!sites_project_manager_id_fkey(name),
        technical_owners:site_technical_owners(user:users(name)),
        vendors:site_vendors(vendor:vendors(name, type)),
        device_types:site_device_types(device_type:device_types(name))
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching sites:', error)
    return []
  }
}

export async function getSite(id: string): Promise<Site | undefined> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        *,
        project_manager:users!sites_project_manager_id_fkey(name),
        technical_owners:site_technical_owners(user:users(name)),
        vendors:site_vendors(vendor:vendors(name, type)),
        device_types:site_device_types(device_type:device_types(name))
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching site:', error)
    return undefined
  }
}

export async function createSite(siteData: Partial<Site>): Promise<Site> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert([{
        id: siteData.id || `site-${Date.now()}`,
        name: siteData.name || "New Site",
        region: siteData.region || "",
        country: siteData.country || "",
        priority: siteData.priority || "Medium",
        phase: siteData.phase || 1,
        users_count: siteData.users_count || 0,
        project_manager_id: siteData.project_manager_id || null,
        radsec: siteData.radsec || "Native",
        planned_start: siteData.planned_start || new Date().toISOString().split('T')[0],
        planned_end: siteData.planned_end || new Date().toISOString().split('T')[0],
        status: siteData.status || "Planned",
        completion_percent: siteData.completion_percent || 0,
        notes: siteData.notes || null
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating site:', error)
    throw error
  }
}

export async function deleteSite(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting site:', error)
    throw error
  }
}

export async function updateSite(id: string, updatedData: Partial<Site>): Promise<Site | null> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating site:', error)
    return null
  }
}

export async function getUsers(type?: string): Promise<User[]> {
  try {
    let query = supabase.from('users').select('*')
    
    if (type) {
      query = query.eq('user_type', type)
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function createUser(userData: Omit<User, "id" | "avatar">): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

export async function deleteUser(id: string): Promise<void> {
  await simulateDelay(100)
  const userIndex = state.users.findIndex((u: User) => u.id === id)
  if (userIndex > -1) {
    state.users.splice(userIndex, 1)
  }
}

export async function getNotifications(): Promise<Notification[]> {
  // Return empty array for now - notifications can be implemented later
  return []
}

export async function getMilestones(): Promise<Milestone[]> {
  // Return empty array for now - milestones can be implemented later
  return []
}

export async function getLibraryData(): Promise<LibraryData> {
  try {
    const [
      { data: vendors },
      { data: deviceTypes },
      { data: checklistItems },
      { data: useCases },
      { data: testCases },
      { data: requirements }
    ] = await Promise.all([
      supabase.from('vendors').select('*'),
      supabase.from('device_types').select('*'),
      supabase.from('checklist_items').select('*'),
      supabase.from('use_cases').select('*'),
      supabase.from('test_cases').select('*'),
      supabase.from('requirements').select('*')
    ])

    return {
      deploymentChecklist: checklistItems || [],
      useCases: useCases || [],
      testCases: testCases || [],
      requirements: requirements || [],
      regions: [
        { name: "North America" },
        { name: "Europe" },
        { name: "Asia-Pacific (APAC)" },
        { name: "Latin America (LATAM)" },
        { name: "Middle East & Africa (MEA)" }
      ],
      wiredVendors: vendors?.filter(v => v.type === 'wired') || [],
      wirelessVendors: vendors?.filter(v => v.type === 'wireless') || [],
      firewallVendors: vendors?.filter(v => v.type === 'firewall') || [],
      vpnVendors: vendors?.filter(v => v.type === 'vpn') || [],
      mdmVendors: vendors?.filter(v => v.type === 'mdm') || [],
      idpVendors: vendors?.filter(v => v.type === 'idp') || [],
      mfaVendors: vendors?.filter(v => v.type === 'mfa') || [],
      edrVendors: vendors?.filter(v => v.type === 'edr') || [],
      siemVendors: vendors?.filter(v => v.type === 'siem') || [],
      deviceTypes: deviceTypes || []
    }
  } catch (error) {
    console.error('Error fetching library data:', error)
    return {
      deploymentChecklist: [],
      useCases: [],
      testCases: [],
      requirements: [],
      regions: [],
      wiredVendors: [],
      wirelessVendors: [],
      firewallVendors: [],
      vpnVendors: [],
      mdmVendors: [],
      idpVendors: [],
      mfaVendors: [],
      edrVendors: [],
      siemVendors: [],
      deviceTypes: []
    }
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const { data: sites, error: sitesError } = await supabase.from('sites').select('status, completion_percent')
    const { data: users, error: usersError } = await supabase.from('users').select('id')
    
    if (sitesError || usersError) throw sitesError || usersError
    
    const total_sites = sites?.length || 0
    const completed_sites = sites?.filter(s => s.status === 'Complete').length || 0
    const in_progress_sites = sites?.filter(s => s.status === 'In Progress').length || 0
    const planned_sites = sites?.filter(s => s.status === 'Planned').length || 0
    const delayed_sites = sites?.filter(s => s.status === 'Delayed').length || 0
    const total_users = users?.length || 0
    const overall_completion = total_sites > 0 
      ? Math.round((sites?.reduce((acc, site) => acc + (site.completion_percent || 0), 0) || 0) / total_sites)
      : 0

    return {
      total_sites,
      completed_sites,
      in_progress_sites,
      planned_sites,
      delayed_sites,
      total_users,
      overall_completion,
      checklist_completion: 0,
      completed_checklist_items: 0,
      total_checklist_items: 0,
      sites: sites || []
    }
  } catch (error) {
    console.error('Error fetching site stats:', error)
    return {
      total_sites: 0,
      completed_sites: 0,
      in_progress_sites: 0,
      planned_sites: 0,
      delayed_sites: 0,
      total_users: 0,
      overall_completion: 0,
      checklist_completion: 0,
      completed_checklist_items: 0,
      total_checklist_items: 0,
      sites: []
    }
  }
}

export async function getChecklistStatus(siteId: string): Promise<Record<string, boolean>> {
  return {}
}

export async function updateChecklistStatus(siteId: string, newStatus: Record<string, boolean>): Promise<void> {
  await simulateDelay(100)
  const siteIndex = state.sites.findIndex((s: Site) => s.id === siteId)

  if (siteIndex === -1) {
    console.error(`Site with id ${siteId} not found in updateChecklistStatus`)
    return
  }

  const site = state.sites[siteIndex]
  const updatedChecklist = site.deploymentChecklist.map((item) => ({
    ...item,
    completed: newStatus[item.id] ?? item.completed,
  }))

  state.sites[siteIndex].deploymentChecklist = updatedChecklist
}

export async function bulkUpdateSites(siteIds: string[], updates: any): Promise<void> {
  await simulateDelay(200)

  const updatedSites = state.sites.map((site: Site) => {
    if (siteIds.includes(site.id)) {
      const newSiteData = { ...site }
      if (updates.project_manager_id) {
        const pm = state.users.find((u: User) => u.id === updates.project_manager_id)
        if (pm) newSiteData.projectManager = pm.name
      }
      if (updates.technical_owner_ids) {
        newSiteData.technicalOwners = state.users
          .filter((u: User) => updates.technical_owner_ids.includes(u.id))
          .map((u: User) => u.name)
      }
      return newSiteData
    }
    return site
  })
  state.sites = updatedSites
}

export async function bulkCreateSites(sitesData: Partial<Site>[]): Promise<Site[]> {
  await simulateDelay(200)
  const newSites: Site[] = sitesData.map((site, i) => ({
    id: `${site.name?.replace(/\s+/g, "-").toUpperCase() || "SITE"}-${Date.now() + i}`,
    name: site.name || "New Site",
    customer: site.customer || "",
    region: site.region || "",
    country: site.country || "",
    status: site.status || "Planning",
    projectManager: site.projectManager || "",
    technicalOwners: site.technicalOwners || [],
    wiredVendors: site.wiredVendors || [],
    wirelessVendors: site.wirelessVendors || [],
    deviceTypes: site.deviceTypes || [],
    radsec: site.radsec || "Native",
    plannedStart: site.plannedStart || new Date().toISOString(),
    plannedEnd: site.plannedEnd || new Date().toISOString(),
    completionPercent: site.completionPercent || 0,
    deploymentChecklist: site.deploymentChecklist || [],
  }))
  state.sites.push(...newSites)
  return newSites
}

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  const data = await getLibraryData()
  return data.deploymentChecklist
}

export async function getVendors(type?: string): Promise<Vendor[]> {
  try {
    let query = supabase.from('vendors').select('*')
    
    if (type) {
      query = query.eq('type', type)
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

export async function createVendor(itemData: Omit<Vendor, "id">): Promise<Vendor> {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{ ...itemData, is_custom: true }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating vendor:', error)
    throw error
  }
}

export async function getQuestionnaires(): Promise<ScopingQuestionnaire[]> {
  await simulateDelay(50)
  // This is a mock, returning an empty array for now.
  return []
}

export async function createQuestionnaire(data: Omit<ScopingQuestionnaire, "id">): Promise<ScopingQuestionnaire> {
  await simulateDelay(100)
  const newQuestionnaire = { id: `${Date.now()}`, ...data }
  console.log("Created questionnaire (mock):", newQuestionnaire)
  // This is a mock, just returning the created object.
  return newQuestionnaire
}

export async function updateQuestionnaire(
  id: string,
  data: Partial<ScopingQuestionnaire>,
): Promise<ScopingQuestionnaire> {
  await simulateDelay(100)
  console.log(`Updating questionnaire ${id} (mock):`, data)
  // This is a mock, returning a merged object.
  const mockQuestionnaire: ScopingQuestionnaire = {
    id,
    siteName: "Updated Site",
    customerName: "Updated Customer",
    region: "North America",
    country: "US",
    projectManager: "Alice",
    technicalOwner: "Bob",
    ...data,
  }
  return mockQuestionnaire
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  await simulateDelay(100)
  console.log(`Deleting questionnaire ${id} (mock)`)
}

export async function seedDatabase(): Promise<void> {
  // This would need to be implemented with actual Supabase seeding
  console.log("Database seeding not implemented for Supabase yet.")
}

export async function clearDatabase(): Promise<void> {
  try {
    await supabase.from('sites').delete().neq('id', '')
    console.log("Sites cleared from database.")
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}

export async function deleteLibraryItem(id: number | string, type: string): Promise<void> {
  console.log(`Deleting item with id ${id} of type ${type}`)
  await simulateDelay(100)
}

export async function updateLibraryItem(id: number | string, data: any, type: string): Promise<void> {
  console.log(`Updating item with id ${id} of type ${type} with data:`, data)
  await simulateDelay(100)
}

export async function createLibraryItem(data: any, type: string): Promise<void> {
  console.log(`Creating item of type ${type} with data:`, data)
  await simulateDelay(100)
}
