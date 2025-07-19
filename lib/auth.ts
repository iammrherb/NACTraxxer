import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@/lib/database"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const users = await sql`
            SELECT id, name, email, password_hash, role, user_type, is_active
            FROM users 
            WHERE email = ${credentials.email}
            LIMIT 1
          `

          const user = users[0]

          if (!user || !user.is_active) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await sql`
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = ${user.id}
          `

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            userType: user.user_type,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.userType = user.userType
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.userType = token.userType as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
