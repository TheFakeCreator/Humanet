import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditor = ({
  value = '',
  onChange,
  placeholder = 'Write your idea description here...',
  height = '200px',
  disabled = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('edit');

  const handleChange = useCallback(
    e => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );

  return (
    <div className={`markdown-editor-container ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-0">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'edit'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
        <div className="flex-1 border-b-2 border-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="border border-gray-300 rounded-b-md">
        {activeTab === 'edit' ? (
          <div className="relative">
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              style={{ height }}
              className="w-full p-3 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed whitespace-pre-wrap"
              rows={10}
              wrap="soft"
              spellCheck="false"
            />
            {/* Toolbar with markdown hints */}
            <div className="absolute bottom-2 right-2 flex space-x-1 text-xs text-gray-400">
              <span className="bg-gray-100 px-1 rounded">**bold**</span>
              <span className="bg-gray-100 px-1 rounded">*italic*</span>
              <span className="bg-gray-100 px-1 rounded">`code`</span>
              <span className="bg-gray-100 px-1 rounded"># heading</span>
            </div>
          </div>
        ) : (
          <div
            className="p-3 prose prose-sm max-w-none overflow-y-auto whitespace-pre-wrap"
            style={{ height, minHeight: height }}
          >
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for markdown elements
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-3 text-gray-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 ml-4 list-disc text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 ml-4 list-decimal text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-2 bg-blue-50 text-gray-700 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ inline, children }) => {
                    return inline ? (
                      <code className="px-1 py-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block p-3 bg-gray-900 text-gray-100 rounded text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="mb-2 p-3 bg-gray-900 text-gray-100 rounded overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-400 italic">
                Nothing to preview. Write some content in the Edit tab.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="mt-2 text-xs text-gray-500">
        <details className="cursor-pointer">
          <summary className="hover:text-gray-700">Markdown Help</summary>
          <div className="mt-2 p-3 bg-gray-50 rounded border">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold mb-1">Text Formatting</h4>
                <p>
                  <code>**bold**</code> → <strong>bold</strong>
                </p>
                <p>
                  <code>*italic*</code> → <em>italic</em>
                </p>
                <p>
                  <code>`code`</code> →{' '}
                  <code className="bg-gray-200 px-1 rounded">code</code>
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Structure</h4>
                <p>
                  <code># Heading 1</code>
                </p>
                <p>
                  <code>## Heading 2</code>
                </p>
                <p>
                  <code>- List item</code>
                </p>
                <p>
                  <code>1. Numbered item</code>
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Links</h4>
                <p>
                  <code>[Link text](URL)</code>
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Code & Quotes</h4>
                <p>
                  <code>```</code> → Code block
                </p>
                <p>
                  <code>&gt;</code> → Quote block
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;
