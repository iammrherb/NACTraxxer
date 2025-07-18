declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      user_type: string
      permissions: any
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    user_type: string
    permissions: any
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    user_type: string
    permissions: any
  }
}
