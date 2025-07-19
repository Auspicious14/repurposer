// components/ToneSelector.tsx
import React from "react";
import { motion } from "framer-motion";

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
  tones?: string[]; // Optional prop for custom tones
}

const defaultTones = ["Professional", "Friendly", "Witty", "Informative"];

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
  tones = defaultTones,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor="tone-select" className="block text-lg font-medium text-[var(--text-primary)] mb-2">
        Choose Tone
      </label>
      <div className="relative">
        <motion.select
          id="tone-select"
          value={selectedTone}
          onChange={(e) => onSelectTone(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--text-secondary)] rounded-md bg-[var(--card-bg)] text-[var(--text-primary)] focus:ring-[var(--primary)] focus:border-[var(--primary)] text-sm transition-all duration-200"
          whileFocus={{ scale: 1.02 }}
          aria-label="Select content tone"
        >
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </motion.select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm">
          {selectedTone}
        </span>
      </div>
    </div>
  );
};

export default ToneSelector;
