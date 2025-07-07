import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import {db} from "@/lib/db";

export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: {email: credentials?.email},
        });
        if (!user) return null;
        const isMatch = await bcrypt.compare(
          credentials?.password,
          user.password
        );
        if (!isMatch) return null;
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({token}: {token: any}) {
      const user = await getUserByEmail({email: token.email});
      token.user = user;
      return token;
    },
    async session({session, token}: {session: any; token: any}) {
      session.user = token.user;
      return session;
    },
  },
};

async function getUserByEmail({email}: {email: any}) {
  const user = await db.user.findUnique({
    where: {email},
  });
  if (!user) {
    throw new Error("Email does not exists.");
  }
  const newUser = {
    ...user,
    id: user.id.toString(),
  };
  return newUser;
}
