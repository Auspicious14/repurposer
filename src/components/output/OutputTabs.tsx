import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OutputTabsProps {
  results: {
    platform: string;
    content: string;
  }[];
}

export const OutputTabs: React.FC<OutputTabsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState(results[0]?.platform || "");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000); // Hide after 2 seconds
  };

  if (!results.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {results.map((result) => (
            <button
              key={result.platform}
              onClick={() => setActiveTab(result.platform)}
              className={`
                ${
                  activeTab === result.platform
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              `}
            >
              {result.platform}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {results.map(
          (result) =>
            activeTab === result.platform && (
              <motion.div
                key={result.platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-4 rounded-lg shadow-inner"
              >
                <p className="text-gray-800 whitespace-pre-wrap">
                  {result.content}
                </p>
                <button
                  onClick={() => handleCopy(result.content)}
                  className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200"
                >
                  Copy to Clipboard
                </button>
              </motion.div>
            )
        )}
      </div>

      <AnimatePresence>
        {showCopiedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
