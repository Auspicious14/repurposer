"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTemplates } from "./context";
import { ITemplate } from "./model";
import { TemplateModal } from "./components/TemplateModal";


interface TemplatesPageProps {
  onSelectTemplate?: (template: ITemplate) => void;
}

export const TemplatesPage = ({ onSelectTemplate }: TemplatesPageProps) => {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { templates, error, createTemplate, fetchTemplates } = useTemplates();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleFormat = (type: "tone" | "length" | "style", value: string) => {
    if (selectedTemplate) {
      let updatedContent = selectedTemplate.content;
      switch (type) {
        case "tone":
          updatedContent =
            value === "casual" ? updatedContent.toLowerCase() : updatedContent;
          break;
        case "length":
          updatedContent =
            value === "short" ? updatedContent.slice(0, 100) : updatedContent;
          break;
        case "style":
          updatedContent =
            value === "bullets"
              ? updatedContent.replace(/\./g, "\n- ")
              : updatedContent;
          break;
      }
      const updatedTemplate = { ...selectedTemplate, content: updatedContent };
      setSelectedTemplate(updatedTemplate);
      if (onSelectTemplate) {
        onSelectTemplate(updatedTemplate);
      }
    }
  };

  const handleCreate = async (values: {
    name: string;
    content: string;
    platform: string;
  }) => {
    await createTemplate(values);
    setIsModalOpen(false);
  };

  const navigateToBuilder = () => {
    router.push("/templates/create");
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: "🐦",
      linkedin: "💼",
      instagram: "📸",
      blog: "📝",
      email: "📧",
      facebook: "👥",
      tiktok: "🎵",
    };
    return icons[platform as keyof typeof icons] || "📄";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Templates
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your content repurposing templates
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              Quick Create
            </button>
            <button
              onClick={navigateToBuilder}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-lg"
            >
              + Template Builder
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                No templates yet
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Create your first template to get started with content
                repurposing
              </p>
              <button
                onClick={navigateToBuilder}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                Create Your First Template
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="card p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getPlatformIcon(template.platform)}
                      </span>
                      <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                        {template.platform}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {formatDate(template.createdAt)}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
                    {template.name}
                  </h3>

                  <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-4">
                    {template.content || "No description"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(template.content.match(/\{\{\w+\}\}/g) || []).length >
                        0 && (
                        <span className="text-xs bg-[var(--primary)] text-white px-2 py-1 rounded-full">
                          {
                            (template.content.match(/\{\{\w+\}\}/g) || [])
                              .length
                          }{" "}
                          placeholders
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/templates/${template._id}`}
                      className="text-[var(--secondary)] hover:underline text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {selectedTemplate.name} Preview
                  </h2>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 p-4 border border-[var(--text-secondary)] text-[var(--text-primary)] rounded-lg bg-white dark:bg-[var(--background)]">
                  <pre className="whitespace-pre-wrap text-[var(--text-primary)] font-sans">
                    {selectedTemplate.content}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    onClick={() => handleFormat("tone", "casual")}
                    className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-800 text-sm"
                  >
                    Casual Tone
                  </button>
                  <button
                    onClick={() => handleFormat("tone", "professional")}
                    className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-800 text-sm"
                  >
                    Professional Tone
                  </button>
                  <button
                    onClick={() => handleFormat("length", "short")}
                    className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-800 text-sm"
                  >
                    Short
                  </button>
                  <button
                    onClick={() => handleFormat("style", "bullets")}
                    className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-800 text-sm"
                  >
                    Bullets
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/templates/${selectedTemplate._id}`}
                    className="text-[var(--secondary)] hover:underline dark:text-pink-400 font-medium"
                  >
                    View Details →
                  </Link>
                  <Link
                    href={`/templates/create?edit=${selectedTemplate._id}`}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium"
                  >
                    Edit in Builder
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Create Modal */}
        <TemplateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          title="Quick Create Template"
        />
      </div>
    </div>
  );
};
