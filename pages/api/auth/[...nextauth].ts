import api from 'lib/api';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        contact: { label: 'Contact', type: 'text' },
        type: { label: 'Type', type: 'text' },
        verification_code: { label: 'Verification Code', type: 'number' },
        ui: { label: 'UI', type: 'text' },
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
          throw new Error('Invalid Code');
        } else if (result.data.locked) {
          throw new Error('User locked out');
        } else {
          // CONSIDER INVALID ROLES HERE!
          throw new Error('An error occurred');
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user.user;
        token.accessToken = user.token.access_token;
        token.refreshToken = user.token.refresh_token;
        token.expires = Date.now() + user.token.expires_in * 1000;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user;
        session.access_token = token.accessToken;
        session.expires = new Date(token.expires).toISOString();
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 2 * 60 * 60,
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60,
  },
});
