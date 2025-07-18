import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "./database"
import { verifyPassword } from "./password"

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
          const [user] = await sql`
            SELECT id, name, email, role, user_type, password_hash, is_active
            FROM users 
            WHERE email = ${credentials.email} AND is_active = true
          `

          if (!user || !user.password_hash) {
            return null
          }

          const isValidPassword = await verifyPassword(credentials.password, user.password_hash)

          if (!isValidPassword) {
            return null
          }

          // Update last login
          await sql`
            UPDATE users 
            SET last_login = NOW() 
            WHERE id = ${user.id}
          `

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            user_type: user.user_type,
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
        token.user_type = user.user_type
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.user_type = token.user_type as string
      }
      return session
    },
  },
}
