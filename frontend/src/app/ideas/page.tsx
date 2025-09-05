'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIdeas } from '@/hooks/useIdeas';
import { IdeaCard } from '@/components/ui/IdeaCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Clock, 
  Flame, 
  GitFork, 
  Monitor, 
  Microscope, 
  Briefcase, 
  Users, 
  Leaf, 
  Cross, 
  GraduationCap, 
  Settings, 
  Globe, 
  Lightbulb,
  BarChart3,
  AlertCircle
} from 'lucide-react';

export default function IdeasPage() {
  const { data: user } = useAuth();
  const [sortBy, setSortBy] = useState<'createdAt' | 'upvotes' | 'forkCount'>('createdAt');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: ideasData, isLoading, error } = useIdeas({ 
    sortBy, 
    domain: selectedDomain ? [selectedDomain] : undefined, 
    page, 
    limit: 10 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="flex gap-6">
              <div className="flex-1 max-w-3xl space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="h-64"></Card>
                ))}
              </div>
              <div className="w-80 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-32"></Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ideas</h1>
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-destructive">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Failed to load ideas. Please try again later.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const ideas = ideasData?.data || [];
  const pagination = ideasData?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ideas</h1>
          {user && (
            <Button asChild>
              <Link href="/ideas/new">
                <Plus className="w-4 h-4 mr-2" />
                Share Idea
              </Link>
            </Button>
          )}
        </div>

        {/* Main Layout - Reddit Style */}
        <div className="flex gap-6">
          {/* Main Content - Left Side */}
          <div className="flex-1 max-w-3xl">
            {/* Filters Bar */}
            <Card className="p-4 mb-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Sort:</label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Newest
                        </div>
                      </SelectItem>
                      <SelectItem value="upvotes">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          Hot
                        </div>
                      </SelectItem>
                      <SelectItem value="forkCount">
                        <div className="flex items-center gap-2">
                          <GitFork className="w-4 h-4" />
                          Most Forked
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Domain:</label>
                  <Select value={selectedDomain || "all"} onValueChange={(value) => setSelectedDomain(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="technology">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Technology
                        </div>
                      </SelectItem>
                      <SelectItem value="science">
                        <div className="flex items-center gap-2">
                          <Microscope className="w-4 h-4" />
                          Science
                        </div>
                      </SelectItem>
                      <SelectItem value="business">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Business
                        </div>
                      </SelectItem>
                      <SelectItem value="social">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Social
                        </div>
                      </SelectItem>
                      <SelectItem value="environment">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          Environment
                        </div>
                      </SelectItem>
                      <SelectItem value="healthcare">
                        <div className="flex items-center gap-2">
                          <Cross className="w-4 h-4" />
                          Healthcare
                        </div>
                      </SelectItem>
                      <SelectItem value="education">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Education
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Ideas List */}
            {ideas.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
                  <p className="text-gray-500 mb-6">
                    Be the first to share an innovative idea with the community!
                  </p>
                  {user && (
                    <Link
                      href="/ideas/new"
                      className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Share Your First Idea
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea._id}
                    idea={idea}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    ← Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= pagination.pages - 3) {
                        pageNum = pagination.pages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }
                      
                      const isCurrentPage = pageNum === page;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={isCurrentPage ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                  >
                    Next →
                  </Button>
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="w-80 space-y-4">
            {/* Create Idea Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Share Your Idea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Have an innovative idea? Share it with the community and collaborate with others.
                </p>
                {user ? (
                  <Button asChild className="w-full">
                    <Link href="/ideas/new">Create Idea</Link>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Login to Share</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/register">Create Account</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Domains */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Popular Domains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* All domains option */}
                <Button
                  variant={selectedDomain === "" ? "secondary" : "ghost"}
                  onClick={() => setSelectedDomain("")}
                  className="w-full justify-between h-auto py-2"
                >
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    All Domains
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {pagination?.total || 0}
                  </Badge>
                </Button>
                
                {[
                  { name: 'Technology', icon: Monitor, count: 42 },
                  { name: 'Science', icon: Microscope, count: 28 },
                  { name: 'Business', icon: Briefcase, count: 35 },
                  { name: 'Social', icon: Users, count: 19 },
                  { name: 'Environment', icon: Leaf, count: 23 }
                ].map((domain) => {
                  const IconComponent = domain.icon;
                  return (
                    <Button
                      key={domain.name}
                      variant={selectedDomain === domain.name.toLowerCase() ? "secondary" : "ghost"}
                      onClick={() => setSelectedDomain(domain.name.toLowerCase())}
                      className="w-full justify-between h-auto py-2"
                    >
                      <span className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {domain.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {domain.count}
                      </Badge>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Ideas</span>
                  <Badge variant="secondary">{pagination?.total || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <Badge variant="secondary">234</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ideas This Week</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+12</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
