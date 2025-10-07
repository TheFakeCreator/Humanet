import React, { useState } from 'react';
import { useCreateIdea } from '@/hooks/useIdeas';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
// import { CreateIdeaDTO } from '@humanet/shared';
import {
  Lightbulb,
  FolderOpen,
  FileText,
  Settings,
  Plus,
  X,
  Sparkles,
  GitBranch,
} from 'lucide-react';

// Temporary interface until shared types are fixed
interface CreateIdeaFormData {
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
  autoCreateRepository?: boolean;
  repositoryTemplate?: 'basic' | 'research' | 'technical';
}

interface IdeaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IdeaForm({ onSuccess, onCancel }: IdeaFormProps) {
  const router = useRouter();
  const createMutation = useCreateIdea();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateIdeaFormData>({
    title: '',
    description: '',
    tags: [],
    domain: [],
    autoCreateRepository: true,
    repositoryTemplate: 'basic',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔧 Frontend form data before submission:', formData);

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both title and description',
        variant: 'destructive',
      });
      return;
    }

    // Validate title and description length
    if (formData.title.trim().length < 5) {
      toast({
        title: 'Title too short',
        description: 'Title must be at least 5 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (formData.description.trim().length < 20) {
      toast({
        title: 'Description too short',
        description: 'Description must be at least 20 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Clean up the data before sending - INCLUDE REPOSITORY OPTIONS
      const cleanData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
        domain: formData.domain && formData.domain.length > 0 ? formData.domain : undefined,
        autoCreateRepository: formData.autoCreateRepository,
        repositoryTemplate: formData.repositoryTemplate,
      };

      console.log('🔧 Final data being sent to API:', cleanData);

      const idea = await createMutation.mutateAsync(cleanData);
      toast({
        title: 'Success!',
        description: 'Your idea has been created successfully',
      });
      onSuccess?.();
      router.push(`/ideas/${idea._id}`);
    } catch (error: any) {
      console.error('Failed to create idea:', error);
      toast({
        title: 'Error creating idea',
        description: error?.response?.data?.message || error?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev: CreateIdeaFormData) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev: CreateIdeaFormData) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || [],
    }));
  };

  const domainOptions = [
    'Technology',
    'Science',
    'Business',
    'Healthcare',
    'Education',
    'Environment',
    'Social',
    'Art & Design',
    'Engineering',
    'Research',
  ];

  const repositoryTemplates = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Simple idea structure with core documents',
      icon: <FileText className="h-5 w-5" />,
      files: ['idea.md', 'scope.md', 'problem.md'],
    },
    {
      id: 'research',
      name: 'Research',
      description: 'Academic research with methodology and analysis',
      icon: <Sparkles className="h-5 w-5" />,
      files: ['idea.md', 'methodology.md', 'literature-review.md', 'analysis/'],
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Software development with architecture and specs',
      icon: <Settings className="h-5 w-5" />,
      files: ['idea.md', 'architecture.md', 'technical-specs.md', 'docs/'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Share Your Idea</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your idea into a collaborative repository where others can contribute, build
          upon, and help bring it to life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Idea Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Idea Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Idea Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter a clear, descriptive title for your idea..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                A good title helps others quickly understand your idea
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                placeholder="Describe your idea in detail. What problem does it solve? How would it work? What makes it unique?"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide enough detail for others to understand and contribute to your idea
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Repository Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Repository Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-create Repository Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <GitBranch className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Initialize Repository</h4>
                  <p className="text-sm text-gray-600">
                    Create a structured file repository for your idea
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoCreateRepository}
                  onChange={(e) =>
                    setFormData({ ...formData, autoCreateRepository: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Repository Template Selection */}
            {formData.autoCreateRepository && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Repository Template
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {repositoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.repositoryTemplate === template.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, repositoryTemplate: template.id as any })
                      }
                    >
                      <input
                        type="radio"
                        name="repositoryTemplate"
                        value={template.id}
                        checked={formData.repositoryTemplate === template.id}
                        onChange={() =>
                          setFormData({ ...formData, repositoryTemplate: template.id as any })
                        }
                        className="sr-only"
                      />
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          {template.icon}
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Includes:</p>
                          {template.files.map((file, index) => (
                            <div
                              key={index}
                              className="text-xs text-gray-500 flex items-center space-x-1"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categorization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Categorization & Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Domain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domain (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {domainOptions.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.domain?.includes(domain)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.domain?.includes(domain) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            domain: [...(formData.domain || []), domain],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            domain: formData.domain?.filter((d) => d !== domain) || [],
                          });
                        }
                      }}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Add relevant tags..."
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="px-8">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            loading={createMutation.isPending}
            loadingText="Creating idea..."
            className="px-8"
          >
            Create Idea
          </Button>
        </div>
      </form>
    </div>
  );
}
