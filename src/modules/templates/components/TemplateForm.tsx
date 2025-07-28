
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@/components/input/TextInput';
import { useTemplates } from '../context';
import { PLATFORMS, TONES, VALIDATION_MESSAGES } from '../constants';
import { SampleDataInputs } from './SampleDataInputs';
import { ToneSelector } from './ToneSelector';

const FormSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.TEMPLATE_NAME_REQUIRED),
  platform: Yup.string().required(VALIDATION_MESSAGES.PLATFORM_REQUIRED),
  content: Yup.string()
    .required(VALIDATION_MESSAGES.CONTENT_REQUIRED)
    .test(
      "has-placeholders",
      VALIDATION_MESSAGES.PLACEHOLDERS_REQUIRED,
      (value) => (value ? /\{\{\w+\}\}/.test(value) : false)
    ),
  tone: Yup.string().required(VALIDATION_MESSAGES.TONE_REQUIRED),
});

interface FormValues {
  name: string;
  platform: string;
  content: string;
  tone: string;
}

interface TemplateFormProps {
  initialValues?: FormValues;
  onSaveSuccess?: (template: any) => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  initialValues = {
    name: '',
    platform: '',
    content: '',
    tone: 'professional'
  },
  onSaveSuccess
}) => {
  const {
    extractPlaceholders,
    generatePreview,
    createTemplate,
    sampleData,
    setSampleData,
    updateSampleData
  } = useTemplates();

  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>([]);
  const [currentFormValues, setCurrentFormValues] = useState<FormValues>(initialValues);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedPreview = useCallback((content: string, tone: string, platform: string, currentSampleData: Record<string, string>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (content.trim() && tone.trim()) {
        generatePreview({ content, tone, platform, sampleData: currentSampleData })
          .catch(err => console.error('Preview generation failed:', err));
      }
    }, 800); 
  }, [generatePreview]);

  const generateSmartDefaults = useCallback((placeholder: string, content: string, platform: string) => {
    const lower = placeholder.toLowerCase();
    
    const platformDefaults: Record<string, Record<string, string>> = {
      twitter: {
        hashtag: 'YourBrand',
        handle: '@yourbrand',
        link: 'bit.ly/yourlink'
      },
      linkedin: {
        company: 'Your Company',
        industry: 'your industry',
        achievement: 'your recent milestone'
      },
      email: {
        firstname: 'John',
        lastname: 'Doe',
        unsubscribe: 'https://yoursite.com/unsubscribe'
      }
    };

    const smartDefaults: Record<string, string> = {
      // Names & Identity
      name: 'Alex Johnson',
      firstname: 'Sarah',
      lastname: 'Chen',
      fullname: 'Sarah Chen',
      username: 'sarahc',
      
      // Business
      company: 'Forma',
      product: 'Your Product',
      productname: 'Amazing Product',
      brand: 'Your Brand',
      service: 'Your Service',
      
      // Content
      title: 'Your Compelling Title Here',
      headline: 'Grab Attention With This Headline',
      description: 'A brief description that explains the value you provide',
      benefit: 'save time and increase productivity',
      value: 'get better results faster',
      
      // Calls to Action
      cta: 'Get Started Now',
      ctabutton: 'Click Here',
      ctalink: 'https://yoursite.com/signup',
      link: 'https://yoursite.com',
      
      // Dates & Numbers
      date: new Date().toLocaleDateString(),
      launchdate: 'Next Monday',
      deadline: 'This Friday',
      price: '$99',
      discount: '20% off',
      
      // Social
      hashtag: 'YourBrand',
      handle: '@yourbrand',
      
      // Contact
      email: 'hello@yourcompany.com',
      phone: '(555) 123-4567',
      website: 'yourwebsite.com'
    };

    // Check platform-specific first
    if (platformDefaults[platform]?.[lower]) {
      return platformDefaults[platform][lower];
    }

    // Check smart defaults
    if (smartDefaults[lower]) {
      return smartDefaults[lower];
    }

    // Fallback to formatted placeholder name
    return placeholder
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim() || `Your ${placeholder}`;
  }, []);

  const handleContentChange = useCallback((content: string, tone: string, platform: string) => {
    const placeholders = extractPlaceholders(content);
    setDetectedPlaceholders(placeholders);
    
    setSampleData(prev => {
      const newSampleData = { ...prev };
      
      // Add new placeholders with smart defaults
      placeholders.forEach(placeholder => {
        if (!newSampleData[placeholder]) {
          newSampleData[placeholder] = generateSmartDefaults(placeholder, content, platform);
        }
      });
      
      // Remove unused placeholders
      Object.keys(newSampleData).forEach(key => {
        if (!placeholders.includes(key)) {
          delete newSampleData[key];
        }
      });
      
      return newSampleData;
    });
    
    // Generate preview with updated sample data
    setTimeout(() => {
      setSampleData(currentSampleData => {
        debouncedPreview(content, tone, platform, currentSampleData);
        return currentSampleData;
      });
    }, 0);
    
  }, [extractPlaceholders, setSampleData, debouncedPreview, generateSmartDefaults]);

  useEffect(() => {
    const { content, tone, platform } = currentFormValues;
    
    if (content.trim()) {
      handleContentChange(content, tone, platform);
    } else {
      setDetectedPlaceholders([]);
      setSampleData({});
    }
  }, [currentFormValues, handleContentChange, setSampleData]);

  useEffect(() => {
    const { content, tone, platform } = currentFormValues;
    if (content.trim() && tone.trim() && Object.keys(sampleData).length > 0) {
      debouncedPreview(content, tone, platform, sampleData);
    }
  }, [sampleData, currentFormValues, debouncedPreview]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      const templateData = {
        name: values.name,
        platform: values.platform,
        content: values.content
      };
      
      await createTemplate(templateData);
      
      if (onSaveSuccess) {
        onSaveSuccess(templateData);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormValuesChange = useCallback((values: FormValues) => {
    setCurrentFormValues(values);
  }, []);

  return (
    <div className="card p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Create Template
        </h2>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useMemo(() => {
            handleFormValuesChange(values);
          }, [values, handleFormValuesChange]);

          return (
            <Form className="space-y-6">
              {/* Template Name */}
              <TextInput
                name="name"
                label="Template Name"
                placeholder="e.g., Product Launch Post, Weekly Newsletter"
                required
              />

              {/* Main Content - The Key Input */}
              <div>
                <TextInput
                  name="content"
                  type="textarea"
                  label="Your Content"
                  placeholder="Write your content here... Use {{placeholders}} for dynamic parts like {{productName}} or {{customerName}}"
                  rows={8}
                  required
                />
                
                {/* Helpful Tips */}
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  💡 <strong>Pro tip:</strong> Use {`{{placeholder}}`} for parts that change. 
                  {`Example: "Hi {{firstName}}, check out {{productName}}!"`}
                </div>

              
                {detectedPlaceholders.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Found {detectedPlaceholders.length} dynamic part{detectedPlaceholders.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectedPlaceholders.map(placeholder => (
                        <span
                          key={placeholder}
                          className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full font-medium"
                        >
                          {`{{${placeholder}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                    Advanced Options
                  </h3>
              
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Platform *
                    </label>
                    <select
                      name="platform"
                      value={values.platform}
                      onChange={(e) => setFieldValue('platform', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      <option value="">Select Platform</option>
                      {PLATFORMS.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ToneSelector
                    selectedTone={values.tone}
                    onToneChange={(tone) => setFieldValue('tone', tone)}
                  />
                </div>
              )}

              {detectedPlaceholders.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      Fill in the Details
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {" We've automatically created fields for your dynamic parts. Edit these to see how your content will look:"}
                    </p>
                  </div>
                  <SampleDataInputs
                    placeholders={detectedPlaceholders}
                    sampleData={sampleData}
                    onSampleDataChange={updateSampleData}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Template...
                    </span>
                  ) : (
                    'Create Template'
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
