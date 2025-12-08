import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { Header } from '@/components/shared/header';
import { Sidebar } from '@/components/shared/sidebar';
import { MobileNav } from '@/components/shared/mobile-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - visible on all screen sizes */}
      <Header />

      <div className="flex">
        {/* Sidebar - desktop only */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 lg:min-h-[calc(100vh-4rem)]">
          <div className="container max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile navigation - mobile only */}
      <MobileNav />
    </div>
  );
}
