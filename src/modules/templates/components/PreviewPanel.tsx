"use client";

import React from "react";
import { useTemplates } from "../context";

interface PreviewPanelProps {
  showSaveOutput?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  showSaveOutput = true,
}) => {
  const { previewContent, isPreviewLoading, previewError, saveOutput } =
    useTemplates();

  const handleSaveOutput = async () => {
    try {
      await saveOutput();
    } catch (error) {
      console.error("Failed to save output:", error);
    }
  };

  return (
    <div className="card p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Live Preview
        </h2>
      </div>

      <div className="min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
        {isPreviewLoading ? (
          <LoadingState />
        ) : previewError ? (
          <ErrorState error={previewError} />
        ) : previewContent ? (
          <PreviewContent content={previewContent} />
        ) : (
          <EmptyState />
        )}
      </div>

      {previewContent && !previewError && <SuccessState />}
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
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
      <span className="text-lg">Generating preview...</span>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
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
      <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
        Preview Error
      </p>
      <p className="text-sm text-[var(--text-secondary)]">{error}</p>
    </div>
  </div>
);

const PreviewContent: React.FC<{ content: string }> = ({ content }) => (
  <div className="prose prose-gray dark:prose-invert max-w-none">
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <pre className="whitespace-pre-wrap text-[var(--text-primary)] font-sans">
        {content}
      </pre>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex items-center justify-center h-full text-center">
    <div className="text-[var(--text-secondary)]">
      <svg
        className="w-12 h-12 mx-auto mb-4 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <p className="text-lg font-medium mb-2">Preview will appear here</p>
      <p className="text-sm">
        Fill in the template content and select a tone to see the live preview
      </p>
    </div>
  </div>
);

const SuccessState: React.FC = () => (
  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm font-medium">
        Preview generated successfully!
      </span>
    </div>
  </div>
);
