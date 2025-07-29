// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Formik, Form, FormikProps } from "formik";
// import * as Yup from "yup";
// import { TextInput } from "@/components/input/TextInput";
// import { useTemplates } from "../context";
// import { PLATFORMS, TONES, VALIDATION_MESSAGES } from "../constants";
// import { SampleDataInputs } from "./SampleDataInputs";
// import { ToneSelector } from "./ToneSelector";
// import { PlaceholderBadges } from "./PlaceholderBadges";

// const FormSchema = Yup.object().shape({
//   name: Yup.string().required(VALIDATION_MESSAGES.TEMPLATE_NAME_REQUIRED),
//   platform: Yup.string().required(VALIDATION_MESSAGES.PLATFORM_REQUIRED),
//   content: Yup.string()
//     .required(VALIDATION_MESSAGES.CONTENT_REQUIRED)
//     .test(
//       "has-placeholders",
//       VALIDATION_MESSAGES.PLACEHOLDERS_REQUIRED,
//       (value) => (value ? /\{\{\w+\}\}/.test(value) : false)
//     ),
//   tone: Yup.string().required(VALIDATION_MESSAGES.TONE_REQUIRED),
// });

// interface FormValues {
//   name: string;
//   platform: string;
//   content: string;
//   tone: string;
// }

// interface TemplateFormProps {
//   initialValues?: FormValues;
//   onSaveSuccess?: (template: any) => void;
// }

// export const TemplateForm: React.FC<TemplateFormProps> = ({
//   initialValues = {
//     name: "",
//     platform: "",
//     content: "",
//     tone: "",
//   },
//   onSaveSuccess,
// }) => {
//   const {
//     extractPlaceholders,
//     generatePreview,
//     createTemplate,
//     sampleData,
//     setSampleData,
//     updateSampleData,
//   } = useTemplates();

//   const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>(
//     []
//   );
//   const [currentFormValues, setCurrentFormValues] =
//     useState<FormValues>(initialValues);

//   const prevValuesRef = useRef<{
//     content: string;
//     tone: string;
//     platform: string;
//   }>({ content: "", tone: "", platform: "" });

//   const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

//   const debouncedPreview = useCallback(
//     (
//       content: string,
//       tone: string,
//       platform: string,
//       sampleData: Record<string, string>
//     ) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         if (content.trim() && tone.trim()) {
//           generatePreview({ content, tone, platform, sampleData }).catch(
//             (err) => console.error("Preview generation failed:", err)
//           );
//         }
//       }, 500);
//     },
//     [generatePreview]
//   );

//   const handleContentChange = useCallback(
//     (content: string, tone: string, platform: string) => {
//       const placeholders = extractPlaceholders(content);
//       setDetectedPlaceholders(placeholders);

//       setSampleData((prev: any) => {
//         const newSampleData = { ...prev };
//         placeholders.forEach((placeholder) => {
//           if (!newSampleData[placeholder]) {
//             newSampleData[placeholder] = "";
//           }
//         });
//         return newSampleData;
//       });

//       debouncedPreview(content, tone, platform, sampleData);
//     },
//     [extractPlaceholders, setSampleData, debouncedPreview, sampleData]
//   );

//   useEffect(() => {
//     const { content, tone, platform } = currentFormValues;
//     const prevValues = prevValuesRef.current;

//     if (
//       content !== prevValues.content ||
//       tone !== prevValues.tone ||
//       platform !== prevValues.platform
//     ) {
//       prevValuesRef.current = { content, tone, platform };

//       if (content && tone) {
//         handleContentChange(content, tone, platform);
//       }
//     }
//   }, [currentFormValues, handleContentChange]);

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
//     try {
//       const templateData = {
//         name: values.name,
//         platform: values.platform,
//         content: values.content,
//       };

//       await createTemplate(templateData);

//       if (onSaveSuccess) {
//         onSaveSuccess(templateData);
//       }
//     } catch (error) {
//       console.error("Failed to save template:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleFormValuesChange = (values: FormValues) => {
//     setCurrentFormValues(values);
//   };

//   return (
//     <div className="card p-6 rounded-xl shadow-lg">
//       <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
//         Template Configuration
//       </h2>

//       <Formik
//         initialValues={initialValues}
//         validationSchema={FormSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize
//       >
//         {({ values, setFieldValue, isSubmitting }) => {
//           // eslint-disable-next-line react-hooks/rules-of-hooks
//           React.useMemo(() => {
//             handleFormValuesChange(values);
//           }, [values, handleFormValuesChange]);

