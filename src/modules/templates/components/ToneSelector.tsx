
"use client";

import React from 'react';
import { TONES } from '../constants';

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        Tone (for preview only) *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TONES.map(tone => (
          <ToneButton
            key={tone.value}
            tone={tone}
            isSelected={selectedTone === tone.value}
            onSelect={() => onToneChange(tone.value)}
          />
        ))}
      </div>
    </div>
  );
};

interface ToneButtonProps {
  tone: { value: string; label: string };
  isSelected: boolean;
  onSelect: () => void;
}

const ToneButton: React.FC<ToneButtonProps> = ({ tone, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md'
          : 'bg-white dark:bg-gray-800 text-[var(--text-primary)] border-gray-300 dark:border-gray-600 hover:border-[var(--primary)] hover:shadow-sm'
      }`}
    >
      {tone.label}
    </button>
  );
};
