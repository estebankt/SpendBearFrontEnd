'use client';

import Link from 'next/link';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUnreadCount } from '@/lib/hooks/use-notifications';
import { useUser } from '@/lib/hooks/use-user';

export interface HeaderProps {
  onQuickAdd?: () => void;
}

/**
 * Header Component
 *
 * Features:
 * - Logo/brand link
 * - Navigation links (desktop)
 * - User menu with dropdown
 * - Notification bell with count
 * - Quick add button
 */
export function Header({ onQuickAdd }: HeaderProps) {
  const { user, isLoading } = useUser();
  const { count: unreadCount } = useUnreadCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🐻</span>
          <span className="font-bold text-xl hidden sm:inline">SpendBear</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/transactions"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Transactions
          </Link>
          <Link
            href="/dashboard/budgets"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Budgets
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Button */}
          <Button
            size="sm"
            onClick={onQuickAdd}
            className="hidden sm:flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {user.given_name?.[0] || user.name?.[0] || 'U'}
                  </div>
                  <span className="hidden md:inline">{user.given_name || user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/auth/logout">Log out</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
