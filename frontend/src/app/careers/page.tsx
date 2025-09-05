'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  Rocket, 
  Heart, 
  Globe, 
  Code, 
  PenTool, 
  Target,
  Sparkles,
  TrendingUp,
  Coffee,
  MessageCircle,
  Mail
} from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      title: "Full Stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote / Hybrid",
      description: "Help us build the next generation of collaborative innovation tools. Work with React, Node.js, and MongoDB to create scalable solutions.",
      requirements: ["3+ years experience with React and Node.js", "Experience with MongoDB and REST APIs", "Passionate about innovation and collaboration"],
      featured: true
    },
    {
      title: "UI/UX Designer", 
      department: "Design",
      type: "Full-time",
      location: "Remote / Hybrid", 
      description: "Design intuitive interfaces for complex idea evolution workflows. Create visual systems that make innovation accessible to everyone.",
      requirements: ["Experience with Figma and design systems", "Portfolio showing complex product design", "Understanding of user research methods"],
      featured: true
    },
    {
      title: "Community Manager",
      department: "Community",
      type: "Full-time", 
      location: "Remote",
      description: "Build and nurture our global community of innovators. Foster engagement and help ideas flourish through strategic community initiatives.",
      requirements: ["Experience in community building", "Excellent communication skills", "Passion for innovation and collaboration"],
      featured: false
    },
    {
      title: "DevOps Engineer",
      department: "Engineering", 
      type: "Full-time",
      location: "Remote",
      description: "Scale our infrastructure to support millions of ideas and innovators. Work with cloud platforms and modern deployment strategies.",
      requirements: ["Experience with AWS/Azure/GCP", "Knowledge of Docker and Kubernetes", "CI/CD pipeline expertise"],
      featured: false
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world. We believe great ideas can come from everywhere."
    },
    {
      icon: Rocket,
      title: "Impact at Scale", 
      description: "Your work will directly influence how millions of people collaborate and innovate."
    },
    {
      icon: TrendingUp,
      title: "Growth & Learning",
      description: "Continuous learning budget, conference attendance, and skill development opportunities."
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipend."
    },
    {
      icon: Coffee,
      title: "Flexible Schedule",
      description: "Choose your own hours and work when you're most productive. Results matter, not hours."
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work alongside passionate, talented people who care deeply about innovation and collaboration."
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We lead by example, constantly experimenting and pushing boundaries in everything we do."
    },
    {
      title: "Community Driven", 
      description: "Our users and community are at the center of every decision we make."
    },
    {
      title: "Transparent & Open",
      description: "We believe in open communication, shared knowledge, and transparent processes."
    },
    {
      title: "Quality & Craft",
      description: "We take pride in building exceptional products that people love to use."
    }
  ];

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'engineering': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Help us build the future of collaborative innovation. Join a team of passionate builders 
            creating tools that will transform how the world shares and develops ideas.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              {openPositions.length} Open Positions
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Remote-First
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Mission-Driven
            </Badge>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work and shape our culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-3 text-lg">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Ready to shape the future of innovation? Find your perfect role.
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className={`${position.featured ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{position.title}</h3>
                        {position.featured && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <Badge className={getDepartmentColor(position.department)}>
                          {position.department}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {position.location}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{position.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm">Key Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {position.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="lg:ml-6">
                      <Button className="w-full lg:w-auto">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Humanet?</h2>
            <p className="text-lg text-gray-600">
              We're committed to creating an exceptional place to work and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
            <p className="text-lg text-gray-600">
              Transparent, respectful, and designed to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Application", description: "Submit your application and tell us why you're excited about Humanet" },
              { step: "2", title: "Phone Screen", description: "30-minute chat with our team to learn more about each other" },
              { step: "3", title: "Technical/Case Study", description: "Relevant exercise to showcase your skills and approach" },
              { step: "4", title: "Team Interview", description: "Meet the team you'll work with and discuss the role in detail" }
            ].map((process, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {process.step}
                  </div>
                  <h3 className="font-semibold mb-2">{process.title}</h3>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Change the World?</h2>
          <p className="text-xl opacity-90 mb-8">
            Don't see a role that fits? We're always interested in talking to exceptional people.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
            <Link href="/about">
              <Button variant="ghost" size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 hover:border-white transition-all duration-200">
                <Users className="w-5 h-5 mr-2" />
                Learn About Us
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm opacity-75">
              <Mail className="w-4 h-4 inline mr-2" />careers@humanet.com • We're an equal opportunity employer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
