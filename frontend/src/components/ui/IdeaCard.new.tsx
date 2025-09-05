import React from 'react';
import Link from 'next/link';
import { useUpvoteIdea, useForkIdea } from '@/hooks/useIdeas';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, ArrowDown, MessageCircle, GitFork, Share, RotateCcw } from 'lucide-react';
import type { IdeaDTO } from '@humanet/shared';

interface IdeaCardProps {
  idea: IdeaDTO;
  showActions?: boolean;
  compact?: boolean;
}

export function IdeaCard({ idea, showActions = true, compact = false }: IdeaCardProps) {
  const { data: user } = useAuth();
  const upvoteMutation = useUpvoteIdea();
  const forkMutation = useForkIdea();
  const { toast } = useToast();

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to upvote ideas.",
        variant: "destructive",
      });
      window.location.href = '/auth/login';
      return;
    }
    upvoteMutation.mutate(idea._id!);
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to downvote ideas.",
        variant: "destructive",
      });
      window.location.href = '/auth/login';
      return;
    }
    // downvoteMutation.mutate(idea._id!);
  };

  const handleFork = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to fork ideas.",
        variant: "destructive",
      });
      window.location.href = '/auth/login';
      return;
    }
    forkMutation.mutate({ id: idea._id! });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.origin + `/ideas/${idea._id}`);
      toast({
        title: "Link copied!",
        description: "Idea link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (compact) {
    return (
      <Link href={`/ideas/${idea._id}`}>
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm leading-tight mb-1">{idea.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {idea.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <span>{idea.upvotes || 0} upvotes</span>
                <span>•</span>
                <span>{(idea as any).commentCount || 0} comments</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {idea.domain}
            </Badge>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="hover:bg-accent/10 transition-colors">
      <Link href={`/ideas/${idea._id}`} className="block p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center text-xs text-muted-foreground gap-2 flex-wrap">
            <span>by {(idea as any).authorUsername || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(idea.createdAt || '').toLocaleDateString()}</span>
            {idea.parentId && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Forked
                </Badge>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold hover:text-primary transition-colors">
            {idea.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {idea.description}
          </p>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Domain Badge */}
          {idea.domain && (
            <div className="flex items-center">
              <Badge variant="default" className="text-xs">
                {idea.domain}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Action Bar */}
      {showActions && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              {/* Upvote/Downvote */}
              <div className="flex items-center bg-background rounded-full border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpvote}
                  disabled={upvoteMutation.isPending}
                  className="rounded-l-full px-3 py-1.5 h-auto"
                >
                  <ArrowUp className="w-4 h-4 text-orange-500" />
                </Button>
                
                <div className="px-2 py-1.5 text-sm font-medium border-x min-w-[2rem] text-center">
                  {idea.upvotes || 0}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownvote}
                  className="rounded-r-full px-3 py-1.5 h-auto"
                >
                  <ArrowDown className="w-4 h-4 text-blue-500" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Comments */}
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/ideas/${idea._id}#comments`} className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Comments</span>
                </Link>
              </Button>

              {/* Fork */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFork}
                disabled={forkMutation.isPending}
              >
                <GitFork className="w-4 h-4 mr-1.5" />
                <span className="text-sm">{idea.forkCount || 0} Forks</span>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
              >
                <Share className="w-4 h-4 mr-1.5" />
                <span className="text-sm hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
