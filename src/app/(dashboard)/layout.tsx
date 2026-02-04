import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import AuthGuard from '@/components/providers/AuthGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark">
      {/* Background gradient orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-monokai-purple/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <Sidebar user={session.user} />

      <main className="flex-1 h-full overflow-y-auto relative z-10 p-8">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  );
}
