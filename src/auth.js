// export const runtime = "nodejs";
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import Credentials from "next-auth/providers/credentials"
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import client from "./lib/db"


//  import { User } from "./models/User"
// import bcrypt from "bcryptjs";
// import { connectDB } from "./lib/mongodb";
// export const { handlers, auth, signIn, signOut } = NextAuth({
  
//   session:{
//     strategy: 'jwt'
//   },
//     adapter: MongoDBAdapter(client),

//   providers: [
//     Google({
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//     Credentials({
//       async authorize(credentials) {
//         await connectDB();
//     const user = await User.findOne({ email: credentials.email });
//     if (!user) return null;

//     const validPassword = await bcrypt.compare(credentials.password, user.password);
//     if (!validPassword) return null;

//     return { id: user._id, email: user.email, name: user.name , role: user.role,}; // must return object
//   }
//     })
//   ],
// })


export const runtime = "nodejs";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

import { User } from "./models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(client),

  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!validPassword) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },

  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
});
