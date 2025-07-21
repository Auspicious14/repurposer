
// // components/OutputCard.tsx (partial update)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareButtons from './ShareButtons';

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
  const [editContent, setEditContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const maxLength = 200;

  const shouldTruncate = content.length > maxLength && !isExpanded;
  const displayContent = shouldTruncate ? `${content.slice(0, maxLength)}...` : content;

  const formattedContent = () => {
    if (platform === "Twitter/X (Thread)") {
      const tweets = editContent.split("\n").filter((t) => t.trim());
      return tweets.length > 1 ? (
        tweets.map((tweet, i) => (
          <p key={i} className="text-sm mb-1">
            [{i + 1}/{tweets.length}] {tweet}
          </p>
        ))
      ) : (
        <p className="text-sm">{editContent}</p>
      );
    } else if (platform === "LinkedIn") {
      const paragraphs = editContent.split("\n\n").filter((p) => p.trim());
      return paragraphs.map((p, i) => (
        <p key={i} className="text-sm mb-2">
          {p}
        </p>
      ));
    }
    return <p className="text-sm whitespace-pre-wrap">{editContent}</p>;
  };

  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-inner relative">
      <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">{platform}</h3>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border border-[var(--text-secondary)] rounded mb-2 text-sm"
          rows={5}
        />
      ) : (
        <div className="text-[var(--text-primary)] mb-4">{formattedContent()}</div>
      )}
      {shouldTruncate && !isEditing && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-[var(--primary)] text-sm hover:underline"
        >
          Show More
        </button>
      )}
      {isExpanded && !isEditing && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[var(--secondary)] text-sm hover:underline mt-2"
        >
          Show Less
        </button>
      )}
      <div className="flex gap-2 flex-wrap mt-2">
        <button
          onClick={() => (isEditing ? onCopy(editContent) : onCopy(content))}
          className="px-3 py-1 bg-[var(--primary)] text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
        >
          {isEditing ? "Save & Copy" : "Copy to Clipboard"}
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 bg-[var(--secondary)] text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
        >
          {isEditing ? "Cancel Edit" : "Edit"}
        </button>
        <ShareButtons platform={platform} url={window.location.href} title={editContent} />
        <button
          onClick={() => {
            const blob = new Blob([editContent], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${platform}_output.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
        >
          Download
        </button>
      </div>
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
