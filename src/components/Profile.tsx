'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text-muted">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark-highlight">
      {user.picture ? (
        <img
          src={user.picture}
          alt={user.name || 'User'}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {user.name?.charAt(0) || 'U'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-main truncate">
          {user.name || 'User'}
        </p>
        <p className="text-xs text-text-muted truncate">
          {user.email || 'No email'}
        </p>
      </div>
    </div>
  );
}