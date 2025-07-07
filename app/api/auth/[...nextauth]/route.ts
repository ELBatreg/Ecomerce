import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          emailVerified: null,
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}); 