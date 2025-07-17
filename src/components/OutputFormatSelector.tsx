import React from 'react';
import { motion } from 'framer-motion';

interface OutputFormatSelectorProps {
  selectedFormats: string[];
  onSelectFormat: (format: string) => void;
}

const formats = ['Twitter', 'LinkedIn', 'Blog Summary', 'Instagram Caption'];

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({
  selectedFormats,
  onSelectFormat,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {formats.map((format) => (
        <motion.button
          key={format}
          type="button"
          onClick={() => onSelectFormat(format)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${selectedFormats.includes(format)
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {format}
        </motion.button>
      ))}
    </div>
  );
};

export default OutputFormatSelector;