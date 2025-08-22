import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const demoUsers = [
          {
            id: "1",
            email: "admin@portnox.com",
            password: "admin123",
            name: "Admin User",
            role: "admin",
          },
          {
            id: "2",
            email: "user@portnox.com",
            password: "user123",
            name: "Standard User",
            role: "user",
          },
        ]

        const { email, password } = credentials || {}
        const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

        if (foundUser) {
          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: session.user?.name || "",
        email: session.user?.email || "",
        role: token.role as string,
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
