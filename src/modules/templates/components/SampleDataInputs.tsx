
"use client";

import React from 'react';

interface SampleDataInputsProps {
  placeholders: string[];
  sampleData: Record<string, string>;
  onSampleDataChange: (key: string, value: string) => void;
}

export const SampleDataInputs: React.FC<SampleDataInputsProps> = ({
  placeholders,
  sampleData,
  onSampleDataChange
}) => {
  if (placeholders.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
        Sample Content (for preview)
      </label>
      <div className="space-y-3">
        {placeholders.map(placeholder => (
          <SampleDataInput
            key={placeholder}
            placeholder={placeholder}
            value={sampleData[placeholder] || ''}
            onChange={(value) => onSampleDataChange(placeholder, value)}
          />
        ))}
      </div>
    </div>
  );
};

interface SampleDataInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SampleDataInput: React.FC<SampleDataInputProps> = ({
  placeholder,
  value,
  onChange
}) => {
  return (
    <div>
      <label className="block text-xs text-[var(--text-secondary)] mb-1 capitalize">
        {placeholder.replace(/([A-Z])/g, ' $1').trim()}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent transition-colors duration-200"
        placeholder={`Sample ${placeholder}`}
      />
    </div>
  );
};
