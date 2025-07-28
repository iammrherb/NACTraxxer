interface ActivityLog {
  id: string
  action: string
  resource: string
  resourceId: string
  details?: any
  timestamp: Date
}

class ActivityLogger {
  private logs: ActivityLog[] = []

  log(action: string, resource: string, resourceId: string, details?: any) {
    const logEntry: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date(),
    }

    this.logs.push(logEntry)
    console.log(`[ACTIVITY] ${action} ${resource} ${resourceId}`, details)

    // In a real implementation, you would save to database
    this.persistLog(logEntry)
  }

  private async persistLog(log: ActivityLog) {
    try {
      // This would save to your database
      // await sql`INSERT INTO activity_logs ...`
    } catch (error) {
      console.error("Failed to persist activity log:", error)
    }
  }

  getLogs(): ActivityLog[] {
    return [...this.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getLogsByResource(resource: string): ActivityLog[] {
    return this.logs.filter((log) => log.resource === resource)
  }

  clearLogs() {
    this.logs = []
  }
}

export const activityLogger = new ActivityLogger()

// Helper functions for common activities
export const logSiteCreated = (siteId: string, details?: any) => {
  activityLogger.log("CREATE", "site", siteId, details)
}

export const logSiteUpdated = (siteId: string, details?: any) => {
  activityLogger.log("UPDATE", "site", siteId, details)
}

export const logSiteDeleted = (siteId: string, details?: any) => {
  activityLogger.log("DELETE", "site", siteId, details)
}

export const logProjectCreated = (projectId: string, details?: any) => {
  activityLogger.log("CREATE", "project", projectId, details)
}

export const logProjectUpdated = (projectId: string, details?: any) => {
  activityLogger.log("UPDATE", "project", projectId, details)
}
