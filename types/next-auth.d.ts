import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username: string
      firstName: string
      lastName: string
      isAdmin: boolean
      status: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    username: string
    firstName: string
    lastName: string
    isAdmin: boolean
    status: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    firstName: string
    lastName: string
    isAdmin: boolean
    status: string
  }
} 