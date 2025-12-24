'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar w-72 h-full flex-shrink-0 hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Logo variant="sidebar" />
        <p className="text-text-muted text-xs mt-1 ml-12">Finance Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'nav-item-active'
                  : 'text-text-muted hover:bg-surface-dark-highlight hover:text-text-main'
              )}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
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
            <p className="text-xs text-text-muted">Pro Member</p>
          </div>
          <a
            href="/auth/logout"
            className="text-text-muted hover:text-text-main transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
