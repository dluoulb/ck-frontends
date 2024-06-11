import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    created_at?: number;
    user: {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      role?: string;
      is_phone_verified?: boolean;
      [key: string]: any;
    };
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    is_phone_verified: boolean;
    [key: string]: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    created_at?: number;
    [key: string]: any;
  }
}
