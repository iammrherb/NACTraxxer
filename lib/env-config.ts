export interface EnvironmentConfig {
  isValid: boolean
  errors: string[]
  warnings: string[]
  database: {
    url: string | undefined
    configured: boolean
  }
  smtp: {
    host: string | undefined
    port: string | undefined
    user: string | undefined
    pass: string | undefined
    from: string | undefined
    configured: boolean
  }
}

export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = []
  const warnings: string[] = []

  // Database configuration
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    warnings.push("DATABASE_URL is not set - using fallback data")
  }

  // SMTP configuration (optional)
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = process.env.SMTP_FROM

  const smtpConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPass)
  if (!smtpConfigured) {
    warnings.push("SMTP configuration incomplete - email features disabled")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    database: {
      url: databaseUrl,
      configured: !!databaseUrl,
    },
    smtp: {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      from: smtpFrom,
      configured: smtpConfigured,
    },
  }
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`)
  }
  return value
}

export function getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue
}
