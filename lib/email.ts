import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

// Create transporter with error handling
const createTransporter = (): Transporter | null => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP configuration incomplete. Email functionality will be disabled.")
      return null
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: Number.parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    return null
  }
}

const transporter = createTransporter()

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  if (!transporter) {
    console.warn("Email transporter not available. Skipping email sending.")
    return { success: false, error: "Email transporter not configured." }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email sending error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: errorMessage }
  }
}

export async function sendSiteUpdateNotification(siteData: any, userEmail: string) {
  const subject = `Site Update: ${siteData.name}`
  const html = `
    <h2>Site Update Notification</h2>
    <p>The following site has been updated:</p>
    <ul>
      <li><strong>Site:</strong> ${siteData.name}</li>
      <li><strong>Status:</strong> ${siteData.status}</li>
      <li><strong>Progress:</strong> ${siteData.completion_percent}%</li>
    </ul>
    <p>Please review the changes in the POC Tracker dashboard.</p>
  `
  const result = await sendEmail({ to: userEmail, subject, html })
  return result.success
}

export async function sendTestCompletionNotification(testData: any, userEmail: string) {
  const subject = `Test Completed: ${testData.name}`
  const html = `
    <h2>Test Completion Notification</h2>
    <p>A test case has been completed:</p>
    <ul>
      <li><strong>Test Case:</strong> ${testData.name}</li>
      <li><strong>Status:</strong> ${testData.status}</li>
      <li><strong>Result:</strong> ${testData.result}</li>
    </ul>
    <p>View details in the POC Tracker dashboard.</p>
  `
  const result = await sendEmail({ to: userEmail, subject, html })
  return result.success
}

export async function sendWeeklyReport(reportData: any, userEmail: string) {
  const subject = "Weekly POC Progress Report"
  const html = `
    <h2>Weekly POC Progress Report</h2>
    <p>Here's your weekly progress summary:</p>
    <ul>
      <li><strong>Total Use Cases:</strong> ${reportData.totalUseCases}</li>
      <li><strong>Completed:</strong> ${reportData.completedUseCases}</li>
      <li><strong>In Progress:</strong> ${reportData.inProgressUseCases}</li>
      <li><strong>Overall Progress:</strong> ${reportData.overallProgress}%</li>
    </ul>
    <p>Access the full dashboard for detailed information.</p>
  `
  const result = await sendEmail({ to: userEmail, subject, html })
  return result.success
}
