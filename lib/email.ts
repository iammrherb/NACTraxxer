import nodemailer from "nodemailer"

// Create transporter with environment variables
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP configuration incomplete. Email functionality will be disabled.")
    return null
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: Number.parseInt(process.env.SMTP_PORT) === 465,
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

export interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    console.warn("Email transporter not available. Skipping email send.")
    return false
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function sendSiteStatusNotification(
  siteName: string,
  status: string,
  recipients: string[],
): Promise<boolean> {
  const subject = `Site Status Update: ${siteName}`
  const html = `
    <h2>Site Status Update</h2>
    <p><strong>Site:</strong> ${siteName}</p>
    <p><strong>New Status:</strong> ${status}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>This is an automated notification from the Portnox Deployment Tracker.</p>
  `

  return await sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendDeploymentCompleteNotification(
  siteName: string,
  completionPercentage: number,
  recipients: string[],
): Promise<boolean> {
  const subject = `Deployment Complete: ${siteName}`
  const html = `
    <h2>Deployment Completed</h2>
    <p><strong>Site:</strong> ${siteName}</p>
    <p><strong>Completion:</strong> ${completionPercentage}%</p>
    <p><strong>Completed At:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>Congratulations! The deployment has been successfully completed.</p>
    <p>This is an automated notification from the Portnox Deployment Tracker.</p>
  `

  return await sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendDelayedDeploymentAlert(
  siteName: string,
  plannedEnd: string,
  recipients: string[],
): Promise<boolean> {
  const subject = `Deployment Delay Alert: ${siteName}`
  const html = `
    <h2>Deployment Delay Alert</h2>
    <p><strong>Site:</strong> ${siteName}</p>
    <p><strong>Original Planned End:</strong> ${new Date(plannedEnd).toLocaleDateString()}</p>
    <p><strong>Current Date:</strong> ${new Date().toLocaleDateString()}</p>
    <hr>
    <p>This deployment is past its planned completion date. Please review and update the timeline.</p>
    <p>This is an automated notification from the Portnox Deployment Tracker.</p>
  `

  return await sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendWeeklyProgressReport(
  reportData: {
    totalSites: number
    completedSites: number
    inProgressSites: number
    delayedSites: number
    overallProgress: number
  },
  recipients: string[],
): Promise<boolean> {
  const subject = "Weekly Deployment Progress Report"
  const html = `
    <h2>Weekly Deployment Progress Report</h2>
    <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
    
    <h3>Summary</h3>
    <ul>
      <li><strong>Total Sites:</strong> ${reportData.totalSites}</li>
      <li><strong>Completed Sites:</strong> ${reportData.completedSites}</li>
      <li><strong>In Progress Sites:</strong> ${reportData.inProgressSites}</li>
      <li><strong>Delayed Sites:</strong> ${reportData.delayedSites}</li>
      <li><strong>Overall Progress:</strong> ${reportData.overallProgress}%</li>
    </ul>
    
    <hr>
    <p>This is an automated weekly report from the Portnox Deployment Tracker.</p>
  `

  return await sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendUserInvitation(
  inviteeEmail: string,
  inviterName: string,
  tempPassword: string,
): Promise<boolean> {
  const subject = "Invitation to Portnox Deployment Tracker"
  const html = `
    <h2>You've been invited to join Portnox Deployment Tracker</h2>
    <p>Hello,</p>
    <p><strong>${inviterName}</strong> has invited you to join the Portnox Deployment Tracker system.</p>
    
    <h3>Your Login Credentials</h3>
    <p><strong>Email:</strong> ${inviteeEmail}</p>
    <p><strong>Temporary Password:</strong> ${tempPassword}</p>
    
    <p><strong>Important:</strong> Please change your password after your first login for security.</p>
    
    <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signin" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
    
    <hr>
    <p>If you have any questions, please contact your system administrator.</p>
  `

  return await sendEmail({
    to: inviteeEmail,
    subject,
    html,
  })
}
