'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Send, 
  Twitter, 
  Linkedin,
  Github,
  Globe,
  Users,
  Lightbulb,
  Heart,
  Clock
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "General Inquiries",
      description: "Questions about Humanet, partnerships, or general information",
      email: "hello@humanet.com",
      responseTime: "24-48 hours",
      type: "general"
    },
    {
      icon: Users,
      title: "Business & Partnerships",
      description: "Enterprise solutions, partnerships, and business development", 
      email: "business@humanet.com",
      responseTime: "1-2 business days",
      type: "business"
    },
    {
      icon: Lightbulb,
      title: "Product Feedback",
      description: "Feature requests, bug reports, and product suggestions",
      email: "product@humanet.com", 
      responseTime: "2-3 business days",
      type: "product"
    },
    {
      icon: Heart,
      title: "Support & Help",
      description: "Technical support, account issues, and user assistance",
      email: "support@humanet.com",
      responseTime: "12-24 hours",
      type: "support"
    }
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/humanetplatform",
      handle: "@humanetplatform",
      description: "Latest updates and community highlights"
    },
    {
      name: "LinkedIn", 
      icon: Linkedin,
      url: "https://linkedin.com/company/humanet",
      handle: "humanet",
      description: "Professional updates and company news"
    },
    {
      name: "GitHub",
      icon: Github, 
      url: "https://github.com/humanet",
      handle: "github.com/humanet",
      description: "Open source projects and contributions"
    },
    {
      name: "Discord",
      icon: MessageCircle,
      url: "https://discord.gg/humanet", 
      handle: "Join our server",
      description: "Community discussions and real-time chat"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      name: '',
      email: '', 
      subject: '',
      message: '',
      type: 'general'
    });
    
    setIsSubmitting(false);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Have questions, ideas, or just want to say hello? We'd love to hear from you. 
            Our team is here to help and excited to connect with the innovation community.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Multiple Channels
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Quick Response
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Global Team
            </Badge>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Channel</h2>
            <p className="text-lg text-gray-600">
              Different ways to reach us based on your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    formData.type === option.type ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: option.type }))}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      <Mail className="w-3 h-3 inline mr-1" />
                      {option.email}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {option.responseTime}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By sending this message, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Social */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">General Inquiries</div>
                      <div className="text-sm text-gray-600">hello@humanet.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-600">Remote-first • Global team</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Response Time</div>
                      <div className="text-sm text-gray-600">Usually within 24 hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Connect With Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{social.name}</div>
                          <div className="text-sm text-gray-600">{social.description}</div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={social.url} target="_blank" rel="noopener noreferrer">
                            Follow →
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking for Quick Answers?</h2>
          <p className="text-gray-600 mb-8">
            Check out these helpful resources that might answer your question immediately.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0 text-center">
                <Lightbulb className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-gray-600">Learn about idea evolution and forking</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Community Guidelines</h3>
                <p className="text-sm text-gray-600">Rules and best practices for the platform</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0 text-center">
                <Heart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">About Us</h3>
                <p className="text-sm text-gray-600">Our mission and team behind Humanet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
