import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputCardProps {
  platform: string;
  content: string;
  onCopy: (text: string) => void;
  showCopiedMessage: boolean;
}

const OutputCard: React.FC<OutputCardProps> = ({
  platform,
  content,
  onCopy,
  showCopiedMessage,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{platform}</h3>
      <p className="text-gray-700 whitespace-pre-wrap text-sm mb-4">{content}</p>
      <button
        onClick={() => onCopy(content)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
      >
        Copy to Clipboard
      </button>
      <AnimatePresence>
        {showCopiedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutputCard;