"use client";

import React from "react";
import { useRouter } from "next/router";
import { TemplatesProvider } from "@/modules/templates/context";
import { TemplateForm } from "@/modules/templates/components/TemplateForm";
import { PreviewPanel } from "@/modules/templates/components/PreviewPanel";

export const TemplateBuilderPage: React.FC = () => {
  const router = useRouter();

  const handleSaveSuccess = (template: any) => {
    console.log("Template saved:", template);
    // Optionally redirect to template list
    router.push("/templates");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Template Builder
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] ml-14">
            Create and preview content repurposing templates with dynamic
            placeholders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
          <div className="overflow-y-auto pr-4">
            <TemplateForm onSaveSuccess={handleSaveSuccess} />
          </div>
          <div className="sticky top-0 h-full">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
