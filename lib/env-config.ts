interface EnvConfig {
  DATABASE_URL: string
  NODE_ENV: string
  PORT: string
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASS?: string
  SMTP_FROM?: string
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value || defaultValue!
}

export const envConfig: EnvConfig = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  PORT: getEnvVar("PORT", "3000"),
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
}

export const isDevelopment = envConfig.NODE_ENV === "development"
export const isProduction = envConfig.NODE_ENV === "production"
export const isTest = envConfig.NODE_ENV === "test"

// Validate required environment variables
export function validateEnvConfig() {
  const requiredVars = ["DATABASE_URL"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
