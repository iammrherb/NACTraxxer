import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const sql = neon(process.env.DATABASE_URL!)

export interface Permission {
  id: number
  name: string
  description: string
  category: string
}

export interface Role {
  id: number
  name: string
  description: string
  is_system_role: boolean
  permissions?: Permission[]
}

export interface UserRole {
  id: number
  user_id: string
  role_id: number
  role_name: string
  assigned_at: string
  expires_at?: string
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    // Get permissions from roles
    const rolePermissions = await sql`
      SELECT DISTINCT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ${userId}
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    `

    // Get direct permissions
    const directPermissions = await sql`
      SELECT DISTINCT p.name
      FROM permissions p
      JOIN user_permissions up ON p.id = up.permission_id
      WHERE up.user_id = ${userId}
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    `

    const allPermissions = [...rolePermissions.map((p) => p.name), ...directPermissions.map((p) => p.name)]

    return [...new Set(allPermissions)]
  } catch (error) {
    console.error("Error getting user permissions:", error)
    return []
  }
}

export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const roles = await sql`
      SELECT DISTINCT r.name
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ${userId}
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    `

    return roles.map((r) => r.name)
  } catch (error) {
    console.error("Error getting user roles:", error)
    return []
  }
}

export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return permissions.includes(permission) || permissions.includes("system.admin")
}

export async function hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  return permissions.some((p) => userPermissions.includes(p)) || userPermissions.includes("system.admin")
}

export async function hasRole(userId: string, role: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.includes(role)
}

export async function hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
  const userRoles = await getUserRoles(userId)
  return roles.some((r) => userRoles.includes(r))
}

export async function getAllRoles(): Promise<Role[]> {
  try {
    const roles = await sql`
      SELECT r.*, 
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', p.id,
                   'name', p.name,
                   'description', p.description,
                   'category', p.category
                 )
               ) FILTER (WHERE p.id IS NOT NULL), 
               '[]'
             ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      GROUP BY r.id, r.name, r.description, r.is_system_role
      ORDER BY r.name
    `

    return roles.map((role) => ({
      ...role,
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
    }))
  } catch (error) {
    console.error("Error getting all roles:", error)
    return []
  }
}

export async function getAllPermissions(): Promise<Permission[]> {
  try {
    const permissions = await sql`
      SELECT * FROM permissions
      ORDER BY category, name
    `

    return permissions
  } catch (error) {
    console.error("Error getting all permissions:", error)
    return []
  }
}

export async function createRole(name: string, description: string, permissionIds: number[]): Promise<Role | null> {
  try {
    const [role] = await sql`
      INSERT INTO roles (name, description)
      VALUES (${name}, ${description})
      RETURNING *
    `

    if (permissionIds.length > 0) {
      await sql`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT ${role.id}, unnest(${permissionIds}::int[])
      `
    }

    return role
  } catch (error) {
    console.error("Error creating role:", error)
    return null
  }
}

export async function updateRole(
  roleId: number,
  name: string,
  description: string,
  permissionIds: number[],
): Promise<boolean> {
  try {
    await sql`
      UPDATE roles 
      SET name = ${name}, description = ${description}, updated_at = NOW()
      WHERE id = ${roleId} AND is_system_role = false
    `

    await sql`DELETE FROM role_permissions WHERE role_id = ${roleId}`

    if (permissionIds.length > 0) {
      await sql`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT ${roleId}, unnest(${permissionIds}::int[])
      `
    }

    return true
  } catch (error) {
    console.error("Error updating role:", error)
    return false
  }
}

export async function deleteRole(roleId: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM roles 
      WHERE id = ${roleId} AND is_system_role = false
    `
    return true
  } catch (error) {
    console.error("Error deleting role:", error)
    return false
  }
}

export async function assignRoleToUser(userId: string, roleId: number, assignedBy: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      VALUES (${userId}, ${roleId}, ${assignedBy})
      ON CONFLICT (user_id, role_id) DO NOTHING
    `
    return true
  } catch (error) {
    console.error("Error assigning role to user:", error)
    return false
  }
}

export async function removeRoleFromUser(userId: string, roleId: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM user_roles 
      WHERE user_id = ${userId} AND role_id = ${roleId}
    `
    return true
  } catch (error) {
    console.error("Error removing role from user:", error)
    return false
  }
}

export async function checkPermissionMiddleware(permission: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { authorized: false, status: 401 }
  }

  const hasAccess = await hasPermission(session.user.email, permission)

  if (!hasAccess) {
    return { authorized: false, status: 403 }
  }

  return { authorized: true, user: session.user }
}
