import React, { useState } from "react";

interface InputFormProps {
  onGenerate: (data: {
    content: string;
    selectedPlatforms: string[];
    selectedTone: string;
  }) => void;
}

import { motion } from "framer-motion";

const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);

  const platforms = ["Twitter", "LinkedIn", "Instagram"];
  const tones = ["Professional", "Friendly", "Witty"];

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGenerate({
      content,
      selectedPlatforms,
      selectedTone,
    });
    setIsLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label htmlFor="content" className="sr-only">
          Paste your content
        </label>
        <motion.textarea
          id="content"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          rows={10}
          placeholder="Paste your long-form content (e.g., blog post, transcript) here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          whileFocus={{
            borderColor: "#3B82F6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
          }}
        ></motion.textarea>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <motion.button
              key={platform}
              type="button"
              className={`px-4 py-2 rounded-full transition-colors duration-200
                ${
                  selectedPlatforms.includes(platform)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
              onClick={() => handlePlatformToggle(platform)}
              whileTap={{ scale: 0.95 }}
            >
              {platform}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="tone"
          className="block text-lg font-medium text-gray-900 mb-2"
        >
          Tone
        </label>
        <motion.select
          id="tone"
          className="w-full rounded-lg p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          value={selectedTone}
          onChange={(e) => setSelectedTone(e.target.value)}
          whileFocus={{
            borderColor: "#3B82F6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
          }}
        >
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </motion.select>
      </div>

      <motion.button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Generate Repurposed Content"
        )}
      </motion.button>
    </motion.form>
  );
};

export default InputForm;
