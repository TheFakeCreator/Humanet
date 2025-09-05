'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  GitFork, 
  Users, 
  ArrowUp, 
  MessageCircle, 
  Zap, 
  Target, 
  Network,
  TreePine,
  Rocket,
  Brain,
  Sparkles,
  ChevronRight,
  Play,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const { data: user, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Share Your Idea",
      description: "Post your innovative concept to the community",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Get Feedback",
      description: "Receive votes and constructive comments",
      icon: MessageCircle,
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "Fork & Evolve",
      description: "Others build upon your idea, creating variations",
      icon: GitFork,
      color: "from-green-400 to-teal-500"
    },
    {
      title: "Innovation Born",
      description: "Watch ideas grow into real-world solutions",
      icon: Rocket,
      color: "from-purple-400 to-pink-500"
    }
  ];

  const features = [
    {
      icon: Network,
      title: "Idea Family Trees",
      description: "Visualize how ideas branch and evolve through community collaboration",
      highlight: "Unique Feature"
    },
    {
      icon: Brain,
      title: "Smart Matching",
      description: "AI-powered suggestions connect related ideas and potential collaborators",
      highlight: "Coming Soon"
    },
    {
      icon: TrendingUp,
      title: "Impact Tracking",
      description: "See real metrics on how your ideas influence others and create value",
      highlight: "Analytics"
    }
  ];

  const demoIdeas = [
    {
      id: 1,
      title: "Solar-Powered Water Purification System",
      author: "EcoInnovator",
      upvotes: 247,
      forks: 12,
      domain: "Sustainability",
      trending: true
    },
    {
      id: 2,
      title: "AI-Assisted Code Review Platform",
      author: "DevMaster",
      upvotes: 189,
      forks: 8,
      domain: "Technology",
      trending: false
    },
    {
      id: 3,
      title: "Community Garden Network App",
      author: "GreenThumb",
      upvotes: 156,
      forks: 15,
      domain: "Social",
      trending: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-xl text-gray-600">Loading ideas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Where Ideas Evolve Together
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Your Ideas.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Amplified.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            The only platform where ideas don't just get shared—they get <strong>forked</strong>, 
            <strong> evolved</strong>, and <strong>transformed</strong> into breakthrough innovations through community collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/ideas/new">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Share Your Idea
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/ideas">
                    Explore Ideas
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/auth/register">
                    <Rocket className="w-5 h-5 mr-2" />
                    Join Community
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/ideas">
                    <Play className="w-5 h-5 mr-2" />
                    See How It Works
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Demo Ideas Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {demoIdeas.map((idea) => (
              <Card key={idea.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={idea.trending ? "default" : "secondary"} className="text-xs">
                      {idea.trending && <TrendingUp className="w-3 h-3 mr-1" />}
                      {idea.domain}
                    </Badge>
                    {idea.trending && (
                      <div className="animate-pulse">
                        <Zap className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {idea.title}
                  </h3>
                  <div className="text-xs text-gray-500 mb-3">by {idea.author}</div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        {idea.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {idea.forks}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Ideas <span className="text-blue-600">Multiply</span>
            </h2>
            <p className="text-xl text-gray-600">
              Unlike traditional idea platforms, Humanet creates an ecosystem where ideas grow, branch, and evolve organically.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Interactive Animation */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className={`transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentStep;
                      const isPast = index < currentStep;
                      
                      return (
                        <div
                          key={index}
                          className={`absolute transition-all duration-700 ${
                            isActive ? 'scale-110 opacity-100' : isPast ? 'scale-75 opacity-30' : 'scale-75 opacity-30'
                          }`}
                          style={{
                            transform: `translate(${Math.cos(index * Math.PI / 2) * 120}px, ${Math.sin(index * Math.PI / 2) * 120}px) ${isActive ? 'scale(1.1)' : 'scale(0.75)'}`
                          }}
                        >
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} shadow-lg`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Center Info */}
                    <div className="text-center bg-white rounded-xl p-6 shadow-lg border max-w-xs">
                      <h3 className="font-bold text-lg mb-2">{steps[currentStep].title}</h3>
                      <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Humanet is <span className="text-yellow-300">Different</span>
            </h2>
            <p className="text-xl opacity-90">
              We're not just another idea-sharing platform. We've reimagined how innovation happens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="bg-yellow-400 text-black text-xs">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="opacity-90">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Join a Growing Community of Innovators
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Ideas Shared", icon: Lightbulb },
                { number: "2.5K+", label: "Active Innovators", icon: Users },
                { number: "8K+", label: "Idea Forks", icon: GitFork },
                { number: "50K+", label: "Collaborations", icon: Network }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Turn Your Ideas into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                Innovation?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of innovators who are already building the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="text-lg px-12 py-4">
                  <Link href="/ideas/new">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Share Your First Idea
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-12 py-4">
                    <Link href="/auth/register">
                      Get Started Free
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-12 py-4">
                    <Link href="/ideas">
                      Explore Ideas
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
