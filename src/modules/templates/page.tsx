// components/TemplatesPage.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTemplates } from "@/modules/templates/context";
import { ModalComponent } from "./components/modal";

interface Template {
  _id: string;
  name: string;
  content: string;
  platform: "twitter" | "linkedin" | "instagram";
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

interface TemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesPage = ({ onSelectTemplate }: TemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { templates, error, createTemplate } = useTemplates();

  useEffect(() => {
    // No fetch here; assumed handled by useTemplates context
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
      onSelectTemplate(updatedTemplate);
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

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[var(--primary)]">
          Templates
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary)] text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Create Template
        </button>
      </div>
      {error ? (
        <p className="text-center text-[var(--text-primary)]">{error}</p>
      ) : templates.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)]">
          No templates available. Create one to get started!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="card p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedTemplate(template)}
              >
                <h2 className="text-xl text-[var(--text-primary)]">
                  {template.name}
                </h2>
                <p className="text-[var(--text-secondary)] mt-2">
                  {template.content || "No description"}
                </p>
              </div>
            ))}
          </div>
          {selectedTemplate && (
            <div className="card p-6 rounded-lg shadow-md">
              <h2 className="text-xl text-[var(--text-primary)] mb-4">
                {selectedTemplate.name} Preview
              </h2>
              <div className="mb-4 p-4 border border-[var(--text-secondary)] rounded-lg bg-white">
                {selectedTemplate.platform.toLowerCase() === "twitter" && (
                  <div className="space-y-2">
                    {selectedTemplate.content.split("\n").map((line, i) => (
                      <div key={i} className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-[var(--text-primary)]">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedTemplate.platform.toLowerCase() === "linkedin" && (
                  <p className="text-[var(--text-primary)]">
                    {selectedTemplate.content}
                  </p>
                )}
                {selectedTemplate.platform.toLowerCase() === "instagram" && (
                  <p className="text-[var(--text-primary)] italic">
                    {selectedTemplate.content}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleFormat("tone", "casual")}
                  className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700"
                >
                  Casual Tone
                </button>
                <button
                  onClick={() => handleFormat("tone", "professional")}
                  className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700"
                >
                  Professional Tone
                </button>
                <button
                  onClick={() => handleFormat("length", "short")}
                  className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700"
                >
                  Short
                </button>
                <button
                  onClick={() => handleFormat("style", "bullets")}
                  className="bg-[var(--secondary)] text-white py-1 px-3 rounded-lg hover:bg-pink-700"
                >
                  Bullets
                </button>
              </div>
              <Link
                href={`/templates/${selectedTemplate.id}`}
                className="text-[var(--secondary)] hover:underline"
              >
                View Details
              </Link>
            </div>
          )}
        </>
      )}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        title="Create New Template"
      />
        
    </div>
  );
};
