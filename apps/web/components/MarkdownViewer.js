import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const MarkdownViewer = ({
  content,
  className = '',
  showBorder = false,
  maxHeight = null,
}) => {
  if (!content) {
    return null;
  }

  const containerClasses = [
    'markdown-viewer',
    'prose',
    'prose-sm',
    'dark:prose-invert',
    'max-w-none',
    className,
    showBorder
      ? 'border border-gray-200 dark:border-gray-700 rounded-lg p-4'
      : '',
    maxHeight ? 'overflow-y-auto' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyle = maxHeight ? { maxHeight } : {};

  return (
    <div className={containerClasses} style={containerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Heading components
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-semibold mb-2 text-gray-900 dark:text-white uppercase tracking-wide">
              {children}
            </h6>
          ),

          // Paragraph and text
          p: ({ children }) => (
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="mb-3 ml-6 list-disc text-gray-700 dark:text-gray-300 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-6 list-decimal text-gray-700 dark:text-gray-300 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-300">{children}</li>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 mb-3 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic rounded-r">
              {children}
            </blockquote>
          ),

          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-3 p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 rounded-lg overflow-x-auto text-sm">
              {children}
            </pre>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
              <svg
                className="inline w-3 h-3 ml-1 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ),

          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-sm mb-3 border dark:border-gray-600"
              loading="lazy"
            />
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3 -mx-1">
              <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left font-semibold text-gray-900 dark:text-white text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-gray-300 dark:border-gray-600" />
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,

          // Strikethrough (GFM)
          del: ({ children }) => (
            <del className="line-through text-gray-500 dark:text-gray-400">
              {children}
            </del>
          ),

          // Task lists (GFM)
          input: ({ checked, type }) =>
            type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mr-2 rounded border-gray-300 dark:border-gray-600"
              />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
