import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, setCurrentUser } from '../utils/activityTracking';
import TermsModal, { checkTermsAcceptance } from './TermsModal';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Pages where terms modal should not appear
  const excludeTermsModalPages = ['/terms', '/privacy'];
  const shouldShowTermsModal = !excludeTermsModalPages.includes(
    router.pathname
  );

  useEffect(() => {
    setCurrentUserState(getCurrentUser());

    // Check if user has accepted terms, but only show modal on appropriate pages
    if (shouldShowTermsModal) {
      const hasAcceptedTerms = checkTermsAcceptance();
      if (!hasAcceptedTerms) {
        setShowTermsModal(true);
      }
    }
  }, [shouldShowTermsModal]);

  const handleUserChange = username => {
    setCurrentUser(username);
    setCurrentUserState(username);
    setShowUserModal(false);
  };

  const handleTermsAccept = () => {
    setShowTermsModal(false);
  };

  const handleTermsDecline = () => {
    // Redirect away from the platform or show a message
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                HumaNet
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Ideas
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Favorites
              </Link>
              <Link
                href="/analytics"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </Link>
              <ThemeToggle size="sm" />
              <Link
                href="/new"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Post Idea
              </Link>
              <button
                onClick={() => setShowUserModal(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md"
              >
                User: {currentUser}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Switch Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-600">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Switch User
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Choose a username for activity tracking (demo purposes)
              </p>
              <div className="space-y-2">
                {['Alice', 'Bob', 'Charlie', 'Diana', 'Anonymous'].map(
                  username => (
                    <button
                      key={username}
                      onClick={() => handleUserChange(username)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        currentUser === username
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {username}
                    </button>
                  )
                )}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter custom username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  onKeyPress={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleUserChange(e.target.value.trim());
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <TermsModal
          onAccept={handleTermsAccept}
          onDecline={handleTermsDecline}
        />
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                HumaNet
              </Link>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                An open innovation platform fostering collaboration and
                advancing human progress through shared ideas and collective
                development.
              </p>
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Built for humanity, powered by collaboration.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Platform
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Ideas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Post Idea
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Open Innovation Model
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Ideas shared become part of the collaborative commons
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2025 HumaNet. Open innovation for humanity.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-xs text-gray-400">
                  By using this platform, you agree to contribute to open
                  innovation and acknowledge that repository maintainers have
                  authority over implementations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
