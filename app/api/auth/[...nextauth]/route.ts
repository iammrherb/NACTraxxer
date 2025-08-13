import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
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

        // Demo users - in production, verify against your database
        const users = [
          {
            id: "1",
            name: "Admin User",
            email: "admin@portnox.com",
            password: "password123",
            role: "admin",
          },
          {
            id: "2",
            name: "Regular User",
            email: "user@portnox.com",
            password: "password123",
            role: "user",
          },
        ]

        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
