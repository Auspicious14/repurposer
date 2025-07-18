import { Footer, Header, InputForm, ResultsDisplay } from "@/components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [results, setResults] = useState<
    { content: string; platform: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 w-full py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-4">
            Repurpose your content across platforms effortlessly
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Generate platform-specific content from a single source. Write once,
            scale everywhere.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-3xl">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Paste your content
            </h2>
            <InputForm onGenerate={(results) => setResults(results)} />
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Your Repurposed Content
              </h3>
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
