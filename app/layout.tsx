import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
