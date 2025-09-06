'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Shield, Users, Database, Globe } from 'lucide-react';

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
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
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Humanet ("the Platform"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700">
              Humanet is a platform for sharing, evolving, and collaborating on innovative ideas. These terms 
              govern your use of our services and your relationship with us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-green-600" />
              2. User Accounts and Responsibilities
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Account Creation:</strong> You must provide accurate and complete information when creating your account.</p>
              <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p><strong>Content Responsibility:</strong> You are solely responsible for the content you post, including ideas, comments, and other contributions.</p>
              <p><strong>Prohibited Activities:</strong> You agree not to use the platform for any unlawful purpose or in any way that could damage our services.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-purple-600" />
              3. Intellectual Property and Content
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Your Content:</strong> You retain ownership of the intellectual property rights to the content you create and share on Humanet.</p>
              <p><strong>License to Humanet:</strong> By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content for the purpose of operating the platform.</p>
              <p><strong>Community Content:</strong> When you fork or build upon others' ideas, you acknowledge their original contribution while maintaining ownership of your modifications.</p>
              <p><strong>Respect for IP:</strong> You agree not to post content that infringes on others' intellectual property rights.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-orange-600" />
              4. Platform Usage and Community Guidelines
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Respectful Interaction:</strong> Maintain a professional and respectful tone in all interactions.</p>
              <p><strong>Quality Content:</strong> Share meaningful, well-thought-out ideas that contribute value to the community.</p>
              <p><strong>No Spam or Abuse:</strong> Avoid posting repetitive, promotional, or abusive content.</p>
              <p><strong>Privacy Respect:</strong> Do not share others' personal information without consent.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Humanet is provided "as is" without any warranties, expressed or implied. We do not guarantee 
              the accuracy, completeness, or usefulness of any information on the platform.
            </p>
            <p className="text-gray-700">
              In no event shall Humanet be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising out of your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modifications to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Users will be notified of significant 
              changes via email or platform notifications. Continued use of the platform after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@humanet.dev" className="text-blue-600 hover:text-blue-700 underline">
                legal@humanet.dev
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
