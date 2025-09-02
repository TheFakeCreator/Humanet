import React, { useState } from 'react';
import { useCreateIdea } from '@/hooks/useIdeas';
import { useRouter } from 'next/navigation';

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
      return;
    }

    try {
      const idea = await createMutation.mutateAsync(formData);
      onSuccess?.();
      router.push(`/ideas/${idea._id}`);
    } catch (error) {
      console.error('Failed to create idea:', error);
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
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((prev: CreateIdeaData) => ({ ...prev, title: e.target.value }))}
          className="input w-full"
          placeholder="What's your big idea?"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: CreateIdeaData) => ({ ...prev, description: e.target.value }))}
          className="textarea w-full h-32"
          placeholder="Describe your idea in detail..."
          required
        />
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
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline px-6"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={createMutation.isPending || !formData.title.trim() || !formData.description.trim()}
          className="btn-primary px-6 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Idea'}
        </button>
      </div>
    </form>
  );
}
