
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; // Adjust threshold for truncation
  const shouldTruncate = content.length > maxLength && !isExpanded;

  const displayContent = shouldTruncate ? `${content.slice(0, maxLength)}...` : content;

  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-inner relative">
      <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">{platform}</h3>
      <p className="text-[var(--text-primary)] whitespace-pre-wrap text-sm mb-4">
        {displayContent}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-[var(--primary)] text-sm hover:underline"
        >
          Show More
        </button>
      )}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[var(--secondary)] text-sm hover:underline mt-2"
        >
          Show Less
        </button>
      )}
      <button
        onClick={() => onCopy(content)}
        className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm mt-2"
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
