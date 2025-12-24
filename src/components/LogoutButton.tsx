'use client';

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main transition-colors"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      Log out
    </a>
  );
}