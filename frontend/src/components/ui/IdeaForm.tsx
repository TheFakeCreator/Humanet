import React, { useState } from 'react';
import { useCreateIdea } from '@/hooks/useIdeas';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CreateIdeaData {
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
}

interface IdeaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IdeaForm({ onSuccess, onCancel }: IdeaFormProps) {
  const router = useRouter();
  const createMutation = useCreateIdea();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateIdeaData>({
    title: '',
    description: '',
    tags: [],
    domain: [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [domainInput, setDomainInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and description",
        variant: "destructive",
      });
      return;
    }

    // Validate title and description length
    if (formData.title.trim().length < 5) {
      toast({
        title: "Title too short",
        description: "Title must be at least 5 characters long",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.trim().length < 20) {
      toast({
        title: "Description too short", 
        description: "Description must be at least 20 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean up the data before sending
      const cleanData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
        domain: formData.domain && formData.domain.length > 0 ? formData.domain : undefined,
      };
      
      const idea = await createMutation.mutateAsync(cleanData);
      toast({
        title: "Success!",
        description: "Your idea has been created successfully",
      });
      onSuccess?.();
      router.push(`/ideas/${idea._id}`);
    } catch (error: any) {
      console.error('Failed to create idea:', error);
      toast({
        title: "Error creating idea",
        description: error?.response?.data?.message || error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev: CreateIdeaData) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev: CreateIdeaData) => ({
      ...prev,
      tags: prev.tags?.filter((t: string) => t !== tag) || []
    }));
  };

  const addDomain = () => {
    if (domainInput.trim() && !formData.domain?.includes(domainInput.trim())) {
      setFormData((prev: CreateIdeaData) => ({
        ...prev,
        domain: [...(prev.domain || []), domainInput.trim()]
      }));
      setDomainInput('');
    }
  };

  const removeDomain = (domain: string) => {
    setFormData((prev: CreateIdeaData) => ({
      ...prev,
      domain: prev.domain?.filter((d: string) => d !== domain) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Idea Title * 
          <span className="text-sm text-gray-500 ml-2">
            ({formData.title.length}/200)
          </span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((prev: CreateIdeaData) => ({ ...prev, title: e.target.value }))}
          className={`input w-full ${
            formData.title.length > 0 && formData.title.length < 5 
              ? 'border-red-300 focus:border-red-500' 
              : ''
          }`}
          placeholder="What's your big idea?"
          maxLength={200}
          required
        />
        {formData.title.length > 0 && formData.title.length < 5 && (
          <p className="text-red-600 text-sm mt-1">Title must be at least 5 characters</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
          <span className="text-sm text-gray-500 ml-2">
            ({formData.description.length}/5000)
          </span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: CreateIdeaData) => ({ ...prev, description: e.target.value }))}
          className={`textarea w-full h-32 ${
            formData.description.length > 0 && formData.description.length < 20 
              ? 'border-red-300 focus:border-red-500' 
              : ''
          }`}
          placeholder="Describe your idea in detail..."
          maxLength={5000}
          required
        />
        {formData.description.length > 0 && formData.description.length < 20 && (
          <p className="text-red-600 text-sm mt-1">Description must be at least 20 characters</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="input flex-1"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="btn-secondary px-4"
          >
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domains
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
            className="input flex-1"
            placeholder="e.g., Technology, Healthcare, Education..."
          />
          <button
            type="button"
            onClick={addDomain}
            className="btn-secondary px-4"
          >
            Add
          </button>
        </div>
        {formData.domain && formData.domain.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.domain.map((domain: string) => (
              <span
                key={domain}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md"
              >
                {domain}
                <button
                  type="button"
                  onClick={() => removeDomain(domain)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          loading={createMutation.isPending}
          loadingText="Creating Idea..."
          disabled={!formData.title.trim() || !formData.description.trim()}
          size="lg"
        >
          Create Idea
        </Button>
      </div>
    </form>
  );
}
