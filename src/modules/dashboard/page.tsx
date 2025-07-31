// "use client";
// import { useState } from "react";
// import { Header, Footer, InputForm, ResultsDisplay } from "@/components";

// export const DashboardPage = () => {
//   const [results, setResults] = useState<
//     { content: string; platform: string }[]
//   >([]);

//   return (
//     // <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans">
//     <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
//       <div className="container">
//         <div className="card p-8">
//           <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
//             Paste Your Content
//           </h2>
//           <InputForm onGenerate={(results) => setResults(results)} />
//         </div>
//         {results.length > 0 && (
//           <div className="card mt-10 p-6">
//             <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
//               Your Repurposed Content
//             </h3>
//             <ResultsDisplay results={results} />
//           </div>
//         )}
//       </div>
//     </div>
//     // </div>
//   );
// };

// pages/repurpose/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/lib/api";
import { toast } from "sonner";
import { useTemplates } from "../templates/context";
import { ITemplate } from "../templates/model";

interface PlatformResult {
  format: string;
  content?: string;
  error?: string;
  success: boolean;
  latencyMs?: number;
  source?: string;
}

export const DashboardPage = () => {
  const router = useRouter();
  const { fetchTemplates, templates } = useTemplates();

  // Form state
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [templateData, setTemplateData] = useState<Record<string, string>>({});
  const [directContent, setDirectContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "twitter",
    "linkedin",
  ]);
  const [selectedTone, setSelectedTone] = useState("professional");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const PLATFORMS = [
    { value: "twitter", label: "Twitter", icon: "🐦" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "instagram", label: "Instagram", icon: "📸" },
    { value: "blog", label: "Blog", icon: "📝" },
    { value: "email", label: "Email", icon: "📧" },
    { value: "facebook", label: "Facebook", icon: "👥" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
  ];

  const TONES = [
    { value: "casual", label: "Casual" },
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "humorous", label: "Humorous" },
    { value: "persuasive", label: "Persuasive" },
    { value: "informative", label: "Informative" },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template: ITemplate) => {
    setSelectedTemplate(template);

    const initialData: Record<string, string> = {};
    template.placeholders.forEach((placeholder) => {
      initialData[placeholder] = "";
    });
    setTemplateData(initialData);
  };

  // Handle template data change
  const handleTemplateDataChange = (placeholder: string, value: string) => {
    setTemplateData((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  // Handle platform toggle
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    if (useTemplate) {
      if (!selectedTemplate) {
        toast.error("Please select a template");
        return;
      }

      // Check if all placeholders are filled
      const missingData = selectedTemplate.placeholders.filter(
        (placeholder) => !templateData[placeholder]?.trim()
      );

      if (missingData.length > 0) {
        toast.error(`Please fill in: ${missingData.join(", ")}`);
        return;
      }
    } else {
      if (!directContent.trim()) {
        toast.error("Please enter your content");
        return;
      }
    }

    setLoading(true);
    setShowResults(false);

    try {
      const payload = {
        transcript: useTemplate ? "" : directContent,
        platforms: selectedPlatforms,
        tone: selectedTone,
        useTemplate,
        ...(useTemplate && {
          templateId: selectedTemplate?._id,
          templateData,
        }),
      };

      const response = await api.post("/repurpose/transcribe", payload);

      if (response.data.success) {
        setResults(response.data.data.results);
        setShowResults(true);
        toast.success(
          `Generated content for ${response.data.data.summary.successful} platforms!`
        );
      } else {
        toast.error(response.data.error || "Failed to generate content");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.response?.data?.error || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  // Copy content to clipboard
  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Repurpose Content
            </h1>
            <p className="text-[var(--text-secondary)]">
              Transform your content for multiple platforms and tones
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/history")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              View History
            </button>
            <button
              onClick={() => router.push("/templates/create")}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-lg"
            >
              + Create Template
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Content Source Toggle */}
          <div className="card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Content Source
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setUseTemplate(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                  !useTemplate
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">✍</div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Direct Input
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">
                    Write or paste your content directly
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUseTemplate(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                  useTemplate
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Use Template
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">
                    Fill in a pre-made template
                  </div>
                </div>
              </button>
            </div>

            {/* Direct Input */}
            {!useTemplate && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Your Content *
                </label>
                <textarea
                  value={directContent}
                  onChange={(e) => setDirectContent(e.target.value)}
                  rows={6}
                  placeholder="Enter your content here... This will be repurposed for the selected platforms and tone."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-vertical"
                  required={!useTemplate}
                />
              </div>
            )}

            {/* Template Selection */}
            {useTemplate && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Select Template *
                  </label>

                  {templates.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-[var(--text-secondary)] mb-4">
                        No templates available
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/templates/create")}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium"
                      >
                        Create Your First Template
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template._id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedTemplate?._id === template._id
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-[var(--text-primary)]">
                              {template.name}
                            </h3>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                              {template.platform}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                            {template.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-secondary)]">
                              {template.placeholderCount} placeholder
                              {template.placeholderCount !== 1 ? "s" : ""}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {template.placeholders
                                .slice(0, 3)
                                .map((placeholder) => (
                                  <span
                                    key={placeholder}
                                    className="text-xs bg-[var(--primary)] text-white px-2 py-1 rounded-full"
                                  >
                                    {`{{${placeholder}}}`}
                                  </span>
                                ))}
                              {template.placeholders.length > 3 && (
                                <span className="text-xs text-[var(--text-secondary)]">
                                  +{template.placeholders.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Template Data Input */}
                {selectedTemplate && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                      Fill Template Data *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.placeholders.map((placeholder) => (
                        <div key={placeholder}>
                          <label className="block text-xs text-[var(--text-secondary)] mb-1 capitalize">
                            {placeholder.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <input
                            type="text"
                            value={templateData[placeholder] || ""}
                            onChange={(e) =>
                              handleTemplateDataChange(
                                placeholder,
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${placeholder}`}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Target Platforms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedPlatforms.includes(platform.value)
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{platform.icon}</div>
                    <div className="text-xs font-medium text-[var(--text-primary)]">
                      {platform.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Content Tone
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setSelectedTone(tone.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedTone === tone.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="text-xs font-medium text-[var(--text-primary)]">
                    {tone.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 animate-spin"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Content...
                </span>
              ) : (
                `Generate for ${selectedPlatforms.length} Platform${
                  selectedPlatforms.length !== 1 ? "s" : ""
                }`
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {showResults && results.length > 0 && (
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
                const platform = PLATFORMS.find(
                  (p) => p.value === result.format
                );

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
                          {result.source && (
                            <span>Source: {result.source}</span>
                          )}
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
                  setShowResults(false);
                  setResults([]);
                  setDirectContent("");
                  setSelectedTemplate(null);
                  setTemplateData({});
                }}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                Generate More Content
              </button>
            </div>
          </div>
        )}
      </div>
         
    </div>
  );
};
