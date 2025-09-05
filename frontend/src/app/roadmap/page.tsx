'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  GitBranch,
  Sparkles,
  Rocket,
  Brain,
  Network,
  Shield,
  Globe,
  TrendingUp,
  Mail,
  MessageCircle
} from 'lucide-react';

export default function RoadmapPage() {
  const roadmapPhases = [
    {
      phase: "Phase 1: Foundation",
      status: "in-progress",
      timeframe: "Q1-Q2 2025",
      description: "Building the core platform and community features",
      features: [
        { name: "User Authentication & Profiles", status: "completed", icon: Users },
        { name: "Idea Creation & Management", status: "completed", icon: Target },
        { name: "Upvoting & Basic Interactions", status: "in-progress", icon: TrendingUp },
        { name: "Comment System", status: "planned", icon: MessageCircle },
        { name: "Domain Categorization", status: "completed", icon: GitBranch }
      ]
    },
    {
      phase: "Phase 2: Evolution Engine",
      status: "planned", 
      timeframe: "Q3-Q4 2025",
      description: "Implementing the core idea evolution and forking system",
      features: [
        { name: "Idea Forking System", status: "planned", icon: GitBranch },
        { name: "Family Tree Visualization", status: "planned", icon: Network },
        { name: "Advanced Search & Filtering", status: "planned", icon: Brain },
        { name: "Real-time Notifications", status: "planned", icon: Zap },
        { name: "Mobile App (React Native)", status: "planned", icon: Globe }
      ]
    },
    {
      phase: "Phase 3: Intelligence Layer",
      status: "planned",
      timeframe: "Q1-Q2 2026",
      description: "AI-powered features for better idea discovery and matching",
      features: [
        { name: "AI Idea Matching", status: "planned", icon: Brain },
        { name: "Smart Collaboration Suggestions", status: "planned", icon: Sparkles },
        { name: "Automated Tagging", status: "planned", icon: Target },
        { name: "Trend Analysis Dashboard", status: "planned", icon: TrendingUp },
        { name: "Content Moderation AI", status: "planned", icon: Shield }
      ]
    },
    {
      phase: "Phase 4: Ecosystem",
      status: "planned",
      timeframe: "Q3-Q4 2026",
      description: "Building partnerships and expanding the innovation ecosystem",
      features: [
        { name: "Company/Organization Accounts", status: "planned", icon: Users },
        { name: "Innovation Challenges", status: "planned", icon: Target },
        { name: "Investor Portal", status: "planned", icon: TrendingUp },
        { name: "API & Developer Tools", status: "planned", icon: Globe },
        { name: "Patent Integration", status: "planned", icon: Shield }
      ]
    },
    {
      phase: "Phase 5: Global Scale",
      status: "planned",
      timeframe: "2027+",
      description: "Scaling globally and becoming the world's innovation hub",
      features: [
        { name: "Multi-language Support", status: "planned", icon: Globe },
        { name: "Regional Innovation Hubs", status: "planned", icon: Network },
        { name: "University Partnerships", status: "planned", icon: Users },
        { name: "Government Innovation Programs", status: "planned", icon: Shield },
        { name: "Global Innovation Index", status: "planned", icon: Rocket }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800'; 
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planned': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Humanet Roadmap
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our journey to revolutionize how the world shares, evolves, and implements innovative ideas.
            Track our progress and see what's coming next.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              5 Major Phases
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              25+ Features
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Global Vision
            </Badge>
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Focus</h2>
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phase 1: Foundation</h3>
              <p className="text-gray-600 mb-4">
                We're currently in the foundation phase with user authentication and idea creation completed. 
                Currently working on upvoting and basic interaction features to build community engagement.
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                In Progress - Q1-Q2 2025
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Development Timeline</h2>
            <p className="text-lg text-gray-600">
              A detailed look at our past achievements and future plans.
            </p>
          </div>

          <div className="space-y-8">
            {roadmapPhases.map((phase, index) => (
              <Card key={index} className={`relative ${
                phase.status === 'in-progress' ? 'ring-2 ring-blue-500 bg-blue-50/50' : 
                phase.status === 'completed' ? 'bg-green-50/50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{phase.phase}</CardTitle>
                      <Badge className={getStatusColor(phase.status)}>
                        {getStatusIcon(phase.status)}
                        <span className="ml-1 capitalize">{phase.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {phase.timeframe}
                    </div>
                  </div>
                  <p className="text-gray-600">{phase.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {phase.features.map((feature, featureIndex) => {
                      const Icon = feature.icon;
                      return (
                        <div key={featureIndex} className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            feature.status === 'completed' ? 'bg-green-100' :
                            feature.status === 'in-progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              feature.status === 'completed' ? 'text-green-600' :
                              feature.status === 'in-progress' ? 'text-blue-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{feature.name}</span>
                              {getStatusIcon(feature.status)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Shape Our Future</h2>
          <p className="text-xl opacity-90 mb-8">
            Want to influence our roadmap? Join our community and share your ideas for what Humanet should build next.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/ideas">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-700 border-0">
                <Target className="w-5 h-5 mr-2" />
                Share Feature Ideas
              </Button>
            </Link>
            <Link href="/ideas?domain=Platform">
              <Button variant="ghost" size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 hover:border-white transition-all duration-200">
                <Users className="w-5 h-5 mr-2" />
                Join Discussions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Get notified when we launch new features and reach major milestones.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-500">
              <Mail className="w-4 h-4 inline mr-2" />Coming soon: Email updates for major releases and feature launches
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
