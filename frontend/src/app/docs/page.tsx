'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen,
  ChevronRight,
  ChevronDown,
  Home,
  Users,
  Lightbulb,
  GitFork,
  MessageCircle,
  Settings,
  Code,
  Database,
  Shield,
  Zap,
  Globe,
  Search,
  ExternalLink
} from 'lucide-react';

export default function DocsPage() {
  const [activePage, setActivePage] = useState('introduction');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started', 'user-guide']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sidebarSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      pages: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'quick-start', title: 'Quick Start Guide' },
        { id: 'installation', title: 'Installation' },
        { id: 'first-idea', title: 'Your First Idea' }
      ]
    },
    {
      id: 'user-guide',
      title: 'User Guide',
      icon: Users,
      pages: [
        { id: 'creating-ideas', title: 'Creating Ideas' },
        { id: 'voting-system', title: 'Voting & Interactions' },
        { id: 'commenting', title: 'Commenting System' },
        { id: 'idea-forking', title: 'Forking Ideas' },
        { id: 'profile-management', title: 'Profile Management' }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: Lightbulb,
      pages: [
        { id: 'idea-evolution', title: 'Idea Evolution' },
        { id: 'family-trees', title: 'Family Tree Visualization' },
        { id: 'domain-categories', title: 'Domain Categories' },
        { id: 'search-discovery', title: 'Search & Discovery' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      pages: [
        { id: 'api-overview', title: 'API Overview' },
        { id: 'authentication', title: 'Authentication' },
        { id: 'ideas-endpoint', title: 'Ideas Endpoint' },
        { id: 'users-endpoint', title: 'Users Endpoint' },
        { id: 'comments-endpoint', title: 'Comments Endpoint' }
      ]
    },
    {
      id: 'developers',
      title: 'Developers',
      icon: Database,
      pages: [
        { id: 'architecture', title: 'System Architecture' },
        { id: 'database-schema', title: 'Database Schema' },
        { id: 'contributing', title: 'Contributing Guide' },
        { id: 'deployment', title: 'Deployment' }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      pages: [
        { id: 'security-overview', title: 'Security Overview' },
        { id: 'data-privacy', title: 'Data Privacy' },
        { id: 'rate-limiting', title: 'Rate Limiting' },
        { id: 'best-practices', title: 'Security Best Practices' }
      ]
    }
  ];

  const getPageContent = (pageId: string) => {
    switch (pageId) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Humanet</h1>
              <p className="text-xl text-gray-600 mb-6">
                Humanet is the world's first idea evolution platform where innovative concepts grow, branch, and evolve through community collaboration.
              </p>
              <div className="flex gap-4 mb-8">
                <Badge className="bg-blue-100 text-blue-800">
                  <Zap className="w-4 h-4 mr-2" />
                  Open Source
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Globe className="w-4 h-4 mr-2" />
                  Global Community
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <GitFork className="w-4 h-4 mr-2" />
                  Idea Evolution
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What is Humanet?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Humanet revolutionizes how ideas are shared, developed, and evolved. Unlike traditional platforms where ideas remain static, 
                  Humanet allows concepts to branch and evolve through community input, creating family trees of innovation.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Idea Forking:</strong> Create variations and improvements of existing ideas</li>
                  <li><strong>Community Collaboration:</strong> Vote, comment, and build upon others' concepts</li>
                  <li><strong>Evolution Tracking:</strong> Visualize how ideas grow and branch over time</li>
                  <li><strong>Domain Organization:</strong> Categories spanning technology, healthcare, sustainability, and more</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Idea Creation</h4>
                      <p className="text-sm text-gray-600">Share your innovative concepts with the community</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GitFork className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Forking System</h4>
                      <p className="text-sm text-gray-600">Build upon existing ideas to create variations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Community Voting</h4>
                      <p className="text-sm text-gray-600">Democratic evaluation of ideas and concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Discussion System</h4>
                      <p className="text-sm text-gray-600">Engage in meaningful conversations about ideas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <BookOpen className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Ready to get started?</h3>
                  <p className="text-blue-700 mt-1">
                    Follow our Quick Start Guide to create your first idea and join the innovation community.
                  </p>
                  <Button 
                    className="mt-3" 
                    onClick={() => setActivePage('quick-start')}
                  >
                    Get Started <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quick-start':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quick Start Guide</h1>
            <p className="text-xl text-gray-600 mb-8">
              Get up and running with Humanet in just a few minutes. This guide will walk you through creating your account, 
              sharing your first idea, and engaging with the community.
            </p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Create Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Start by creating your Humanet account. You'll need a username, email, and secure password.
                  </p>
                  <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-300">
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> Choose a username that represents you well - it will be visible on all your ideas and contributions.
                    </p>
                  </div>
                  <Link href="/auth/register">
                    <Button className="mt-4">
                      Create Account <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Share Your First Idea
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Once logged in, share your innovative concept with the community. Include a clear title, detailed description, 
                    and relevant domain categories.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">What makes a great idea post:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Clear, descriptive title that captures the essence</li>
                      <li>Detailed explanation of the concept and its value</li>
                      <li>Specific domain tags (Technology, Healthcare, etc.)</li>
                      <li>Consider potential applications and impact</li>
                    </ul>
                  </div>
                  <Link href="/ideas/new">
                    <Button className="mt-4">
                      Share an Idea <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Engage with the Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Explore other ideas, vote on concepts you find interesting, and participate in discussions. 
                    This is how the community grows and ideas evolve.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-semibold text-green-800 mb-2">Upvote Ideas</h4>
                      <p className="text-sm text-green-700">Show support for concepts you believe in</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-semibold text-blue-800 mb-2">Leave Comments</h4>
                      <p className="text-sm text-blue-700">Provide feedback and suggestions</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <h4 className="font-semibold text-purple-800 mb-2">Fork Ideas</h4>
                      <p className="text-sm text-purple-700">Create variations and improvements</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <h4 className="font-semibold text-orange-800 mb-2">Follow Trends</h4>
                      <p className="text-sm text-orange-700">Stay updated on popular concepts</p>
                    </div>
                  </div>
                  <Link href="/ideas">
                    <Button className="mt-4">
                      Explore Ideas <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'creating-ideas':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Creating Ideas</h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn how to create compelling ideas that resonate with the Humanet community and attract meaningful engagement.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Idea Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Every great idea on Humanet should have these essential components:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">1. Clear Title</h4>
                    <p className="text-gray-600">A concise, descriptive title that immediately communicates your concept's core value.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">2. Detailed Description</h4>
                    <p className="text-gray-600">Explain the problem you're solving, your proposed solution, and its potential impact.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">3. Domain Tags</h4>
                    <p className="text-gray-600">Select relevant categories to help others discover your idea (Technology, Healthcare, etc.).</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      ✅ Do This
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Be specific about the problem you're solving</li>
                      <li>• Include potential use cases or applications</li>
                      <li>• Mention any technical considerations</li>
                      <li>• Be open to feedback and iterations</li>
                      <li>• Use clear, accessible language</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      ❌ Avoid This
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Vague or overly broad descriptions</li>
                      <li>• Ideas without clear value proposition</li>
                      <li>• Overly technical jargon without explanation</li>
                      <li>• Duplicate or very similar existing ideas</li>
                      <li>• Ideas that violate community guidelines</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'voting-system':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Voting & Interactions</h1>
            <p className="text-xl text-gray-600 mb-8">
              Understand how the voting system works and how to effectively engage with ideas in the community.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>How Voting Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Humanet uses a democratic voting system to surface the most valuable and innovative ideas:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">↑</div>
                    <div>
                      <h4 className="font-semibold">Upvote</h4>
                      <p className="text-sm text-gray-600">Show support for ideas you find valuable or innovative</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">↓</div>
                    <div>
                      <h4 className="font-semibold">Downvote</h4>
                      <p className="text-sm text-gray-600">Currently disabled - we focus on positive reinforcement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voting Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">When to Upvote</h4>
                  <ul className="text-blue-800 space-y-1 text-sm">
                    <li>• The idea addresses a real problem</li>
                    <li>• The solution is innovative or creative</li>
                    <li>• The concept has potential for positive impact</li>
                    <li>• The idea is well-explained and thought-out</li>
                    <li>• You would want to see this idea developed further</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'idea-forking':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Forking Ideas</h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn how to create variations and improvements of existing ideas through the forking system.
            </p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitFork className="w-6 h-6 mr-2 text-green-600" />
                  What is Idea Forking?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Forking allows you to create a new version of an existing idea, building upon or modifying the original concept. 
                  This creates a "family tree" of related ideas that shows how concepts evolve over time.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">💡 Coming Soon in Phase 2</h4>
                  <p className="text-green-800 text-sm">
                    Idea forking is currently in development and will be available in Phase 2 of our roadmap. 
                    Stay tuned for this exciting feature!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How Forking Will Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h4 className="font-semibold">Find an Idea to Fork</h4>
                      <p className="text-sm text-gray-600">Browse ideas and find one you want to build upon or modify</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h4 className="font-semibold">Click "Fork This Idea"</h4>
                      <p className="text-sm text-gray-600">This will create a copy you can modify while maintaining the connection to the original</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h4 className="font-semibold">Make Your Changes</h4>
                      <p className="text-sm text-gray-600">Modify the title, description, or add new elements to create your variation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h4 className="font-semibold">Publish Your Fork</h4>
                      <p className="text-sm text-gray-600">Your forked idea becomes part of the family tree, showing its evolution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">System Architecture</h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn about Humanet's technical architecture and how different components work together.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Frontend</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">Next.js 15</Badge>
                        <span className="text-sm text-gray-600">React framework with App Router</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-cyan-100 text-cyan-800">TypeScript</Badge>
                        <span className="text-sm text-gray-600">Type-safe JavaScript</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">Tailwind CSS</Badge>
                        <span className="text-sm text-gray-600">Utility-first styling</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-gray-100 text-gray-800">shadcn/ui</Badge>
                        <span className="text-sm text-gray-600">Component library</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3">Backend</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Node.js</Badge>
                        <span className="text-sm text-gray-600">JavaScript runtime</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Express</Badge>
                        <span className="text-sm text-gray-600">Web framework</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">MongoDB</Badge>
                        <span className="text-sm text-gray-600">NoSQL database</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-800">Redis</Badge>
                        <span className="text-sm text-gray-600">Caching & sessions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded border">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{`Humanet/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable UI components
│   │   ├── hooks/     # Custom React hooks
│   │   └── lib/       # Utilities & API client
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── models/    # Database schemas
│   │   ├── routes/    # API route definitions
│   │   └── services/  # Business logic
└── shared/            # Shared TypeScript types`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'api-overview':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
            <p className="text-xl text-gray-600 mb-8">
              Humanet provides a comprehensive REST API for developers to integrate idea sharing and evolution features into their applications.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Base URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <code className="text-sm text-gray-800">https://api.humanet.com/v1</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using JWT tokens. Include your token in the Authorization header:
                </p>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <code className="text-sm text-gray-800">Authorization: Bearer YOUR_JWT_TOKEN</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  API requests are limited to ensure fair usage:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Authenticated users:</strong> 1000 requests per hour</li>
                  <li><strong>Public endpoints:</strong> 100 requests per hour</li>
                  <li><strong>Premium users:</strong> 5000 requests per hour</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600">
              Select a topic from the sidebar to view detailed documentation.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Humanet Docs</span>
          </Link>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <nav className="p-4">
          {sidebarSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const SectionIcon = section.icon;
            
            return (
              <div key={section.id} className="mb-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <SectionIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setActivePage(page.id)}
                        className={`block w-full text-left p-2 text-sm rounded-md transition-colors ${
                          activePage === page.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {getPageContent(activePage)}
        </div>
      </div>
    </div>
  );
}
