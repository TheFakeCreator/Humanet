'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
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
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <footer className="bg-white border-t mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-600">
                  <p>&copy; 2025 Humanet. Building ideas together.</p>
                </div>
              </div>
            </footer>
          </div>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
