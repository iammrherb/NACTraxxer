import nodemailer from "nodemailer"
import { sql } from "./database"

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailNotification {
  recipientId?: number
  recipientEmail: string
  subject: string
  body: string
  notificationType:
    | "site_status_change"
    | "deployment_milestone"
    | "user_assignment"
    | "report_generated"
    | "system_alert"
  siteId?: string
}

export async function sendEmail(notification: EmailNotification) {
  try {
    // Save notification to database
    const result = await sql`
      INSERT INTO email_notifications (
        recipient_id, recipient_email, subject, body, 
        notification_type, site_id, status
      ) VALUES (
        ${notification.recipientId || null}, ${notification.recipientEmail}, 
        ${notification.subject}, ${notification.body}, 
        ${notification.notificationType}, ${notification.siteId || null}, 
        'pending'
      )
      RETURNING id
    `

    const notificationId = result[0].id

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@portnox.com",
      to: notification.recipientEmail,
      subject: notification.subject,
      html: notification.body,
    })

    // Update status to sent
    await sql`
      UPDATE email_notifications 
      SET status = 'sent', sent_at = CURRENT_TIMESTAMP
      WHERE id = ${notificationId}
    `

    return { success: true, id: notificationId }
  } catch (error) {
    console.error("Email send error:", error)

    // Update status to failed if we have the ID
    if (error.notificationId) {
      await sql`
        UPDATE email_notifications 
        SET status = 'failed', error_message = ${error.message}
        WHERE id = ${error.notificationId}
      `
    }

    return { success: false, error: error.message }
  }
}

export async function sendSiteStatusChangeNotification(siteId: string, oldStatus: string, newStatus: string) {
  try {
    // Get site details and stakeholders
    const sites = await sql`
      SELECT s.*, u.name as project_manager_name, u.email as project_manager_email
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      WHERE s.id = ${siteId}
    `

    if (sites.length === 0) return

    const site = sites[0]

    // Get technical owners
    const technicalOwners = await sql`
      SELECT u.email, u.name
      FROM users u
      JOIN site_technical_owners sto ON u.id = sto.user_id
      WHERE sto.site_id = ${siteId}
    `

    const recipients = [{ email: site.project_manager_email, name: site.project_manager_name }]

    technicalOwners.forEach((owner) => {
      if (!recipients.find((r) => r.email === owner.email)) {
        recipients.push({ email: owner.email, name: owner.name })
      }
    })

    const subject = `Site Status Update: ${site.name} (${site.id})`
    const body = `
      <h2>Site Status Change Notification</h2>
      <p>The status of site <strong>${site.name}</strong> (${site.id}) has been updated.</p>
      
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Site Name:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${site.name}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Site ID:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${site.id}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Previous Status:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${oldStatus}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>New Status:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>${newStatus}</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Completion:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${site.completion_percent}%</td>
        </tr>
      </table>
      
      <p>Please log in to the deployment tracker for more details.</p>
      <p><em>This is an automated notification from the Portnox Deployment Tracker.</em></p>
    `

    // Send to all recipients
    for (const recipient of recipients) {
      if (recipient.email) {
        await sendEmail({
          recipientEmail: recipient.email,
          subject,
          body,
          notificationType: "site_status_change",
          siteId,
        })
      }
    }
  } catch (error) {
    console.error("Error sending site status change notification:", error)
  }
}

export async function sendDeploymentMilestoneNotification(siteId: string, milestone: string) {
  try {
    const sites = await sql`
      SELECT s.*, u.name as project_manager_name, u.email as project_manager_email
      FROM sites s
      LEFT JOIN users u ON s.project_manager_id = u.id
      WHERE s.id = ${siteId}
    `

    if (sites.length === 0) return

    const site = sites[0]

    const subject = `Deployment Milestone Reached: ${site.name}`
    const body = `
      <h2>Deployment Milestone Notification</h2>
      <p>A deployment milestone has been reached for site <strong>${site.name}</strong> (${site.id}).</p>
      
      <p><strong>Milestone:</strong> ${milestone}</p>
      <p><strong>Current Progress:</strong> ${site.completion_percent}%</p>
      
      <p>Congratulations on reaching this milestone!</p>
      <p><em>This is an automated notification from the Portnox Deployment Tracker.</em></p>
    `

    if (site.project_manager_email) {
      await sendEmail({
        recipientEmail: site.project_manager_email,
        subject,
        body,
        notificationType: "deployment_milestone",
        siteId,
      })
    }
  } catch (error) {
    console.error("Error sending milestone notification:", error)
  }
}
