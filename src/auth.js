export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ 
            $or: [
              { email: credentials.email.toLowerCase() },
              { username: credentials.email.toLowerCase() }
            ]
          });
          
          if (!user) {
            throw new Error("Invalid email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before login.");
          }

          if (user.role !== "admin" && !user.adminFeePaid) {
            throw new Error("Please complete admin fee payment");
          }

          const validPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!validPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            username: user.username,
            referredBy: user.referredBy
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.username = user.username;
        token.referredBy = user.referredBy;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.username = token.username;
        session.user.referredBy = token.referredBy;
      }
      return session;
    },
  },

  events: {
    async signIn(message) {
      /* log successful sign-ins */
      console.log("Successful sign-in:", message);
    },
    async signOut(message) {
      /* clear user sessions */
      console.log("Sign-out:", message);
    },
    async error(message) {
      /* log authentication errors */
      console.error("Auth error:", message);
    }
  }
});
