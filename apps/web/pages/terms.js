import Layout from '../components/Layout';
import Link from 'next/link';

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              <strong>Last Updated:</strong> July 4, 2025
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                HumaNet Open Innovation Platform
              </h2>
              <p className="text-blue-800">
                Welcome to HumaNet, an open innovation platform designed to
                foster collaboration and advance human progress through shared
                ideas and collective development.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Platform Purpose & Philosophy
              </h2>
              <div className="space-y-4">
                <p>
                  HumaNet is built on the principle of{' '}
                  <strong>open innovation for humanity</strong>. Our platform
                  serves as a hub where individuals can pitch ideas, collaborate
                  on projects, and contribute to the advancement of mankind
                  through shared knowledge and collective effort.
                </p>
                <p>
                  By using this platform, you acknowledge and agree that HumaNet
                  operates under an <strong>open innovation model</strong>{' '}
                  designed to maximize societal benefit and technological
                  progress.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Idea Submission & Intellectual Property
              </h2>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">
                  ⚠️ Important: Open Innovation Model
                </h3>
                <p className="text-amber-800">
                  <strong>
                    By posting an idea on HumaNet, you are contributing to an
                    open innovation ecosystem.
                  </strong>
                  Please read and understand the implications below before
                  submitting any content.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.1 Idea Contribution Terms
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Open Contribution:</strong> When you post an idea
                      on HumaNet, you are contributing it to the open innovation
                      community for collaborative development and
                      implementation.
                    </li>
                    <li>
                      <strong>No Exclusive Rights:</strong> Posting an idea does
                      not grant you exclusive rights to that idea unless you are
                      actively maintaining and developing it through your own
                      repository or project.
                    </li>
                    <li>
                      <strong>Community Ownership:</strong> Ideas posted on
                      HumaNet become part of the shared knowledge base for
                      community development and collaboration.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.2 Repository Maintainer Rights
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Maintainer Authority:</strong> The individual or
                      entity who creates and actively maintains a repository,
                      project, or implementation based on an idea becomes the{' '}
                      <strong>maintainer</strong> of that specific
                      implementation.
                    </li>
                    <li>
                      <strong>Development Rights:</strong> Repository
                      maintainers have the right to make decisions about their
                      specific implementation, including licensing, direction,
                      and collaboration terms.
                    </li>
                    <li>
                      <strong>Original Poster vs. Maintainer:</strong> The
                      original idea poster and the repository maintainer may be
                      different individuals.{' '}
                      <strong>
                        Repository maintainership takes precedence
                      </strong>{' '}
                      over idea origination for implementation-specific
                      decisions.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.3 Collaborative Development
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Fork Rights:</strong> Any user may fork, adapt, or
                      build upon ideas posted on HumaNet in accordance with open
                      innovation principles.
                    </li>
                    <li>
                      <strong>Multiple Implementations:</strong> The same idea
                      may be implemented by multiple maintainers in different
                      ways, fostering innovation diversity.
                    </li>
                    <li>
                      <strong>Attribution:</strong> While not legally required,
                      we encourage attribution to original idea contributors as
                      a matter of community respect and recognition.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2.4 Original Contributor Recognition
                  </h3>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <p className="text-green-800">
                      <strong>
                        HumaNet values and respects original idea contributors.
                      </strong>
                    </p>
                  </div>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Community Recognition:</strong> Original idea
                      contributors are valued members of the HumaNet community
                      and their contributions are recognized and respected.
                    </li>
                    <li>
                      <strong>Attribution Standards:</strong> We strongly
                      encourage all implementers to credit original idea
                      contributors in their projects, documentation, and public
                      communications.
                    </li>
                    <li>
                      <strong>Platform Visibility:</strong> Original
                      contributors maintain visibility and recognition on the
                      platform for their creative contributions to the
                      innovation ecosystem.
                    </li>
                    <li>
                      <strong>Community Standing:</strong> Contributing original
                      ideas builds reputation and standing within the HumaNet
                      community, fostering collaboration opportunities.
                    </li>
                    <li>
                      <strong>Respectful Collaboration:</strong> While
                      maintainers have implementation authority, we expect all
                      community members to treat original contributors with
                      respect and consideration.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3.1 Content Guidelines
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Submit original ideas or properly attributed collaborative
                      concepts
                    </li>
                    <li>
                      Ensure your submissions do not violate existing patents,
                      copyrights, or trade secrets
                    </li>
                    <li>
                      Provide clear, constructive, and detailed descriptions of
                      your ideas
                    </li>
                    <li>
                      Respect other users and maintain professional
                      communication
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3.2 Prohibited Activities
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Posting proprietary information belonging to others
                      without permission
                    </li>
                    <li>
                      Attempting to claim exclusive rights to ideas after
                      posting them publicly
                    </li>
                    <li>
                      Harassment, discrimination, or abusive behavior toward
                      other users
                    </li>
                    <li>Spam, malicious content, or irrelevant submissions</li>
                    <li>
                      Attempting to commercialize the platform or user data
                      without permission
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Platform Rights & Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4.1 HumaNet's Role
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Provide a platform for open innovation and collaboration
                    </li>
                    <li>
                      Facilitate connections between idea contributors and
                      implementers
                    </li>
                    <li>Maintain platform infrastructure and security</li>
                    <li>
                      Moderate content to ensure compliance with these terms
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4.2 Content Moderation
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      HumaNet reserves the right to remove content that violates
                      these terms
                    </li>
                    <li>
                      We may suspend or terminate accounts for repeated
                      violations
                    </li>
                    <li>
                      Content moderation decisions are final and at our
                      discretion
                    </li>
                    <li>
                      We are not responsible for the accuracy or feasibility of
                      posted ideas
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Disclaimers & Liability
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.1 No Warranties
                  </h3>
                  <p>
                    HumaNet is provided "as is" without warranties of any kind.
                    We do not guarantee the accuracy, completeness, or
                    feasibility of any ideas posted on the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.2 Limitation of Liability
                  </h3>
                  <p>
                    HumaNet and its operators shall not be liable for any
                    damages arising from the use of this platform, including but
                    not limited to disputes over intellectual property, failed
                    collaborations, or commercial losses.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.3 User Responsibility
                  </h3>
                  <p>
                    Users are solely responsible for their contributions,
                    collaborations, and any legal or commercial implications of
                    their activities on the platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data & Privacy
              </h2>
              <div className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    We collect minimal user data necessary for platform
                    operation
                  </li>
                  <li>
                    All posted ideas and content are considered public
                    information
                  </li>
                  <li>We do not sell user data to third parties</li>
                  <li>
                    Analytics and usage data may be collected for platform
                    improvement
                  </li>
                  <li>
                    Users may request account deletion, but posted ideas remain
                    in the public domain
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Termination
              </h2>
              <div className="space-y-4">
                <p>
                  Either party may terminate the use of HumaNet at any time.
                  Upon termination:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>User access to the platform will be revoked</li>
                  <li>
                    Previously posted ideas remain part of the public knowledge
                    base
                  </li>
                  <li>
                    Ongoing collaborations may continue independently of the
                    platform
                  </li>
                  <li>
                    These terms continue to apply to content posted before
                    termination
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Governing Law & Disputes
              </h2>
              <div className="space-y-4">
                <p>
                  These terms are governed by applicable laws regarding open
                  innovation and intellectual property. Disputes should be
                  resolved through good faith negotiation, with mediation as a
                  preferred alternative to litigation.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Updates to Terms
              </h2>
              <div className="space-y-4">
                <p>
                  HumaNet reserves the right to update these terms as the
                  platform evolves. Users will be notified of material changes,
                  and continued use of the platform constitutes acceptance of
                  updated terms.
                </p>
              </div>
            </section>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-3">
                Our Commitment to Open Innovation
              </h2>
              <p className="text-green-800">
                HumaNet is committed to fostering a collaborative environment
                where ideas can flourish and contribute to human progress. We
                believe that open innovation, when properly structured, benefits
                everyone involved and accelerates positive change in the world.
              </p>
            </div>

            <div className="text-center pt-8 border-t">
              <p className="text-gray-600 mb-4">
                By using HumaNet, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Accept & Continue to Platform
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
