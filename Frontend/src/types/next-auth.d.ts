import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
    };
  }
}