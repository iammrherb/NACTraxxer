import { sql } from "./database"

export interface ActivityLog {
  userId?: number
  action: string
  entityType: string
  entityId?: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
}

export async function logActivity(activity: ActivityLog) {
  try {
    await sql`
      INSERT INTO activity_logs (
        user_id, action, entity_type, entity_id, 
        old_values, new_values, ip_address, user_agent
      ) VALUES (
        ${activity.userId || null}, ${activity.action}, ${activity.entityType}, 
        ${activity.entityId || null}, ${JSON.stringify(activity.oldValues) || null}, 
        ${JSON.stringify(activity.newValues) || null}, ${activity.ipAddress || null}, 
        ${activity.userAgent || null}
      )
    `
  } catch (error) {
    console.error("Activity logging error:", error)
  }
}

export async function getActivityLogs(limit = 50, userId?: number) {
  let query = `
    SELECT al.*, u.name as user_name
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
  `

  if (userId) {
    query += ` WHERE al.user_id = $1`
  }

  query += ` ORDER BY al.created_at DESC LIMIT $${userId ? 2 : 1}`

  const params = userId ? [userId, limit] : [limit]
  return await sql(query, params)
}
