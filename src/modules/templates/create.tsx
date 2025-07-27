
"use client";

import React from 'react';
import { useRouter } from 'next/router';
import { TemplatesProvider } from '@/modules/templates/context';
import { TemplateForm } from '@/modules/templates/components/TemplateForm';
import { PreviewPanel } from '@/modules/templates/components/PreviewPanel';

export const TemplateBuilderPage: React.FC = () => {
  const router = useRouter();

  const handleSaveSuccess = (template: any) => {
    console.log('Template saved:', template);
    // Optionally redirect to template list
    // router.push('/templates');
  };

  return (
    <TemplatesProvider>
      <div className="min-h-screen bg-[var(--background)] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => router.back()}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Template Builder
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] ml-14">
              Create and preview content repurposing templates with dynamic placeholders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Template Form */}
            <TemplateForm onSaveSuccess={handleSaveSuccess} />

            {/* Live Preview Panel */}
            <PreviewPanel />
          </div>
        </div>
      </div>
    </TemplatesProvider>
  );
};
