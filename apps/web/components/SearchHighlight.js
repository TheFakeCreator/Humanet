import React from 'react';

export default function SearchHighlight({ text, searchTerm }) {
  if (!searchTerm || !text) {
    return <span>{text}</span>;
  }

  // Split text by search term (case insensitive)
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-800 font-semibold px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
