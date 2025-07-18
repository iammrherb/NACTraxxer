import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@portnox.com",
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return true
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}

export async function sendDeploymentNotification(
  siteName: string,
  status: string,
  recipients: string[],
): Promise<boolean> {
  const subject = `Deployment Update: ${siteName}`
  const html = `
    <h2>Deployment Status Update</h2>
    <p>Site: <strong>${siteName}</strong></p>
    <p>Status: <strong>${status}</strong></p>
    <p>Updated at: ${new Date().toLocaleString()}</p>
  `

  return sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendWeeklyReport(reportData: any, recipients: string[]): Promise<boolean> {
  const subject = "Weekly Deployment Report"
  const html = `
    <h2>Weekly Deployment Report</h2>
    <p>Total Sites: ${reportData.totalSites}</p>
    <p>Completed: ${reportData.completed}</p>
    <p>In Progress: ${reportData.inProgress}</p>
    <p>Overall Progress: ${reportData.overallProgress}%</p>
  `

  return sendEmail({
    to: recipients,
    subject,
    html,
  })
}
