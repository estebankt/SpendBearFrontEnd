import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';
import { UserProvider } from '@/lib/providers/user-provider';

export const metadata: Metadata = {
  title: 'SpendBear - Personal Finance Tracker',
  description: 'Track your expenses and manage budgets with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
