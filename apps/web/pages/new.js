import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageUpload from '../components/ImageUpload';
import { trackIdeaCreation, setCurrentUser } from '../utils/activityTracking';

export default function NewIdea() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    createdBy: '',
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.createdBy.trim()
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tags,
        createdBy: formData.createdBy.trim(),
        images: images.map(img => ({
          id: img.id,
          name: img.name,
          size: img.size,
          type: img.type,
          data: img.data,
        })),
      };

      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/ideas`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create idea');
      }

      const result = await response.json();

      // Set current user for activity tracking
      setCurrentUser(formData.createdBy.trim());

      // Track the idea creation
      trackIdeaCreation(
        formData.createdBy.trim(),
        result.data.id,
        formData.title.trim(),
        tags
      );

      alert('Idea created successfully!');
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Post a New Idea
              </h1>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error creating idea
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                      placeholder="Enter a compelling title for your idea"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                  </label>
                  <div className="mt-1">
                    <MarkdownEditor
                      value={formData.description}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          description: value,
                        }))
                      }
                      height="200px"
                      placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
                      disabled={submitting}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Be descriptive! The more details you provide, the easier it
                    will be for others to understand and contribute to your
                    idea.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tags
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                      placeholder="ai, web-development, sustainability, healthcare"
                      disabled={submitting}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Separate tags with commas to help others discover your idea.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Optional)
                  </label>
                  <ImageUpload
                    images={images}
                    onImagesChange={setImages}
                    maxImages={5}
                    disabled={submitting}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Add screenshots, mockups, or visual examples to better
                    illustrate your idea.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="createdBy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Username *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="createdBy"
                      id="createdBy"
                      value={formData.createdBy}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                      placeholder="your_username"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Terms Reminder */}
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Open Innovation Reminder
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          By posting this idea, you're contributing to HumaNet's
                          open innovation commons. Your idea will be available
                          for others to build upon, fork, and implement.
                          <strong>
                            {' '}
                            Repository maintainers (not original posters) have
                            authority over implementations.
                          </strong>
                        </p>
                        <p className="mt-2">
                          Review our{' '}
                          <Link
                            href="/terms"
                            className="font-medium underline hover:text-amber-600"
                          >
                            Terms of Service
                          </Link>{' '}
                          for full details on intellectual property and
                          collaboration rights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Posting...
                      </>
                    ) : (
                      'Post Idea'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
