'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useCurrentUser, useRegister } from '@/lib/hooks/use-identity';
import { useEffect, useRef } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const { data: backendUser, isLoading: backendLoading, error: backendError } = useCurrentUser();
  const registerMutation = useRegister();
  const attemptedRegister = useRef(false);

  console.log('[AUTHGUARD] State:', {
    auth0User: auth0User?.email ?? null,
    auth0Loading,
    backendUser,
    backendLoading,
    backendError: backendError ? String(backendError) : null,
    registerPending: registerMutation.isPending,
    registerSuccess: registerMutation.isSuccess,
  });

  const is404 =
    backendError &&
    'response' in (backendError as unknown as Record<string, unknown>) &&
    (backendError as unknown as { response?: { status?: number } }).response?.status === 404;

  useEffect(() => {
    if (
      is404 &&
      auth0User &&
      !attemptedRegister.current &&
      !registerMutation.isPending
    ) {
      attemptedRegister.current = true;
      registerMutation.mutate({
        email: auth0User.email || '',
        firstName: auth0User.given_name || auth0User.nickname || 'User',
        lastName: auth0User.family_name || '',
      });
    }
  }, [is404, auth0User, registerMutation]);

  // Show loading while Auth0 or backend user is loading, or while registering
  if (auth0Loading || backendLoading || registerMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an error that's not a 404 (and not a registration attempt), show error
  if (backendError && !is404 && !registerMutation.isSuccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary">error</span>
          <p className="text-sm text-text-muted">Failed to load user profile</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
