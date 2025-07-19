"use client";
import { useState } from "react";
import { Header, Footer, InputForm, ResultsDisplay } from "@/components";

export const DashboardPage = () => {
  const [results, setResults] = useState<
    { content: string; platform: string }[]
  >([]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="container">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
              Paste Your Content
            </h2>
            <InputForm onGenerate={(results) => setResults(results)} />
          </div>
          {results.length > 0 && (
            <div className="card mt-10 p-6">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
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
};
