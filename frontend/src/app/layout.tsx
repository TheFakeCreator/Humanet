'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                      <a href="/" className="hover:text-primary-600">
                        Humanet
                      </a>
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex space-x-8">
                    <a
                      href="/ideas"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Ideas
                    </a>
                    <a
                      href="/ideas/new"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Idea
                    </a>
                  </nav>

                  <div className="flex items-center space-x-4">
                    <a
                      href="/auth/login"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </a>
                    <a
                      href="/auth/signup"
                      className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </header>

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
      </body>
    </html>
  );
}
