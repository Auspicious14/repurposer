
"use client";

import { useEffect } from "react";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from 'yup';
import { PLATFORMS, VALIDATION_MESSAGES } from '../constants';

const FormSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.TEMPLATE_NAME_REQUIRED),
  content: Yup.string().required(VALIDATION_MESSAGES.CONTENT_REQUIRED),
  platform: Yup.string().required(VALIDATION_MESSAGES.PLATFORM_REQUIRED)
});

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    content: string;
    platform: string;
  }) => Promise<void>;
  title: string;
  initialValues?: {
    name: string;
    content: string;
    platform: string;
  };
}

export const TemplateModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValues = { name: "", content: "", platform: "" }
}: TemplateModalProps) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl">
          <h2 
            id="modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={FormSchema}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-5">
                {/* Template Name */}
                <TextInput
                  name="name"
                  label="Template Name"
                  placeholder="Enter template name"
                  required
                />

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={values.platform}
                    onChange={(e) => setFieldValue('platform', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select Platform</option>
                    {PLATFORMS.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Content */}
                <TextInput
                  name="content"
                  type="textarea"
                  label="Template Content"
                  placeholder="Enter your template with placeholders like {{title}}, {{body}}, {{cta}}..."
                  rows={8}
                  required
                />
                
                {/* Show placeholder count */}
                {values.content && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Placeholders found: {(values.content.match(/\{\{\w+\}\}/g) || []).length}
                    </p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] dark:focus:ring-offset-gray-900 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--primary)] rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Template"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
