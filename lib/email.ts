import nodemailer from "nodemailer"

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(emailConfig)

export interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || "noreply@portnox.com",
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string,
  type: "info" | "warning" | "error" = "info",
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${type === "error" ? "#fee2e2" : type === "warning" ? "#fef3c7" : "#dbeafe"}; padding: 20px; border-radius: 8px;">
        <h2 style="color: ${type === "error" ? "#dc2626" : type === "warning" ? "#d97706" : "#2563eb"}; margin-top: 0;">
          ${subject}
        </h2>
        <p style="color: #374151; line-height: 1.6;">
          ${message}
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated notification from the Portnox Deployment Tracker.
        </p>
      </div>
    </div>
  `

  return await sendEmail({
    to,
    subject,
    html,
    text: message,
  })
}

export async function sendDeploymentStatusEmail(
  to: string,
  siteName: string,
  status: string,
  completionPercent: number,
): Promise<boolean> {
  const subject = `Deployment Update: ${siteName} - ${status}`
  const message = `
    The deployment status for ${siteName} has been updated:
    
    Status: ${status}
    Completion: ${completionPercent}%
    
    Please check the deployment tracker for more details.
  `

  return await sendNotificationEmail(to, subject, message, "info")
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log("Email server connection verified")
    return true
  } catch (error) {
    console.error("Email server connection failed:", error)
    return false
  }
}
