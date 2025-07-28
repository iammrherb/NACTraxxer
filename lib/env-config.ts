export const envConfig = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_URL: process.env.SUPABASE_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,

  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  STACK_PUBLISHABLE_CLIENT_KEY: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY!,

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  // File Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,

  // App Settings
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: "Portnox Deployment Tracker",
  APP_VERSION: "1.0.0",
}

// Validation
const requiredEnvVars = [
  "DATABASE_URL",
  "SUPABASE_SUPABASE_URL",
  "SUPABASE_SUPABASE_ANON_KEY",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_STACK_PROJECT_ID",
  "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY",
  "STACK_SECRET_SERVER_KEY",
]

export function validateEnvConfig() {
  const missing = requiredEnvVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Type-safe environment variable access
export function getEnvVar(key: keyof typeof envConfig): string {
  const value = envConfig[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value.toString()
}
