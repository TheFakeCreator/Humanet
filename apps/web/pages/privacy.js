import Layout from '../components/Layout';
import Link from 'next/link';

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              <strong>Last Updated:</strong> July 4, 2025
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Privacy-First Open Innovation
              </h2>
              <p className="text-blue-800">
                HumaNet is committed to protecting your privacy while fostering
                an open innovation environment. This policy explains how we
                collect, use, and protect your information.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.1 Account Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Username and display name</li>
                    <li>Email address (for account management)</li>
                    <li>Profile information you choose to share</li>
                    <li>Account creation and last login dates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.2 Content Data
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ideas, descriptions, and comments you post</li>
                    <li>Tags and categorizations you assign</li>
                    <li>
                      Interactions with other users' content (views, forks,
                      etc.)
                    </li>
                    <li>Files and attachments you upload</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.3 Usage Analytics
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Platform usage patterns and feature interactions</li>
                    <li>Search queries and filter preferences</li>
                    <li>Time spent on different sections</li>
                    <li>Device and browser information</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.1 Platform Operation
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and maintain the HumaNet platform</li>
                    <li>Enable user authentication and account management</li>
                    <li>Facilitate idea sharing and collaboration</li>
                    <li>Process and display user-generated content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.2 Platform Improvement
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage patterns to improve user experience</li>
                    <li>Develop new features and functionality</li>
                    <li>Optimize platform performance and reliability</li>
                    <li>Generate anonymized analytics and insights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.3 Community Features
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Display user activity and contribution statistics</li>
                    <li>Enable search and discovery of ideas and users</li>
                    <li>Provide trending and recommendation features</li>
                    <li>Facilitate collaboration and networking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Information Sharing & Disclosure
              </h2>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  ✅ What We Share
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-green-800">
                  <li>Ideas and content you post publicly on the platform</li>
                  <li>
                    Your username and profile information (as you choose to
                    share)
                  </li>
                  <li>Aggregated, anonymized usage statistics</li>
                  <li>Information required by law or legal process</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">
                  ❌ What We Don't Share
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-red-800">
                  <li>Your email address or private contact information</li>
                  <li>
                    Individual user data to third parties for commercial
                    purposes
                  </li>
                  <li>Private messages or communications</li>
                  <li>Personal analytics or behavioral data</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Storage & Security
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4.1 Data Protection
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Industry-standard encryption for data transmission and
                      storage
                    </li>
                    <li>
                      Regular security audits and vulnerability assessments
                    </li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure backup and recovery procedures</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4.2 Data Retention
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account data: Retained while your account is active</li>
                    <li>
                      Public content: Retained indefinitely as part of the open
                      innovation commons
                    </li>
                    <li>Usage analytics: Retained for up to 24 months</li>
                    <li>
                      Deleted accounts: Personal data removed, but public
                      contributions remain
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Your Rights & Choices
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.1 Account Control
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Update your profile information and preferences</li>
                    <li>
                      Control the visibility of your activity and contributions
                    </li>
                    <li>
                      Delete your account (personal data removed, public content
                      remains)
                    </li>
                    <li>Export your data in standard formats</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.2 Communication Preferences
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Opt out of non-essential communications</li>
                    <li>Control notification settings</li>
                    <li>Choose how others can contact you</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies & Tracking
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    6.1 Essential Cookies
                  </h3>
                  <p>
                    We use essential cookies for authentication, security, and
                    basic platform functionality. These cannot be disabled
                    without affecting platform operation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    6.2 Analytics Cookies
                  </h3>
                  <p>
                    We use analytics cookies to understand how users interact
                    with the platform and improve the user experience. These can
                    be disabled in your browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Third-Party Services
              </h2>

              <div className="space-y-4">
                <p>
                  HumaNet may integrate with third-party services for enhanced
                  functionality:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    OAuth providers for authentication (Google, GitHub, etc.)
                  </li>
                  <li>Analytics services for platform improvement</li>
                  <li>Cloud storage providers for data hosting</li>
                  <li>CDN services for content delivery</li>
                </ul>
                <p>
                  These services have their own privacy policies and terms of
                  service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>

              <div className="space-y-4">
                <p>
                  HumaNet is not intended for use by children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  such information, we will take steps to remove it.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Users
              </h2>

              <div className="space-y-4">
                <p>
                  HumaNet is operated globally. By using the platform, you
                  consent to the processing of your information in accordance
                  with this privacy policy, regardless of your location.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to This Policy
              </h2>

              <div className="space-y-4">
                <p>
                  We may update this privacy policy from time to time. We will
                  notify users of material changes and provide the updated
                  policy with a revised effective date.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Information
              </h2>

              <div className="space-y-4">
                <p>
                  For questions about this privacy policy or your personal
                  information, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: privacy@humanet.dev</li>
                  <li>Platform: Contact form in user settings</li>
                  <li>Address: [Your organization's address]</li>
                </ul>
              </div>
            </section>

            <div className="text-center pt-8 border-t">
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. We're committed to transparency
                and giving you control over your information.
              </p>
              <div className="space-x-4">
                <Link
                  href="/terms"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
