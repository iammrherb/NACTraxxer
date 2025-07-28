import { createClient } from "@/lib/supabase/server"

export interface ActivityLog {
  id?: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  details?: Record<string, any>
  created_at?: string
}

export class ActivityLogger {
  private static async log(activity: Omit<ActivityLog, "id" | "created_at">) {
    try {
      const supabase = createClient()

      const { error } = await supabase.from("activity_logs").insert([
        {
          ...activity,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Failed to log activity:", error)
      }
    } catch (error) {
      console.error("Activity logging error:", error)
    }
  }

  static async logSiteCreated(userId: string, siteId: string, siteName: string) {
    await this.log({
      user_id: userId,
      action: "created",
      resource_type: "site",
      resource_id: siteId,
      details: { site_name: siteName },
    })
  }

  static async logSiteUpdated(userId: string, siteId: string, changes: Record<string, any>) {
    await this.log({
      user_id: userId,
      action: "updated",
      resource_type: "site",
      resource_id: siteId,
      details: { changes },
    })
  }

  static async logSiteDeleted(userId: string, siteId: string, siteName: string) {
    await this.log({
      user_id: userId,
      action: "deleted",
      resource_type: "site",
      resource_id: siteId,
      details: { site_name: siteName },
    })
  }

  static async logProjectCreated(userId: string, projectId: string, projectName: string) {
    await this.log({
      user_id: userId,
      action: "created",
      resource_type: "project",
      resource_id: projectId,
      details: { project_name: projectName },
    })
  }

  static async logBulkUpdate(
    userId: string,
    resourceType: string,
    resourceIds: string[],
    changes: Record<string, any>,
  ) {
    await this.log({
      user_id: userId,
      action: "bulk_updated",
      resource_type: resourceType,
      resource_id: resourceIds.join(","),
      details: { count: resourceIds.length, changes },
    })
  }

  static async logUserRoleChanged(userId: string, targetUserId: string, oldRole: string, newRole: string) {
    await this.log({
      user_id: userId,
      action: "role_changed",
      resource_type: "user",
      resource_id: targetUserId,
      details: { old_role: oldRole, new_role: newRole },
    })
  }
}
