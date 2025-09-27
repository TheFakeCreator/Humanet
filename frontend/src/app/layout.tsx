'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from '@/contexts/LoadingContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <div className="min-h-screen flex flex-col">
              <Header />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </LoadingProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
