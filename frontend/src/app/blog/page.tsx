'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PenTool, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  GitFork,
  Calendar,
  BookOpen,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Introducing Idea Evolution: Why Forking Matters",
      excerpt: "Discover how our unique idea forking system enables concepts to evolve naturally through community collaboration, leading to breakthrough innovations.",
      author: "Humanet Team",
      date: "Dec 15, 2024",
      category: "Product",
      readTime: "5 min read",
      featured: true,
      tags: ["Product", "Innovation", "Community"]
    },
    {
      id: 2,
      title: "Building the Future of Collaborative Innovation",
      excerpt: "Learn about our mission to create the world's first idea evolution platform and how we're revolutionizing the way people share and develop innovative concepts.",
      author: "Humanet Team", 
      date: "Dec 1, 2024",
      category: "Company",
      readTime: "7 min read",
      featured: true,
      tags: ["Vision", "Company", "Future"]
    },
    {
      id: 3,
      title: "Community Spotlight: Most Innovative Ideas of the Month",
      excerpt: "Highlighting the most creative and impactful ideas shared by our community members, and how they've evolved through collaborative input.",
      author: "Community Team",
      date: "Nov 28, 2024", 
      category: "Community",
      readTime: "4 min read",
      featured: false,
      tags: ["Community", "Spotlight", "Innovation"]
    },
    {
      id: 4,
      title: "The Science Behind Idea Evolution", 
      excerpt: "Exploring the research and principles that inspired our platform's unique approach to collaborative innovation and idea development.",
      author: "Research Team",
      date: "Nov 15, 2024",
      category: "Research",
      readTime: "8 min read", 
      featured: false,
      tags: ["Research", "Science", "Innovation"]
    },
    {
      id: 5,
      title: "How to Write Ideas That Inspire Action",
      excerpt: "Tips and best practices for crafting compelling idea descriptions that attract collaborators and drive meaningful innovation.",
      author: "Community Team",
      date: "Nov 2, 2024",
      category: "Guide",
      readTime: "6 min read",
      featured: false,
      tags: ["Guide", "Writing", "Best Practices"]
    }
  ];

  const categories = [
    { name: "All", count: blogPosts.length, icon: BookOpen },
    { name: "Product", count: 1, icon: Rocket },
    { name: "Company", count: 1, icon: Users },
    { name: "Community", count: 2, icon: Users },
    { name: "Research", count: 1, icon: Target },
    { name: "Guide", count: 1, icon: PenTool }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'company': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      case 'guide': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Humanet Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Insights, updates, and stories from the world of collaborative innovation. 
            Discover how ideas evolve and communities thrive.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <PenTool className="w-4 h-4 mr-2" />
              Innovation Stories
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Lightbulb className="w-4 h-4 mr-2" />
              Product Updates
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Community Highlights
            </Badge>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = category.name === "All";
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <span className={`ml-1 text-xs px-2 py-1 rounded-full ${
                    isActive 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {category.count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
            <p className="text-lg text-gray-600">
              Our latest insights and most popular content.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      {post.category === 'Product' && <Rocket className="w-12 h-12 mx-auto mb-2" />}
                      {post.category === 'Company' && <Users className="w-12 h-12 mx-auto mb-2" />}
                      {post.category === 'Community' && <Users className="w-12 h-12 mx-auto mb-2" />}
                      <div className="text-sm opacity-80">Featured Article</div>
                    </div>
                  </div>
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>by {post.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      {post.category === 'Research' && <Target className="w-8 h-8 mx-auto mb-1" />}
                      {post.category === 'Guide' && <PenTool className="w-8 h-8 mx-auto mb-1" />}
                      {post.category === 'Community' && <Users className="w-8 h-8 mx-auto mb-1" />}
                    </div>
                  </div>
                  <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      by {post.author}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs">
                      Read →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-xl opacity-90 mb-8">
            Get the latest updates, insights, and stories delivered to your inbox.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Newsletter Coming Soon</span>
            </div>
            <p className="text-sm opacity-80">
              We're working on our newsletter system. Meanwhile, follow our updates on the platform!
            </p>
          </div>
          <div className="mt-8">
            <Link href="/ideas">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <TrendingUp className="w-5 h-5 mr-2" />
                Explore Latest Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
