import React from 'react';
import { motion } from 'framer-motion';

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
}

const tones = ['Professional', 'Friendly', 'Witty', 'Informative'];

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor="tone-select" className="block text-xl font-semibold text-gray-800 mb-2">
        Choose Tone
      </label>
      <motion.select
        id="tone-select"
        value={selectedTone}
        onChange={(e) => onSelectTone(e.target.value)}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        whileFocus={{ scale: 1.02 }}
      >
        {tones.map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default ToneSelector;