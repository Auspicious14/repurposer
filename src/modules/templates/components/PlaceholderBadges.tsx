"use client";

import React from "react";

interface PlaceholderBadgesProps {
  placeholders: string[];
}

export const PlaceholderBadges: React.FC<PlaceholderBadgesProps> = ({
  placeholders,
}) => {
  if (placeholders.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-sm text-[var(--text-secondary)] mb-2">
        Detected placeholders:
      </p>
      <div className="flex flex-wrap gap-2">
        {placeholders.map((placeholder) => (
          <PlaceholderBadge key={placeholder} placeholder={placeholder} />
        ))}
      </div>
    </div>
  );
};

interface PlaceholderBadgeProps {
  placeholder: string;
}

const PlaceholderBadge: React.FC<PlaceholderBadgeProps> = ({ placeholder }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 bg-[var(--primary)] text-white text-xs rounded-full font-medium">
      <svg
        className="w-3 h-3 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      {`{{${placeholder}}}`}
    </span>
  );
};
