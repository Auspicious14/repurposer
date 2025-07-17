import { Footer, Header, InputForm, ResultsDisplay } from "@/components";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<
    { content: string; platform: string }[]
  >([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-3xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Repurposer ✨
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Write once. Share everywhere.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <InputForm onGenerate={(results) => setResults(results)} />
            {results.length > 0 && <ResultsDisplay results={results} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
