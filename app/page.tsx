import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export default async function Home() {
  try {
    const session = await auth0.getSession();
    if (session?.user) {
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error getting session:', error);
  }

  return (
    <main>
      <h1>SpendBear</h1>
      <a href="/api/auth/login">Login</a>
    </main>
  );
}
