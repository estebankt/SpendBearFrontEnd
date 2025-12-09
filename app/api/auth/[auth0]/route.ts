import { auth0 } from '@/lib/auth0';

/**
 * Auth0 Route Handler
 *
 * This catch-all route handles all Auth0 authentication flows:
 * - GET /api/auth/login - Initiates login
 * - GET /api/auth/logout - Logs user out
 * - GET /api/auth/callback - OAuth callback after Auth0 login
 * - GET /api/auth/me - Returns current user profile
 */
export const GET = auth0.handleAuth();
