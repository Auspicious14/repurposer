import InputForm from "../components/InputForm";
import OutputTabs from "../components/OutputTabs";
import { useState } from "react";

export default function Home() {
  const [generatedContent, setGeneratedContent] = useState<{content: string, platform: string}[]>([]);

  const handleGenerateContent = (data: {
    content: string;
    selectedPlatforms: string[];
    selectedTone: string;
  }) => {
    // This is a placeholder for actual content generation logic
    // In a real app, you'd send this to a backend API
    const newResults = data.selectedPlatforms.map((platform) => ({
      platform: platform,
      content: `This is a ${
        data.selectedTone
      } ${platform} post based on: "${data.content.substring(0, 50)}..."`,
    }));
    setGeneratedContent(newResults);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Repurposer ✨
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Write once. Share everywhere.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <InputForm onGenerate={handleGenerateContent} />
          {generatedContent.length > 0 && (
            <div className="mt-8">
              <OutputTabs results={generatedContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
