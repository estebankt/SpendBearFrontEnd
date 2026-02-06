'use client';

import { useCurrentUser } from '@/lib/hooks/use-identity';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  const { data: user, isLoading, isError } = useCurrentUser();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Settings</h1>
        <p className="text-text-muted">
          Manage your account preferences and profile information
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Profile Information</h2>
              <p className="text-text-muted text-sm">Your account details fetched from identity service</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-white/5 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
              Failed to load profile data. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">First Name</label>
                <div className="px-4 py-3 bg-surface-dark-highlight rounded-lg text-text-main border border-white/5">
                  {user?.firstName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Last Name</label>
                <div className="px-4 py-3 bg-surface-dark-highlight rounded-lg text-text-main border border-white/5">
                  {user?.lastName || 'Not set'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                <div className="px-4 py-3 bg-surface-dark-highlight rounded-lg text-text-main border border-white/5">
                  {user?.email}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-2">User ID</label>
                <div className="px-4 py-3 bg-surface-dark-highlight rounded-lg text-text-muted text-xs font-mono border border-white/5">
                  {user?.id}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Security Card Placeholder */}
        <Card className="p-8 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl text-monokai-orange">lock</span>
              <div>
                <h2 className="text-lg font-bold text-text-main">Security</h2>
                <p className="text-text-muted text-sm">Manage your password and authentication</p>
              </div>
            </div>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-text-muted uppercase tracking-wider">Coming Soon</span>
          </div>
        </Card>

        {/* Notifications Card Placeholder */}
        <Card className="p-8 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl text-monokai-green">notifications</span>
              <div>
                <h2 className="text-lg font-bold text-text-main">Notifications</h2>
                <p className="text-text-muted text-sm">Configure how you want to be alerted</p>
              </div>
            </div>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-text-muted uppercase tracking-wider">Coming Soon</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
