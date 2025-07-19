
import React from "react";
import { motion } from "framer-motion";

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
  tones?: string[];
}

const defaultTones = ["Professional", "Friendly", "Witty", "Informative", "Casual"];

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
  tones = defaultTones,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-lg font-medium text-[var(--text-primary)] mb-2">
        Choose Tone
      </label>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <motion.button
            key={tone}
            type="button"
            onClick={() => onSelectTone(tone)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${selectedTone === tone
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Select ${tone} tone`}
          >
            {tone}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
