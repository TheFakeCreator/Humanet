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

// Utility function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Utility function to safely format dates
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
};

// Utility function to truncate text safely
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export function IdeaCard({ idea, showActions = true, compact = false }: IdeaCardProps) {
  const { data: user } = useAuth();
  const upvoteMutation = useUpvoteIdea();
  const forkMutation = useForkIdea();
  const { toast } = useToast();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);

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
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-3 group">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-sm leading-tight mb-1 line-clamp-2" 
                title={idea.title.length > 50 ? idea.title : undefined}
              >
                {idea.title}
              </h3>
              <p 
                className="text-xs text-muted-foreground mb-2 line-clamp-2" 
                title={idea.description.length > 80 ? idea.description : undefined}
              >
                {idea.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {idea.upvotes || 0}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {(idea as any).commentCount || 0}
                </span>
                {idea.forkCount && idea.forkCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {idea.forkCount}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {idea.domain && idea.domain.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs max-w-[80px] truncate"
                  title={Array.isArray(idea.domain) ? idea.domain.join(', ') : idea.domain}
                >
                  {Array.isArray(idea.domain) ? idea.domain[0] : idea.domain}
                  {Array.isArray(idea.domain) && idea.domain.length > 1 && ` +${idea.domain.length - 1}`}
                </Badge>
              )}
              <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {formatDate(idea.createdAt)}
              </div>
            </div>
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
            <span className="truncate max-w-[120px]" title={idea.author?.username}>
              by {idea.author?.username || 'Anonymous'}
            </span>
            <span>•</span>
            <span className="flex-shrink-0">
              {formatDate(idea.createdAt)}
            </span>
            {idea.parentId && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Forked
                </Badge>
              </>
            )}
          </div>

          {/* Title */}
          <div className="relative group">
            <h2 className="text-lg font-semibold hover:text-primary transition-colors">
              {idea.title.length > 80 ? (
                <div className="overflow-hidden whitespace-nowrap relative">
                  <div 
                    className="inline-block group-hover:animate-marquee"
                    style={{
                      animationDuration: `${Math.max(3, idea.title.length * 0.1)}s`
                    }}
                  >
                    {idea.title}
                  </div>
                  {idea.title.length > 120 && (
                    <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
                  )}
                </div>
              ) : (
                <span className="line-clamp-2">{idea.title}</span>
              )}
            </h2>
            {idea.title.length > 80 && (
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
                {idea.title.length} chars
              </div>
            )}
          </div>

          {/* Description */}
          <div className="relative group">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {idea.description.length > 200 ? (
                <>
                  <span 
                    className={`${isDescriptionExpanded ? '' : 'line-clamp-3'} transition-all duration-300`}
                  >
                    {idea.description}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDescriptionExpanded(!isDescriptionExpanded);
                    }}
                    className="text-primary hover:underline text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 block focus:opacity-100 focus:outline-none"
                    aria-label={isDescriptionExpanded ? 'Collapse description' : 'Expand description'}
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                </>
              ) : (
                <span>{idea.description}</span>
              )}
            </p>
            {idea.description.length > 300 && (
              <div className="absolute -bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground pointer-events-none">
                {idea.description.length} chars
              </div>
            )}
          </div>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 relative group">
              {idea.tags.slice(0, 6).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs max-w-[120px] truncate" 
                  title={tag.length > 15 ? tag : undefined}
                >
                  {tag.length > 15 ? `${tag.slice(0, 12)}...` : tag}
                </Badge>
              ))}
              {idea.tags.length > 6 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs cursor-help" 
                  title={`${idea.tags.length - 6} more tags: ${idea.tags.slice(6).join(', ')}`}
                >
                  +{idea.tags.length - 6} more
                </Badge>
              )}
              {idea.tags.length > 3 && (
                <div className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
                  {idea.tags.length} tags
                </div>
              )}
            </div>
          )}

          {/* Domain Badge */}
          {idea.domain && idea.domain.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              {idea.domain.slice(0, 3).map((domain, index) => (
                <Badge 
                  key={index} 
                  variant="default" 
                  className="text-xs max-w-[100px] truncate"
                  title={domain.length > 12 ? domain : undefined}
                >
                  {domain.length > 12 ? `${domain.slice(0, 9)}...` : domain}
                </Badge>
              ))}
              {idea.domain.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-help" 
                  title={`${idea.domain.length - 3} more domains: ${idea.domain.slice(3).join(', ')}`}
                >
                  +{idea.domain.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Action Bar */}
      {showActions && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between pt-2 border-t gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Upvote/Downvote */}
              <div className="flex items-center bg-background rounded-full border flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpvote}
                  disabled={upvoteMutation.isPending}
                  className="rounded-l-full px-3 py-1.5 h-auto"
                  title="Upvote this idea"
                >
                  <ArrowUp className="w-4 h-4 text-orange-500" />
                </Button>
                
                <div 
                  className="px-2 py-1.5 text-sm font-medium border-x min-w-[2rem] max-w-[4rem] text-center truncate" 
                  title={`${idea.upvotes || 0} upvotes`}
                >
                  {formatNumber(idea.upvotes || 0)}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownvote}
                  className="rounded-r-full px-3 py-1.5 h-auto"
                  title="Downvote this idea"
                >
                  <ArrowDown className="w-4 h-4 text-blue-500" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Comments */}
              <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
                <Link href={`/ideas/${idea._id}#comments`} className="flex items-center gap-1 sm:gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Comments</span>
                  <span className="text-xs sm:hidden">{formatNumber((idea as any).commentCount || 0)}</span>
                </Link>
              </Button>

              {/* Fork */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFork}
                disabled={forkMutation.isPending}
                className="px-2 sm:px-3"
                title={`Fork this idea (${idea.forkCount || 0} forks)`}
              >
                <GitFork className="w-4 h-4 mr-1 sm:mr-1.5" />
                <span className="text-sm hidden sm:inline">
                  {formatNumber(idea.forkCount || 0)} Fork{(idea.forkCount || 0) !== 1 ? 's' : ''}
                </span>
                <span className="text-xs sm:hidden">{formatNumber(idea.forkCount || 0)}</span>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="px-2 sm:px-3"
                title="Share this idea"
              >
                <Share className="w-4 h-4 sm:mr-1.5" />
                <span className="text-sm hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
