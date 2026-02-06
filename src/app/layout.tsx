import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { Toaster } from "sonner";
import QueryProvider from "@/lib/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendBear - Minimalist Spend Tracker",
  description: "Stop wondering where your money went. SpendBear is the minimalist tracker designed for clarity, built for modern spenders who value data over clutter.",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-dark text-text-main font-display antialiased selection:bg-primary selection:text-white">
        <Auth0Provider>
          <QueryProvider>
            {children}
          </QueryProvider>
          <Toaster theme="dark" position="bottom-right" richColors />
        </Auth0Provider>
      </body>
    </html>
  );
}