import ContentInput from "../components/ContentInput";
import ResultsDisplay from "../components/ResultsDisplay";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [generatedContent, setGeneratedContent] = useState<{content: string, platform: string}[]>([]);

  const handleGenerateContent = ({ content, formats, tone }: { content: string; formats: string[]; tone: string }) => {
    // This is a placeholder for actual content generation logic
    // In a real app, you'd send this to a backend API
    const newResults = formats.map((f) => ({
      platform: f,
      content: `This is a generated ${f} post for "${content.substring(0, 20)}..." with a ${tone} tone.`,
    }));
    setGeneratedContent(newResults);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex flex-grow flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
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
            <ContentInput onGenerate={handleGenerateContent} />
            {generatedContent.length > 0 && (
              <div className="mt-8">
                <ResultsDisplay results={generatedContent} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
