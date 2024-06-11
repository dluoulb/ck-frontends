import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: headers,
});

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        contact: { label: "Contact", type: "text" },
        type: { label: "Type", type: "text" },
        verification_code: { label: "Verification Code", type: "number" },
        ui: { label: "UI", type: "text" },
      },
      authorize: async ({ type, contact, verification_code, ui }) => {
        const url = ui ? `/api/users/${ui}/verified` : `/api/users/verified`;

        const result = await api.post(url, {
          type,
          contact,
          verification_code,
        });

        if (result.data.authorized) {
          return result.data;
        } else if (result.data.invalid_code) {
          throw new Error("Invalid Code");
        } else if (result.data.locked) {
          throw new Error("User locked out");
        } else {
          // CONSIDER INVALID ROLES HERE!
          throw new Error("An error occurred");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return user;
      }
      if (Date.now() > token.expires_in) {
        return null;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  jwt: {
    maxAge: 2 * 60 * 60,
  },
  session: {
    maxAge: 2 * 60 * 60,
  },
});
