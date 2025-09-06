'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Shield, Eye, Database, Users, Globe, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/auth/register" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">
            Last updated: September 6, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Account Information:</strong> When you create an account, we collect your username, email address, name (if provided), bio, and skills.</p>
              <p><strong>Content Data:</strong> We store the ideas, comments, votes, and other content you create on the platform.</p>
              <p><strong>Usage Data:</strong> We collect information about how you use Humanet, including pages visited, features used, and interaction patterns.</p>
              <p><strong>Technical Data:</strong> We automatically collect IP addresses, browser information, device identifiers, and other technical information.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-green-600" />
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Platform Operation:</strong> To provide, maintain, and improve our services and features.</p>
              <p><strong>Communication:</strong> To send you updates, notifications, and respond to your inquiries.</p>
              <p><strong>Personalization:</strong> To customize your experience and show relevant content and suggestions.</p>
              <p><strong>Analytics:</strong> To understand usage patterns and improve our platform performance.</p>
              <p><strong>Security:</strong> To detect, prevent, and address technical issues and security threats.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-purple-600" />
              3. Information Sharing and Disclosure
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Public Content:</strong> Ideas, comments, and profile information you choose to make public are visible to other users.</p>
              <p><strong>Service Providers:</strong> We may share information with trusted third-party service providers who help us operate the platform.</p>
              <p><strong>Legal Requirements:</strong> We may disclose information if required by law, legal process, or to protect our rights and users' safety.</p>
              <p><strong>Business Transfers:</strong> Information may be transferred in connection with mergers, acquisitions, or other business transactions.</p>
              <p><strong>No Selling:</strong> We do not sell your personal information to third parties for their marketing purposes.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-orange-600" />
              4. Data Storage and Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Data Storage:</strong> Your data is stored securely on servers with appropriate technical and organizational measures.</p>
              <p><strong>Encryption:</strong> Sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols.</p>
              <p><strong>Access Controls:</strong> We implement strict access controls and regularly audit who has access to user data.</p>
              <p><strong>Data Retention:</strong> We retain your information only as long as necessary to provide our services or as required by law.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-red-600" />
              5. Your Privacy Rights
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Access and Update:</strong> You can access and update your account information at any time through your profile settings.</p>
              <p><strong>Data Portability:</strong> You can request a copy of your data in a machine-readable format.</p>
              <p><strong>Deletion:</strong> You can delete your account, which will remove your personal information (public content may remain anonymized).</p>
              <p><strong>Privacy Controls:</strong> You can control the visibility of your profile and ideas through privacy settings.</p>
              <p><strong>Opt-out:</strong> You can opt out of non-essential communications at any time.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-indigo-600" />
              6. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Essential Cookies:</strong> We use cookies necessary for the platform to function, including authentication and security cookies.</p>
              <p><strong>Analytics Cookies:</strong> We use analytics tools to understand how users interact with our platform (you can opt out).</p>
              <p><strong>Preference Cookies:</strong> We store your preferences and settings to enhance your experience.</p>
              <p><strong>Third-party Services:</strong> Some features may use third-party services with their own privacy practices.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              Humanet is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we learn that we have collected such 
              information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Users</h2>
            <p className="text-gray-700">
              Humanet is operated from the United States. If you are located outside the US, 
              please note that information we collect will be transferred to and processed in the US. 
              By using our services, you consent to this transfer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "last updated" date. 
              We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at{' '}
              <a href="mailto:privacy@humanet.dev" className="text-blue-600 hover:text-blue-700 underline">
                privacy@humanet.dev
              </a>{' '}
              or{' '}
              <a href="mailto:hello@humanet.dev" className="text-blue-600 hover:text-blue-700 underline">
                hello@humanet.dev
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: September 6, 2025
            </div>
            <Link 
              href="/auth/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
