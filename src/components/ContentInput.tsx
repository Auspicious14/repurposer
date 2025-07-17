import React, { useState } from "react";

interface InputFormProps {
  onGenerate: (data: {
    content: string;
    formats: string[];
    tone: string;
  }) => void;
}

import { motion } from "framer-motion";
import OutputFormatSelector from "./OutputFormatSelector";
import ToneSelector from "./ToneSelector";
import LoadingSpinner from "./LoadingSpinner";

const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [content, setContent] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGenerate({ content, formats: selectedFormats, tone: selectedTone });
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
        <h2 className="text-xl font-semibold text-gray-800">
          Choose output format
        </h2>
        <OutputFormatSelector
          selectedFormats={selectedFormats}
          onSelectFormat={handleSelectFormat}
        />
      </div>

      <div>
        <ToneSelector
          selectedTone={selectedTone}
          onSelectTone={setSelectedTone}
        />
      </div>

      <motion.button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Generating...</span>
          </div>
        ) : (
          "Generate"
        )}
      </motion.button>
    </motion.form>
  );
};

export default InputForm;
