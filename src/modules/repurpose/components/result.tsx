import React from "react";
import { PlatformResult } from "../model";
import { PLATFORMS } from "@/utils/constants";
import { useRouter } from "next/navigation";

interface IProps {
  results: PlatformResult[];
  copyContent: (content: string) => void;
}

export const DisplayResults: React.FC<IProps> = ({ results, copyContent }) => {
  const router = useRouter();

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Generated Content
        </h2>
        <div className="text-sm text-[var(--text-secondary)]">
          {results.filter((r) => r.success).length} of {results.length}{" "}
          successful
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => {
          const platform = PLATFORMS.find((p) => p.value === result.format);

          return (
            <div key={index} className="card p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform?.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {platform?.label}
                    </h3>
                    {result.success && result.latencyMs && (
                      <div className="text-xs text-[var(--text-secondary)]">
                        Generated in {result.latencyMs}ms
                      </div>
                    )}
                  </div>
                </div>

                {result.success ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      Success
                    </span>
                    <button
                      onClick={() => copyContent(result.content!)}
                      className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      title="Copy content"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                    Failed
                  </span>
                )}
              </div>

              {result.success ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-[var(--text-primary)] font-sans text-sm">
                    {result.content}
                  </pre>
                  <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>
                      {result.content!.split(/\s+/).length} words •{" "}
                      {result.content!.length} characters
                    </span>
                    {result.source && <span>Source: {result.source}</span>}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {result.error}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <button
          onClick={() => router.push("/history")}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
        >
          View All History
        </button>
        <button
          onClick={() => {
            // setResults([]);
          }}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
        >
          Generate More Content
        </button>
      </div>
    </div>
  );
};
