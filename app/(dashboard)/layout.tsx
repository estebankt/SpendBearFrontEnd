import { redirect } from 'next/navigation';
import { Navigation } from '@/components/shared/Navigation';
import { auth0 } from '@/lib/auth0';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
