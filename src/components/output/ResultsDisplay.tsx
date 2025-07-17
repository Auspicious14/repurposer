import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OutputCard from "./OutputCard";

interface ResultsDisplayProps {
  results: { platform: string; content: string }[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [active, setActive] = useState(results[0]?.platform);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = results.find((r) => r.platform === active);

  return (
    <div>
      <div className="flex gap-4 border-b mb-4">
        {results.map((r) => (
          <button
            key={r.platform}
            onClick={() => setActive(r.platform)}
            className={`px-3 py-2 text-sm font-medium ${
              active === r.platform
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {r.platform}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.platform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <OutputCard
              platform={current.platform}
              content={current.content}
              onCopy={handleCopy}
              showCopiedMessage={copied}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
