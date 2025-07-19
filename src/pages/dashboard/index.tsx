
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer, InputForm, ResultsDisplay } from "@/components";

export default function Dashboard() {
  const [results, setResults] = useState<{ content: string; platform: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
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
}
