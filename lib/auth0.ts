import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  session: {
    // Enable cookie chunking to split large sessions across multiple cookies
    cookie: {
      transient: false,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    // Store session data more compactly
    store: {
      chunking: true, // Split cookies if they get too large
    },
  },
});