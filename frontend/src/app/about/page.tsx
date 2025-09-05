'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Users, 
  GitFork, 
  Target, 
  Heart, 
  Zap,
  Network,
  TreePine,
  Infinity
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "The Humanet Team",
      role: "Building the Future of Innovation",
      description: "A passionate group of developers, designers, and innovators working to democratize idea sharing and collaboration."
    }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We believe every idea has the potential to change the world, no matter how small it starts."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our platform thrives on the collective wisdom and creativity of our global community."
    },
    {
      icon: GitFork,
      title: "Collaborative Evolution",
      description: "Ideas grow stronger when they're built upon, forked, and evolved by multiple minds."
    },
    {
      icon: Network,
      title: "Open Innovation",
      description: "We promote transparent, accessible innovation that benefits everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Humanet
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're building the world's first idea evolution platform, where innovative concepts 
            grow, branch, and transform through collaborative intelligence.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <TreePine className="w-4 h-4 mr-2" />
              Idea Evolution
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Network className="w-4 h-4 mr-2" />
              Global Community
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Innovation Catalyst
            </Badge>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To create a digital ecosystem where ideas can evolve naturally through community 
              collaboration, turning individual insights into collective innovations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Why Humanet Exists
              </h3>
              <p className="text-gray-600 mb-6">
                Traditional idea platforms treat concepts as static posts. We see them as living, 
                breathing entities that can grow, adapt, and evolve through community input.
              </p>
              <p className="text-gray-600 mb-6">
                By introducing the concept of "idea forking" - borrowed from software development - 
                we enable multiple variations of the same concept to coexist and compete, 
                leading to better solutions through natural selection.
              </p>
            </div>
            
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-0">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Our Vision</h4>
                  <p className="text-sm text-gray-600">
                    A world where every innovative idea can find its path to reality 
                    through collaborative evolution and community support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-600 mb-12">
            Built by innovators, for innovators.
          </p>

          {teamMembers.map((member, index) => (
            <Card key={index} className="max-w-2xl mx-auto p-8">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Innovation Revolution</h2>
          <p className="text-xl opacity-90 mb-8">
            Be part of a growing community that's reshaping how ideas become reality.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex justify-center mb-2">
                <Infinity className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-sm opacity-80">Possibilities</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <TreePine className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-sm opacity-80">Growing Ideas</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-sm opacity-80">Collaborations</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-sm opacity-80">Innovations</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
