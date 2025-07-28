
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@/components/input/TextInput';
import { useTemplates } from '../context';
import { PLATFORMS, TONES, VALIDATION_MESSAGES } from '../constants';
import { SampleDataInputs } from './SampleDataInputs';
import { ToneSelector } from './ToneSelector';
import { PlaceholderBadges } from './PlaceholderBadges';

const FormSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.TEMPLATE_NAME_REQUIRED),
  platform: Yup.string().required(VALIDATION_MESSAGES.PLATFORM_REQUIRED),
  content: Yup.string()
    .required(VALIDATION_MESSAGES.CONTENT_REQUIRED)
    .test('has-placeholders', VALIDATION_MESSAGES.PLACEHOLDERS_REQUIRED, 
      value => value ? /\{\{\w+\}\}/.test(value) : false
    ),
  tone: Yup.string().required(VALIDATION_MESSAGES.TONE_REQUIRED)
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
    tone: ''
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
  
  const prevValuesRef = useRef<{
    content: string;
    tone: string;
    platform: string;
  }>({ content: '', tone: '', platform: '' });

  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedPreview = useCallback((content: string, tone: string, platform: string, sampleData: Record<string, string>) => {
  
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (content.trim() && tone.trim()) {
        generatePreview({ content, tone, platform, sampleData })
          .catch(err => console.error('Preview generation failed:', err));
      }
    }, 500);
  }, [generatePreview]);
  
  const handleContentChange = useCallback((content: string, tone: string, platform: string) => {
    const placeholders = extractPlaceholders(content);
    setDetectedPlaceholders(placeholders);
    
    setSampleData(prev => {
      const newSampleData = { ...prev };
      placeholders.forEach(placeholder => {
        if (!newSampleData[placeholder]) {
          newSampleData[placeholder] = '';
        }
      });
      return newSampleData;
    });
    
    debouncedPreview(content, tone, platform, sampleData);
  }, [extractPlaceholders, setSampleData, debouncedPreview, sampleData]);


  useEffect(() => {
    const { content, tone, platform } = currentFormValues;
    const prevValues = prevValuesRef.current;
    
    if (
      content !== prevValues.content || 
      tone !== prevValues.tone || 
      platform !== prevValues.platform
    ) {
  
      prevValuesRef.current = { content, tone, platform };
      
      if (content && tone) {
        handleContentChange(content, tone, platform);
      }
    }
  }, [currentFormValues, handleContentChange]);

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
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
        Template Configuration
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => {
          
          React.useMemo(() => {
            handleFormValuesChange(values);
          }, [values, handleFormValuesChange]);

          return (
            <Form className="space-y-6">
          
              <TextInput
                name="name"
                label="Template Name"
                placeholder="e.g., Twitter Product Launch"
                required
              />
              
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
              
              <div>
                <TextInput
                  name="content"
                  type="textarea"
                  label="Template Content"
                  placeholder="Enter your template with placeholders like {{title}}, {{body}}, {{cta}}..."
                  rows={6}
                  required
                />
                
                <PlaceholderBadges placeholders={detectedPlaceholders} />
              </div>

              <ToneSelector
                selectedTone={values.tone}
                onToneChange={(tone) => setFieldValue('tone', tone)}
              />

                {detectedPlaceholders.length > 0 && (
                <SampleDataInputs
                  placeholders={detectedPlaceholders}
                  sampleData={sampleData}
                  onSampleDataChange={updateSampleData}
                />
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
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
                      Saving Template...
                    </span>
                  ) : (
                    'Save Template'
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
