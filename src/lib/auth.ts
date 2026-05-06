import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "./prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name: string
      email: string
      image: string
    }
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? "",
            avatar: user.image,
          },
          create: {
            name: user.name ?? "",
            email: user.email,
            avatar: user.image,
            role: "patient",
            phone: "",
          },
        })
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: { id: true, role: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role as string
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})