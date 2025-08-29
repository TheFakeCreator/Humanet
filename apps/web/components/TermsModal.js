import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsModal({ onAccept, onDecline }) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const isAcceptEnabled = hasReadTerms && hasReadPrivacy;

  const handleAccept = () => {
    if (isAcceptEnabled) {
      // Store acceptance in localStorage
      localStorage.setItem(
        'humanet_terms_accepted',
        JSON.stringify({
          version: '1.0',
          date: new Date().toISOString(),
          accepted: true,
        })
      );

      setShowModal(false);
      if (onAccept) onAccept();
    }
  };

  const handleDecline = () => {
    setShowModal(false);
    if (onDecline) onDecline();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to HumaNet
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Open Innovation Platform
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🚀 Open Innovation for Humanity
              </h3>
              <p className="text-blue-800">
                HumaNet is built on the principle of{' '}
                <strong>collaborative innovation</strong>. Before you start
                contributing ideas, please understand our unique approach to
                intellectual property and community collaboration.
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                ⚠️ Important: Understand Before You Contribute
              </h3>
              <div className="space-y-3 text-amber-800">
                <p>
                  <strong>
                    Ideas become part of the open innovation commons
                  </strong>{' '}
                  when posted on HumaNet.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    You <strong>do not retain exclusive rights</strong> to ideas
                    posted here
                  </li>
                  <li>
                    <strong>Repository maintainers</strong> (not original
                    posters) have authority over implementations
                  </li>
                  <li>Anyone can fork, adapt, and build upon your ideas</li>
                  <li>
                    This model accelerates innovation for the benefit of
                    humanity
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms-read"
                    checked={hasReadTerms}
                    onChange={e => setHasReadTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="terms-read"
                      className="text-sm font-medium text-gray-900"
                    >
                      I have read and understand the Terms of Service
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Including the open innovation model and repository
                      maintainer rights
                    </p>
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                    >
                      Read Terms of Service →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy-read"
                    checked={hasReadPrivacy}
                    onChange={e => setHasReadPrivacy(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="privacy-read"
                      className="text-sm font-medium text-gray-900"
                    >
                      I have read and understand the Privacy Policy
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      How we collect, use, and protect your information
                    </p>
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                    >
                      Read Privacy Policy →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                ✨ What You're Joining
              </h3>
              <div className="text-green-800 space-y-2">
                <p>
                  By joining HumaNet, you become part of a community dedicated
                  to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Advancing human progress through shared innovation</li>
                  <li>Fostering collaboration over competition</li>
                  <li>
                    Building a better future through open knowledge sharing
                  </li>
                  <li>
                    Supporting creators while enabling widespread implementation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDecline}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium"
            >
              I Don't Agree
            </button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleAccept}
                disabled={!isAcceptEnabled}
                className={`px-8 py-2 rounded-md text-sm font-medium transition-colors ${
                  isAcceptEnabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Accept & Join HumaNet
              </button>
            </div>
          </div>

          {!isAcceptEnabled && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Please read and acknowledge both documents to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility function to check if terms have been accepted
export function checkTermsAcceptance() {
  if (typeof window === 'undefined') return false;

  try {
    const acceptance = localStorage.getItem('humanet_terms_accepted');
    if (!acceptance) return false;

    const parsed = JSON.parse(acceptance);
    return parsed.accepted === true && parsed.version === '1.0';
  } catch (error) {
    return false;
  }
}

// Utility function to clear terms acceptance (for testing or when terms are updated)
export function clearTermsAcceptance() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('humanet_terms_accepted');
  }
}
