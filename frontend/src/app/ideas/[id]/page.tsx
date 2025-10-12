'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useIdea, useUpvoteIdea, useForkIdea } from '@/hooks/useIdeas';
import {
  useCreateAdoptionRequest,
  useAdoptionRequestsForIdea,
  useRespondToAdoptionRequest,
  useTriggerVoting,
} from '@/hooks/useAdoptionRequests';
import { useSubmitVote } from '@/hooks/useVoting';
import { CommentList } from '@/components/ui/CommentList';
import { FamilyTreePreview } from '@/components/ui/FamilyTreePreview';
import { FileSystemTab } from '@/components/ui/FileSystemTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  MessageSquare,
  GitBranch,
  FolderOpen,
  FileText,
  Crown,
  Users,
  Settings,
  Shield,
  Calendar,
  User,
  Award,
  ExternalLink,
  Star,
  GitFork,
  Copy,
  FileCheck,
  Clock,
  Vote,
  Eye,
  Globe,
  Lock,
  CheckCircle,
  X,
  AlertTriangle,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { OwnershipType, AdoptionStatus } from '@shared/types/idea';

// Ownership Badge Component
const OwnershipBadge = ({
  ownershipType,
}: {
  ownershipType: 'self_maintained' | 'seeking_adopter';
}) => {
  const config = {
    self_maintained: {
      icon: User,
      label: 'Self Maintained',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    seeking_adopter: {
      icon: Crown,
      label: 'Seeking Adopter',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
  };

  const { icon: Icon, label, className } = config[ownershipType];

  return (
    <Badge variant="outline" className={`${className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

// Adoption Request Component
const AdoptionRequestForm = ({ ideaId, currentUser }: { ideaId: string; currentUser: any }) => {
  const [formData, setFormData] = useState({
    message: '',
    qualifications: '',
    proposedChanges: '',
    timeline: '',
  });
  const createAdoptionRequestMutation = useCreateAdoptionRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.message.trim() ||
      !formData.qualifications.trim() ||
      !formData.proposedChanges.trim() ||
      !formData.timeline.trim()
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createAdoptionRequestMutation.mutateAsync({
        ideaId,
        data: formData,
      });

      toast({
        title: 'Adoption Request Submitted',
        description: 'Your request has been submitted for review.',
      });

      // Reset form
      setFormData({
        message: '',
        qualifications: '',
        proposedChanges: '',
        timeline: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit adoption request.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Request Adoption
        </CardTitle>
        <CardDescription>Submit a request to become the maintainer of this idea</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Introduction Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Introduce yourself and explain why you want to adopt this idea..."
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          <div>
            <Label htmlFor="qualifications">Your Qualifications *</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => handleInputChange('qualifications', e.target.value)}
              placeholder="Describe your relevant experience, skills, and background..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 20 characters</p>
          </div>

          <div>
            <Label htmlFor="proposedChanges">Proposed Changes *</Label>
            <Textarea
              id="proposedChanges"
              value={formData.proposedChanges}
              onChange={(e) => handleInputChange('proposedChanges', e.target.value)}
              placeholder="What changes or improvements do you plan to make to this idea?"
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline *</Label>
            <Textarea
              id="timeline"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              placeholder="What's your expected timeline for implementing these changes?"
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={createAdoptionRequestMutation.isPending}
            loadingText="Submitting..."
            disabled={
              !formData.message.trim() ||
              !formData.qualifications.trim() ||
              !formData.proposedChanges.trim() ||
              !formData.timeline.trim()
            }
          >
            Submit Adoption Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// License Information Component
const LicenseInfo = ({ license }: { license?: string }) => {
  if (!license) return null;

  const licenseConfig = {
    MIT: {
      name: 'MIT License',
      description: 'A permissive license with minimal restrictions',
      url: 'https://opensource.org/licenses/MIT',
    },
    'Apache-2.0': {
      name: 'Apache License 2.0',
      description: 'A permissive license with patent protection',
      url: 'https://opensource.org/licenses/Apache-2.0',
    },
    'GPL-3.0': {
      name: 'GNU General Public License v3.0',
      description: 'A copyleft license requiring derivative works to be open source',
      url: 'https://opensource.org/licenses/GPL-3.0',
    },
    'CC-BY-4.0': {
      name: 'Creative Commons Attribution 4.0',
      description: 'Allows others to distribute and build upon the material',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  };

  const config = licenseConfig[license as keyof typeof licenseConfig] || {
    name: license,
    description: 'Custom license',
    url: null,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          License
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{config.name}</span>
            {config.url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={config.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function IdeaDetailPage() {
  const params = useParams();
  const ideaId = params.id as string;
  const { data: user } = useAuth();

  // Hooks
  const { data: idea, isLoading, error } = useIdea(ideaId);
  const upvoteMutation = useUpvoteIdea();
  const createAdoptionRequestMutation = useCreateAdoptionRequest();

  // Only fetch adoption requests if user is the idea creator (for management purposes)
  const { data: adoptionRequests } = useAdoptionRequestsForIdea(ideaId, {
    enabled: user && idea && user._id === idea.originalCreator?._id,
  });

  const respondToAdoptionRequestMutation = useRespondToAdoptionRequest();
  const submitVoteMutation = useSubmitVote();
  const triggerVotingMutation = useTriggerVoting();

  // Voting confirmation dialog state
  const [votingDialogOpen, setVotingDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const handleUpvote = () => {
    if (!idea?._id) return;
    upvoteMutation.mutate(idea._id);
  };

  const handleAdoptionRequest = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to request adoption',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createAdoptionRequestMutation.mutateAsync({
        ideaId,
        data: {
          message: `I would like to adopt and maintain this idea. I have experience in ${idea?.domain?.join(', ') || 'this domain'} and am committed to developing it further.`,
          qualifications: `I have experience working with ${idea?.domain?.join(', ') || 'relevant technologies'} and am passionate about contributing to open source projects. I believe I can bring value to this idea through my skills and dedication.`,
          proposedChanges: `I plan to actively maintain and improve this idea by implementing requested features, fixing any issues, and ensuring the project stays up-to-date with best practices.`,
          timeline: `I aim to begin active development within the first week of adoption and maintain regular updates and improvements on an ongoing basis.`,
        },
      });

      toast({
        title: 'Adoption Request Submitted',
        description: 'Your request to adopt this idea has been submitted for review.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to submit adoption request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Idea Not Found</h1>
          <p className="text-gray-600 mb-4">
            The idea you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/ideas" className="btn-primary px-4 py-2 rounded-md">
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  // Determine if user can manage ownership
  const canManageOwnership =
    user && (user._id === idea.originalCreator?._id || user._id === idea.currentMaintainer?._id);

  // Determine if user can request adoption
  const canRequestAdoption =
    user &&
    idea.ownershipType === 'seeking_adopter' &&
    idea.adoptionStatus === 'available' &&
    user._id !== idea.originalCreator?._id &&
    user._id !== idea.currentMaintainer?._id;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <nav className="mb-6">
        <Link href="/ideas" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Back to Ideas
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="bg-white rounded-lg border">
            <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <FileText className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="repository"
                className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Repository</span>
              </TabsTrigger>
              <TabsTrigger
                value="discussions"
                className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Discussions</span>
              </TabsTrigger>
              <TabsTrigger
                value="tree"
                className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <GitBranch className="h-4 w-4" />
                <span>Family Tree</span>
              </TabsTrigger>
              <TabsTrigger
                value="ownership"
                className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Crown className="h-4 w-4" />
                <span>Ownership</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 mt-0">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Idea</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {idea.description}
                </p>

                {/* Ownership Details */}
                <div className="mt-8 space-y-6">
                  <h4 className="text-md font-semibold text-gray-900">Ownership Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-700">
                          Ownership Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <OwnershipBadge ownershipType={idea.ownershipType} />
                        <p className="text-sm text-gray-600 mt-2">
                          {idea.ownershipType === 'self_maintained' &&
                            'This idea is maintained by its creator.'}
                          {idea.ownershipType === 'seeking_adopter' &&
                            'This idea is looking for a new maintainer.'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-700">
                          Current Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {idea.adoptionStatus && idea.adoptionStatus !== 'adopted' ? (
                          <Badge
                            variant="outline"
                            className={`${
                              idea.adoptionStatus === 'available'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : idea.adoptionStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {idea.adoptionStatus === 'available'
                              ? 'Available for Adoption'
                              : idea.adoptionStatus === 'pending'
                                ? 'Adoption Pending'
                                : 'Not Available'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            Active Development
                          </Badge>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          {idea.adoptionStatus === 'available' &&
                            'Available for community adoption.'}
                          {idea.adoptionStatus === 'pending' && 'Adoption request under review.'}
                          {(!idea.adoptionStatus || idea.adoptionStatus === 'adopted') &&
                            'Actively maintained by current owner.'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="repository" className="p-6 mt-0">
              <FileSystemTab ideaId={ideaId} />
            </TabsContent>

            <TabsContent value="discussions" className="p-6 mt-0">
              <CommentList ideaId={ideaId} />
            </TabsContent>

            <TabsContent value="tree" className="p-6 mt-0">
              <div className="space-y-4">
                <FamilyTreePreview ideaId={ideaId} />
                <div className="text-center">
                  <Link
                    href={`/ideas/${ideaId}/tree`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50"
                  >
                    View Full Tree →
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ownership" className="p-6 mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership Management</h3>
                  <p className="text-gray-600 mb-6">
                    Manage ownership, adoption requests, and collaboration settings for this idea.
                  </p>
                </div>

                {/* Adoption Requests Management - Only for creators */}
                {user &&
                  user._id === idea.originalCreator?._id &&
                  idea.ownershipType === 'seeking_adopter' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          Adoption Requests
                        </CardTitle>
                        <CardDescription>
                          Review and respond to adoption requests for your idea
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {adoptionRequests && adoptionRequests.length > 0 ? (
                          <div className="space-y-4">
                            {adoptionRequests
                              .filter((req) => req.status === 'pending')
                              .map((request) => (
                                <div
                                  key={request._id}
                                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-yellow-600" />
                                        <span className="font-medium text-yellow-800">
                                          {request.requester.username}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="bg-yellow-100 text-yellow-800 border-yellow-300"
                                        >
                                          Pending Review
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-yellow-700 mb-2">
                                        Requested on{' '}
                                        {new Date(request.requestedAt).toLocaleDateString()}
                                      </p>
                                      <div className="space-y-3">
                                        {request.message && (
                                          <div className="bg-white rounded-md p-3 border border-yellow-200">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                              Message:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              "{request.message}"
                                            </p>
                                          </div>
                                        )}
                                        {request.qualifications && (
                                          <div className="bg-white rounded-md p-3 border border-yellow-200">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                              Qualifications:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              "{request.qualifications}"
                                            </p>
                                          </div>
                                        )}
                                        {request.proposedChanges && (
                                          <div className="bg-white rounded-md p-3 border border-yellow-200">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                              Proposed Changes:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              "{request.proposedChanges}"
                                            </p>
                                          </div>
                                        )}
                                        {request.timeline && (
                                          <div className="bg-white rounded-md p-3 border border-yellow-200">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                              Timeline:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              "{request.timeline}"
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={respondToAdoptionRequestMutation.isPending}
                                      onClick={async () => {
                                        try {
                                          await respondToAdoptionRequestMutation.mutateAsync({
                                            requestId: request._id,
                                            data: { action: 'approve' },
                                          });
                                          toast({
                                            title: 'Adoption Approved',
                                            description: `${request.requester.username} is now the maintainer of this idea.`,
                                          });
                                        } catch (error: any) {
                                          toast({
                                            title: 'Error',
                                            description:
                                              error.response?.data?.message ||
                                              'Failed to approve adoption request.',
                                            variant: 'destructive',
                                          });
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                      disabled={respondToAdoptionRequestMutation.isPending}
                                      onClick={async () => {
                                        try {
                                          await respondToAdoptionRequestMutation.mutateAsync({
                                            requestId: request._id,
                                            data: { action: 'reject' },
                                          });
                                          toast({
                                            title: 'Adoption Request Declined',
                                            description: 'The adoption request has been declined.',
                                          });
                                        } catch (error: any) {
                                          toast({
                                            title: 'Error',
                                            description:
                                              error.response?.data?.message ||
                                              'Failed to decline adoption request.',
                                            variant: 'destructive',
                                          });
                                        }
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Decline
                                    </Button>
                                    <Button size="sm" variant="ghost" asChild>
                                      <Link href={`/users/${request.requester.username}`}>
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Profile
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : idea.adoptionStatus === 'available' ? (
                          <div className="text-center py-6">
                            <Crown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">No adoption requests yet</p>
                            <p className="text-sm text-gray-400">
                              Your idea is marked as seeking an adopter. Interested users can submit
                              adoption requests.
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">Adoption not currently available</p>
                            <p className="text-sm text-gray-400">
                              Change your idea's ownership type to "seeking adopter" to receive
                              adoption requests.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Trigger Voting Button - Only show for creators when there are multiple requests but no active voting */}
                {user &&
                  user._id === idea.originalCreator?._id &&
                  adoptionRequests &&
                  adoptionRequests.length >= 2 &&
                  !idea.activeVoting && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Vote className="h-5 w-5" />
                          Trigger Democratic Voting
                        </CardTitle>
                        <CardDescription>
                          Multiple adoption requests detected. You can trigger community voting to
                          let users decide.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">
                              {adoptionRequests.length} adoption requests pending
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Instead of choosing manually, you can let the community vote for the
                            best candidate. This creates a fair, transparent selection process.
                          </p>
                        </div>

                        <Button
                          onClick={async () => {
                            try {
                              await triggerVotingMutation.mutateAsync(ideaId);
                              toast({
                                title: 'Voting Triggered',
                                description:
                                  'Community voting has been initiated. Users can now vote for their preferred candidate.',
                              });
                            } catch (error: any) {
                              toast({
                                title: 'Error',
                                description:
                                  error.response?.data?.message || 'Failed to trigger voting.',
                                variant: 'destructive',
                              });
                            }
                          }}
                          disabled={triggerVotingMutation.isPending}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Vote className="h-4 w-4 mr-2" />
                          {triggerVotingMutation.isPending
                            ? 'Starting Voting...'
                            : 'Start Community Voting'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                {/* Democratic Voting Section */}
                {idea.activeVoting && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Vote className="h-5 w-5" />
                        Community Voting
                      </CardTitle>
                      <CardDescription>
                        Multiple adoption requests triggered democratic voting. Community members
                        vote for the best candidate.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Voting Status */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">
                                {idea.activeVoting.hasUserVoted
                                  ? 'You Have Voted'
                                  : 'Voting Active'}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-300"
                            >
                              {idea.activeVoting.totalVotes} votes cast
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-700">
                            Voting ends on{' '}
                            {new Date(idea.activeVoting.votingEndsAt).toLocaleDateString()} at{' '}
                            {new Date(idea.activeVoting.votingEndsAt).toLocaleTimeString()}
                          </p>
                          {idea.activeVoting.hasUserVoted ? (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm text-green-700 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Your vote has been cast and <strong>cannot be changed</strong>.
                                Thank you for participating!
                              </p>
                              {idea.activeVoting.userVotedFor && (
                                <p className="text-xs text-green-600 mt-1">
                                  You voted for:{' '}
                                  <strong>
                                    {
                                      idea.activeVoting.candidates.find(
                                        (c) => c._id === idea.activeVoting?.userVotedFor
                                      )?.username
                                    }
                                  </strong>
                                </p>
                              )}
                            </div>
                          ) : user ? (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                              <p className="text-sm text-amber-700 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <strong>Remember:</strong> Your vote is final and cannot be changed
                                once cast.
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                              <p className="text-sm text-gray-600">
                                Sign in to participate in this voting election.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Candidates */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">
                            Candidates ({idea.activeVoting.candidates.length})
                          </h4>
                          <div className="grid gap-3">
                            {idea.activeVoting.candidates.map((candidate) => {
                              const isUserVote = idea.activeVoting?.userVotedFor === candidate._id;
                              const totalVotes = idea.activeVoting?.totalVotes || 0;
                              const votePercentage =
                                totalVotes > 0 ? (candidate.votesReceived / totalVotes) * 100 : 0;

                              // Find the corresponding adoption request for additional details
                              const candidateDetails = candidate; // Use candidate data from voting object

                              return (
                                <div
                                  key={candidate._id}
                                  className={`border rounded-lg p-4 ${
                                    isUserVote ? 'border-green-300 bg-green-50' : 'border-gray-200'
                                  }`}
                                >
                                  {/* Candidate Header */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <Link
                                        href={`/users/${candidate.username}`}
                                        className="font-medium text-lg text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                      >
                                        {candidate.username}
                                      </Link>
                                      {isUserVote && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                          Your Vote
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-xl text-blue-600">
                                        {candidate.votesReceived}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {votePercentage.toFixed(1)}% of votes
                                      </div>
                                    </div>
                                  </div>

                                  {/* Skills/Domains Tags */}
                                  {candidateDetails && candidateDetails.qualifications && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {(() => {
                                        // Extract meaningful skills from qualifications text
                                        const skillKeywords = [
                                          'JavaScript',
                                          'TypeScript',
                                          'React',
                                          'Node.js',
                                          'Python',
                                          'Java',
                                          'Go',
                                          'Rust',
                                          'Frontend',
                                          'Backend',
                                          'Full-stack',
                                          'DevOps',
                                          'Cloud',
                                          'AWS',
                                          'Azure',
                                          'Docker',
                                          'Kubernetes',
                                          'AI',
                                          'ML',
                                          'Data Science',
                                          'Blockchain',
                                          'UI/UX',
                                          'Design',
                                          'Mobile',
                                          'iOS',
                                          'Android',
                                          'Flutter',
                                          'React Native',
                                          'Leadership',
                                          'Management',
                                          'Startup',
                                          'Enterprise',
                                        ];

                                        const qualText =
                                          candidateDetails.qualifications.toLowerCase();
                                        const foundSkills = skillKeywords
                                          .filter((skill) => qualText.includes(skill.toLowerCase()))
                                          .slice(0, 4);

                                        // If no specific skills found, use domain-based tags
                                        if (foundSkills.length === 0) {
                                          const domainTags = idea.domain?.slice(0, 3) || [
                                            'Technology',
                                          ];
                                          return domainTags.map((domain, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="text-xs px-2 py-1"
                                            >
                                              {domain}
                                            </Badge>
                                          ));
                                        }

                                        return foundSkills.map((skill, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-xs px-2 py-1"
                                          >
                                            {skill}
                                          </Badge>
                                        ));
                                      })()}
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-2 py-1 text-gray-500"
                                      >
                                        {candidateDetails.karma || 0} karma
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Vote Progress Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                    <div
                                      className={`h-3 rounded-full transition-all duration-500 ${
                                        isUserVote ? 'bg-green-500' : 'bg-blue-500'
                                      }`}
                                      style={{
                                        width: `${Math.max(votePercentage, totalVotes === 0 ? 0 : 3)}%`,
                                        minWidth: votePercentage > 0 ? '8px' : '0px',
                                      }}
                                    ></div>
                                  </div>

                                  {/* Expandable Details */}
                                  {candidateDetails && candidateDetails.qualifications && (
                                    <details className="mb-3 group">
                                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 select-none">
                                        <svg
                                          className="w-4 h-4 transition-transform group-open:rotate-90"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                          />
                                        </svg>
                                        View Candidate Application
                                      </summary>
                                      <div className="mt-3 space-y-3 border-t border-gray-200 pt-3 animate-in slide-in-from-top-1 duration-200">
                                        <div className="grid gap-3 md:grid-cols-2">
                                          {candidateDetails.message && (
                                            <div>
                                              <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" />
                                                Message
                                              </h5>
                                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                                                {candidateDetails.message}
                                              </p>
                                            </div>
                                          )}
                                          <div>
                                            <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                                              <Award className="h-3 w-3" />
                                              Qualifications
                                            </h5>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                                              {candidateDetails.qualifications}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                          {candidateDetails.proposedChanges && (
                                            <div>
                                              <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                                                <Settings className="h-3 w-3" />
                                                Proposed Changes
                                              </h5>
                                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                                                {candidateDetails.proposedChanges}
                                              </p>
                                            </div>
                                          )}
                                          {candidateDetails.timeline && (
                                            <div>
                                              <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Timeline
                                              </h5>
                                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                                                {candidateDetails.timeline}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                          <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                              <Star className="h-3 w-3" />
                                              {candidateDetails.karma || 0} karma
                                            </span>
                                            <span className="text-gray-400">Candidate Profile</span>
                                          </div>
                                        </div>
                                      </div>
                                    </details>
                                  )}

                                  {/* Vote Button */}
                                  {!idea.activeVoting?.hasUserVoted && user && (
                                    <Button
                                      size="sm"
                                      variant={isUserVote ? 'default' : 'outline'}
                                      className="w-full"
                                      disabled={submitVoteMutation.isPending}
                                      onClick={() => {
                                        setSelectedCandidate(candidateDetails);
                                        setVotingDialogOpen(true);
                                      }}
                                    >
                                      <Vote className="h-4 w-4 mr-2" />
                                      Vote for {candidate.username}
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {!user && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">Sign in to participate in voting</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ownership History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Ownership History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Created by {idea.author?.username}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(idea.createdAt || '').toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">Original Creator</Badge>
                      </div>

                      {/* Show pending adoption info if available */}
                      {idea.pendingAdoption && (
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Adoption requested by {idea.pendingAdoption.adopter.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(idea.pendingAdoption.requestedAt).toLocaleDateString()}
                            </p>
                            {idea.pendingAdoption.message && (
                              <p className="text-xs text-gray-600 mt-1">
                                "{idea.pendingAdoption.message}"
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Adoption Request Form */}
                {canRequestAdoption && <AdoptionRequestForm ideaId={ideaId} currentUser={user} />}

                {/* Management Controls */}
                {canManageOwnership && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Management Controls
                      </CardTitle>
                      <CardDescription>
                        Manage ownership settings and transfer options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Change Ownership Type
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Crown className="h-4 w-4 mr-2" />
                          Transfer Ownership
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Update License
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current Adoption Requests */}
                {idea.adoptionStatus === 'pending' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Pending Adoption Request
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {idea.pendingAdoption ? (
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {idea.pendingAdoption.adopter.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Requested on{' '}
                                  {new Date(idea.pendingAdoption.requestedAt).toLocaleDateString()}
                                </p>
                                {idea.pendingAdoption.message && (
                                  <p className="text-sm text-gray-700 mt-2">
                                    "{idea.pendingAdoption.message}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <p className="text-blue-800 text-sm">
                              There are adoption requests pending review. If you are the current
                              maintainer, you can review and respond to these requests.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Idea Header */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Title and Ownership */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <OwnershipBadge ownershipType={idea.ownershipType} />
                    {idea.adoptionStatus && idea.adoptionStatus !== 'adopted' && (
                      <Badge
                        variant="outline"
                        className={`${
                          idea.adoptionStatus === 'available'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : idea.adoptionStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {idea.adoptionStatus === 'available'
                          ? 'Available for Adoption'
                          : idea.adoptionStatus === 'pending'
                            ? 'Adoption Pending'
                            : 'Not Available'}
                      </Badge>
                    )}
                    {idea.license && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileCheck className="h-3 w-3" />
                        {idea.license.type}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Creator and Maintainer Info */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Created by</span>
                    <Link
                      href={`/users/${idea.originalCreator?.username}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {idea.originalCreator?.username || 'Anonymous'}
                    </Link>
                  </div>

                  {idea.currentMaintainer &&
                    idea.currentMaintainer._id !== idea.originalCreator._id && (
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4" />
                        <span>Maintained by</span>
                        <Link
                          href={`/users/${idea.currentMaintainer.username}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {idea.currentMaintainer.username}
                        </Link>
                      </div>
                    )}

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(idea.createdAt || '').toLocaleDateString()}</span>
                  </div>

                  {idea.parentId && (
                    <div className="flex items-center space-x-2">
                      <GitFork className="h-4 w-4" />
                      <span className="text-purple-600 font-medium">Forked from another idea</span>
                    </div>
                  )}
                </div>

                {/* Tags and Domain */}
                <div className="flex flex-wrap gap-2">
                  {idea.domain?.map((d: string) => (
                    <Badge key={d} variant="secondary" className="bg-blue-100 text-blue-800">
                      {d}
                    </Badge>
                  ))}
                  {idea.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Description Preview */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                    {idea.description.length > 150
                      ? `${idea.description.substring(0, 150)}...`
                      : idea.description}
                  </p>
                  {idea.description.length > 150 && (
                    <p className="text-primary-600 text-xs font-medium mt-2">
                      View full description in Overview tab
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-gray-900">
                        {idea.upvotes || 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">upvotes</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <GitFork className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-gray-900">
                        {idea.forkCount || 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">forks</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-gray-900">--</span>
                    </div>
                    <span className="text-xs text-gray-500">comments</span>
                  </div>
                </div>

                {/* Adoption Alert */}
                {idea.adoptionStatus === 'available' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-green-800 text-sm">Available for adoption</p>
                    </div>
                  </div>
                )}

                {idea.adoptionStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <p className="text-yellow-800 text-sm">Adoption pending review</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Adoption Request Button */}
              {canRequestAdoption && (
                <Button
                  onClick={handleAdoptionRequest}
                  disabled={createAdoptionRequestMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {createAdoptionRequestMutation.isPending ? 'Submitting...' : 'Request Adoption'}
                </Button>
              )}

              {user && user._id !== idea.originalCreator?._id && (
                <>
                  <Link
                    href={`/ideas/${ideaId}/fork`}
                    className="w-full btn-primary px-4 py-2 rounded-md block text-center"
                  >
                    <GitFork className="h-4 w-4 mr-2 inline" />
                    Fork This Idea
                  </Link>
                  <Button
                    onClick={handleUpvote}
                    disabled={upvoteMutation.isPending}
                    variant={idea.hasUpvoted ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Star className={`h-4 w-4 mr-2 ${idea.hasUpvoted ? 'fill-current' : ''}`} />
                    {upvoteMutation.isPending
                      ? 'Processing...'
                      : `${idea.hasUpvoted ? 'Upvoted' : 'Upvote'} (${idea.upvotes || 0})`}
                  </Button>
                </>
              )}
              {user && user._id === idea.originalCreator?._id && (
                <Link
                  href={`/ideas/${ideaId}/edit`}
                  className="w-full btn-secondary px-4 py-2 rounded-md block text-center"
                >
                  <Settings className="h-4 w-4 mr-2 inline" />
                  Edit Idea
                </Link>
              )}
              <Button variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Share Idea
              </Button>
            </CardContent>
          </Card>

          {/* License Information */}
          {idea.license && <LicenseInfo license={idea.license.type} />}

          {/* Family Tree Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Idea Family Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FamilyTreePreview ideaId={ideaId} />
              <div className="mt-4">
                <Link
                  href={`/ideas/${ideaId}/tree`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Full Tree →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Creator/Maintainer Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Original Creator */}
              {idea.author && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Original Creator</span>
                  </div>
                  <div className="ml-6">
                    <Link
                      href={`/users/${idea.author.username}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      @{idea.author.username}
                    </Link>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Karma:</span> {idea.author.karma || 0}
                    </div>
                  </div>
                </div>
              )}

              {/* Current Maintainer */}
              {idea.currentMaintainer &&
                idea.currentMaintainer._id !== idea.originalCreator._id && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Current Maintainer</span>
                    </div>
                    <div className="ml-6">
                      <Link
                        href={`/users/${idea.currentMaintainer.username}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        @{idea.currentMaintainer.username}
                      </Link>
                    </div>
                  </div>
                )}

              {/* Adoption Status */}
              {canRequestAdoption && (
                <div className="pt-3 border-t">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available for Adoption
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    This idea is looking for a new maintainer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voting Confirmation Dialog */}
      <AlertDialog open={votingDialogOpen} onOpenChange={setVotingDialogOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] w-[95vw] sm:w-full flex flex-col my-auto mx-auto overflow-hidden">
          <AlertDialogHeader className="flex-shrink-0">
            <AlertDialogTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-blue-600" />
              Confirm Your Vote
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You are about to cast your vote for{' '}
              <span className="font-semibold text-gray-900">{selectedCandidate?.username}</span>.
              Please review their profile and application carefully before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex-1 overflow-y-auto py-2 -mx-6 px-6 min-h-0">
            {/* Scrollable content wrapper with negative margins for full width scrolling */}

            {selectedCandidate && (
              <div className="space-y-4 my-4">
                {/* Candidate Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {selectedCandidate.username}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {selectedCandidate.karma || 0} karma points
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/users/${selectedCandidate.username}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      View Profile <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Skills Preview */}
                  {selectedCandidate.qualifications && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(() => {
                        const skillKeywords = [
                          'JavaScript',
                          'TypeScript',
                          'React',
                          'Node.js',
                          'Python',
                          'Java',
                          'Go',
                          'Rust',
                          'Frontend',
                          'Backend',
                          'Full-stack',
                          'DevOps',
                          'Cloud',
                          'AWS',
                          'Azure',
                          'Docker',
                          'Kubernetes',
                          'AI',
                          'ML',
                          'Data Science',
                          'Blockchain',
                          'UI/UX',
                          'Design',
                          'Mobile',
                          'iOS',
                          'Android',
                          'Flutter',
                          'React Native',
                          'Leadership',
                          'Management',
                          'Startup',
                          'Enterprise',
                        ];

                        const qualText = selectedCandidate.qualifications.toLowerCase();
                        const foundSkills = skillKeywords
                          .filter((skill) => qualText.includes(skill.toLowerCase()))
                          .slice(0, 4);

                        if (foundSkills.length === 0) {
                          const domainTags = idea?.domain?.slice(0, 3) || ['Technology'];
                          return domainTags.map((domain, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {domain}
                            </Badge>
                          ));
                        }

                        return foundSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Application Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Application Summary
                  </h4>

                  <div className="grid gap-3 text-sm">
                    {selectedCandidate.message && (
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <h5 className="font-medium text-gray-700 mb-1">Message:</h5>
                        <p className="text-gray-600">{selectedCandidate.message}</p>
                      </div>
                    )}

                    {selectedCandidate.qualifications && (
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <h5 className="font-medium text-gray-700 mb-1">Qualifications:</h5>
                        <p className="text-gray-600">{selectedCandidate.qualifications}</p>
                      </div>
                    )}

                    {selectedCandidate.proposedChanges && (
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <h5 className="font-medium text-gray-700 mb-1">Proposed Changes:</h5>
                        <p className="text-gray-600">{selectedCandidate.proposedChanges}</p>
                      </div>
                    )}

                    {selectedCandidate.timeline && (
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <h5 className="font-medium text-gray-700 mb-1">Timeline:</h5>
                        <p className="text-gray-600">{selectedCandidate.timeline}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <h5 className="font-medium text-amber-800 mb-1">Important Notice</h5>
                      <p className="text-amber-700">
                        Your vote is <strong>final and cannot be changed</strong> once submitted.
                        Make sure you've reviewed the candidate's profile and qualifications
                        carefully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* End scrollable content wrapper */}

          <AlertDialogFooter className="gap-3 flex-shrink-0 border-t pt-3">
            <AlertDialogCancel className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!selectedCandidate) return;

                try {
                  await submitVoteMutation.mutateAsync({
                    ideaId,
                    data: {
                      candidateRequestId: selectedCandidate._id,
                      supportingReason: `I believe ${selectedCandidate.username} is the best candidate for this adoption based on their qualifications and proposed approach.`,
                    },
                  });
                  toast({
                    title: 'Vote Cast Successfully! 🗳️',
                    description: `Your vote for ${selectedCandidate.username} has been recorded and cannot be changed.`,
                  });
                  setVotingDialogOpen(false);
                  setSelectedCandidate(null);
                } catch (error: any) {
                  toast({
                    title: 'Voting Failed',
                    description:
                      error.response?.data?.message || 'Failed to submit vote. Please try again.',
                    variant: 'destructive',
                  });
                }
              }}
              disabled={submitVoteMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {submitVoteMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Casting Vote...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Cast My Vote
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