//           return (
//             <Form className="space-y-6">
//               <TextInput
//                 name="name"
//                 label="Template Name"
//                 placeholder="e.g., Twitter Product Launch"
//                 required
//               />

//               <div>
//                 <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
//                   Platform *
//                 </label>
//                 <select
//                   name="platform"
//                   value={values.platform}
//                   onChange={(e) => setFieldValue("platform", e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
//                 >
//                   <option value="">Select Platform</option>
//                   {PLATFORMS.map((platform) => (
//                     <option key={platform.value} value={platform.value}>
//                       {platform.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <TextInput
//                   name="content"
//                   type="textarea"
//                   label="Template Content"
//                   placeholder="Enter your template with placeholders like {{title}}, {{body}}, {{cta}}..."
//                   rows={6}
//                   required
//                 />

//                 <PlaceholderBadges placeholders={detectedPlaceholders} />
//               </div>

//               <ToneSelector
//                 selectedTone={values.tone}
//                 onToneChange={(tone) => setFieldValue("tone", tone)}
//               />

//               {detectedPlaceholders.length > 0 && (
//                 <SampleDataInputs
//                   placeholders={detectedPlaceholders}
//                   sampleData={sampleData}
//                   onSampleDataChange={updateSampleData}
//                 />
//               )}

//               <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   {isSubmitting ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg
//                         className="w-4 h-4 animate-spin"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Saving Template...
//                     </span>
//                   ) : (
//                     "Save Template"
//                   )}
//                 </button>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// };

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "@/components/input/TextInput";
import { useTemplates } from "../context";
import {
  DEFAULT_SAMPLES,
  EXAMPLE_TEMPLATES,
  PLATFORMS,
  TEMPLATE_PLACEHOLDER_CONTENT,
  TONES,
  VALIDATION_MESSAGES,
} from "../constants";
import { SampleDataInputs } from "./SampleDataInputs";
import { ToneSelector } from "./ToneSelector";
import { PlaceholderBadges } from "./PlaceholderBadges";

const FormSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.TEMPLATE_NAME_REQUIRED),
  platform: Yup.string().required(VALIDATION_MESSAGES.PLATFORM_REQUIRED),
  content: Yup.string().required(VALIDATION_MESSAGES.CONTENT_REQUIRED),
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
    name: "",
    platform: "",
    content: "",
    tone: "professional",
  },
  onSaveSuccess,
}) => {
  const {
    extractPlaceholders,
    generatePreview,
    createTemplate,
    sampleData,
    setSampleData,
    updateSampleData,
  } = useTemplates();

  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>(
    []
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const getSmartDefault = useCallback((placeholder: string) => {
    const defaults = DEFAULT_SAMPLES;

    return (
      defaults[placeholder] ||
      `Your ${placeholder.replace(/([A-Z])/g, " $1").toLowerCase()}`
    );
  }, []);

  const triggerPreview = useCallback(
    (
      content: string,
      tone: string,
      platform: string,
      currentSampleData: Record<string, string>
    ) => {
      if (content.trim() && tone.trim()) {
        generatePreview({
          content,
          tone,
          platform,
          sampleData: currentSampleData,
        }).catch(console.error);
      }
    },
    [generatePreview]
  );

  const debouncedPreview = useCallback(
    (
      content: string,
      tone: string,
      platform: string,
      currentSampleData: Record<string, string>
    ) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        triggerPreview(content, tone, platform, currentSampleData);
      }, 300);
    },
    [triggerPreview]
  );

  const handleContentChange = useCallback(
    (content: string, tone?: string, platform?: string, immediate = false) => {
      const currentTone = tone || formValues.tone;
      const currentPlatform = platform || formValues.platform;

      const placeholders = extractPlaceholders(content);
      setDetectedPlaceholders(placeholders);

      setSampleData((prev: any) => {
        const newData = { ...prev };

        placeholders.forEach((placeholder) => {
          if (!newData[placeholder]) {
            newData[placeholder] = getSmartDefault(placeholder);
          }
        });

        Object.keys(newData).forEach((key) => {
          if (!placeholders.includes(key)) {
            delete newData[key];
          }
        });

        if (content.trim() && currentTone.trim()) {
          if (immediate) {
            triggerPreview(content, currentTone, currentPlatform, newData);
          } else {
            debouncedPreview(content, currentTone, currentPlatform, newData);
          }
        }

        return newData;
      });
    },
    [
      extractPlaceholders,
      setSampleData,
      getSmartDefault,
      debouncedPreview,
      triggerPreview,
      formValues.tone,
      formValues.platform,
    ]
  );

  const handleImmediateChange = useCallback(
    (field: keyof FormValues, value: string) => {
      const newFormValues = { ...formValues, [field]: value };
      setFormValues(newFormValues);

      if (newFormValues.content.trim() && newFormValues.tone.trim()) {
        triggerPreview(
          newFormValues.content,
          newFormValues.tone,
          newFormValues.platform,
          sampleData
        );
      }
    },
    [formValues, triggerPreview, sampleData]
  );

  const handleSampleDataChange = useCallback(
    (key: string, value: string) => {
      updateSampleData(key, value);

      if (formValues.content.trim() && formValues.tone.trim()) {
        const newSampleData = { ...sampleData, [key]: value };
        triggerPreview(
          formValues.content,
          formValues.tone,
          formValues.platform,
          newSampleData
        );
      }
    },
    [updateSampleData, formValues, triggerPreview, sampleData]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      await createTemplate({
        name: values.name,
        platform: values.platform,
        content: values.content,
      });

      if (onSaveSuccess) {
        onSaveSuccess(values);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const loadExample = (
    example: (typeof EXAMPLE_TEMPLATES)[0],
    setFieldValue: any
  ) => {
    setFieldValue("content", example.content);
    setFieldValue("name", example.name);
    setFormValues((prev) => ({
      ...prev,
      content: example.content,
      name: example.name,
    }));
    handleContentChange(
      example.content,
      formValues.tone,
      formValues.platform,
      true
    );
    setShowExamples(false);
  };

  return (
    <div className="card p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Create Template
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            {showExamples ? "Hide" : "Show"} Examples
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced
          </button>
        </div>
      </div>
      {showExamples && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
            📝 Quick Start Templates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {EXAMPLE_TEMPLATES.map((example, index) => (
              <Formik
                initialValues={{ example: { name: "", content: "" } }}
                onSubmit={() => {}}
                key={index}
              >
                {({ setFieldValue }) => (
                  <button
                    type="button"
                    onClick={() => loadExample(example, setFieldValue)}
                    className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors text-left"
                  >
                    {example.name}
                  </button>
                )}
              </Formik>
            ))}
          </div>
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            setFormValues(values);
          }, [values]);

          return (
            <Form className="space-y-6">
              <TextInput
                name="name"
                label="Template Name"
                placeholder="e.g., Product Launch Post"
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={values.platform}
                  onChange={(e) => {
                    setFieldValue("platform", e.target.value);
                    handleImmediateChange("platform", e.target.value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="">Select Platform</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Your Content *
                </label>
                <textarea
                  name="content"
                  value={values.content}
                  onChange={(e) => {
                    setFieldValue("content", e.target.value);
                    handleContentChange(e.target.value);
                  }}
                  rows={8}
                  placeholder={TEMPLATE_PLACEHOLDER_CONTENT}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-vertical"
                  required
                />

                <PlaceholderBadges placeholders={detectedPlaceholders} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Tone (for preview) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TONES.slice(0, 4).map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => {
                        setFieldValue("tone", tone.value);
                        handleImmediateChange("tone", tone.value);
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        values.tone === tone.value
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-white dark:bg-gray-800 text-[var(--text-primary)] border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]"
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {showAdvanced && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                    More Tone Options
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TONES.slice(4).map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => {
                          setFieldValue("tone", tone.value);
                          handleImmediateChange("tone", tone.value);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          values.tone === tone.value
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white dark:bg-gray-800 text-[var(--text-primary)] border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]"
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {detectedPlaceholders.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">
                      Fill in the Details
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Found {detectedPlaceholders.length} dynamic part
                    {detectedPlaceholders.length !== 1 ? "s" : ""}. Edit these
                    values and see your preview update instantly:
                  </p>
                  <SampleDataInputs
                    placeholders={detectedPlaceholders}
                    sampleData={sampleData}
                    onSampleDataChange={handleSampleDataChange}
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
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
                      Creating Template...
                    </span>
                  ) : (
                    "Create Template"
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
