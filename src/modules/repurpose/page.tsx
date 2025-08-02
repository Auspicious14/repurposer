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
import { toast } from "sonner";
import { useTemplates } from "../templates/context";
import { ITemplate } from "../templates/model";
import { useTranscribe } from "./context";
import { Form, Formik } from "formik";
import { PLATFORMS, TONES } from "@/utils/constants";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";
import { SelectPlatform } from "./components/selectPlatform";

export const DashboardPage = () => {
  const router = useRouter();
  const { fetchTemplates, templates } = useTemplates();
  const { loading, results, transcribe, setResults } = useTranscribe();

  const validationSchema = Yup.object().shape({
    directContent: Yup.string().when("useTemplate", {
      is: false,
      then: (schema) => schema.required("Please enter your content"),
      otherwise: (schema) => schema.notRequired(),
    }),
    platforms: Yup.array().min(1, "Please select at least one platform"),
    templateData: Yup.object().when("useTemplate", {
      is: true,
      then: (schema) =>
        schema.test(
          "template-data-filled",
          "Please fill in all template placeholders",
          function (value: any) {
            if (!this.parent.selectedTemplate) return true;
            const missing = this.parent.selectedTemplate.placeholders.filter(
              (placeholder: any) =>
                !value || (!value[placeholder]?.trim() as any)
            );
            return missing.length === 0;
          }
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleTemplateSelect = (template: ITemplate, setFieldValue: any) => {
    setFieldValue("selectedTemplate", template);

    const initialData: Record<string, string> = {};
    template.placeholders.forEach((placeholder) => {
      initialData[placeholder] = "";
    });
  };


  const handleSubmit = async (values: any) => {
    if (values.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    if (values.useTemplate) {
      if (!values.selectedTemplate) {
        toast.error("Please select a template");
        return;
      }

      // Check if all placeholders are filled
      const missingData = values.selectedTemplate.placeholders.filter(
        (placeholder: any) => !values.templateData[placeholder]?.trim()
      );

      if (missingData.length > 0) {
        toast.error(`Please fill in: ${missingData.join(", ")}`);
        return;
      }
    } else {
      if (!values.directContent.trim()) {
        toast.error("Please enter your content");
        return;
      }
    }

    const payload = {
      transcript: values.useTemplate ? "" : values.directContent,
      platforms: values.platforms,
      tone: values.tone,
      useTemplate: values.useTemplate,
      ...(values.useTemplate && {
        templateId: values.selectedTemplate?._id,
        templateData: values.templateData,
      }),
    };

    const results = await transcribe(payload);

    if (results) {
      toast.success(
        `Generated content for ${
          (results as any).summary.successful
        } platforms!`
      );
    }
  };

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

        <Formik
          initialValues={{
            transcribe: "",
            directContent: "",
            templateData: { placeholder: "", value: "" },
            platforms: ["twitter", "linkedin"],
            tone: "professional",
            useTemplate: false,
            selectedTemplate: {} as ITemplate,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-8">
              <div className="card p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Content Source
                </h2>

                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue("useTemplate", false);
                    }}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      !values.useTemplate
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
                    onClick={() => {
                      setFieldValue("useTemplate", true);
                    }}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      values.useTemplate
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

                {!values.useTemplate && (
                  <div>
                    <TextInput
                      type="textarea"
                      label="Your Content *"
                      name={"directContent"}
                      rows={6}
                      placeholder="Enter your content here... This will be repurposed for the selected platforms and tone."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-vertical"
                      required={!values.useTemplate}
                    />
                  </div>
                )}

                {values.useTemplate && (
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
                              onClick={() => {
                                handleTemplateSelect(template, setFieldValue);
                              }}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                (values.selectedTemplate?._id as string) ===
                                (template._id as string)
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

                    {values.selectedTemplate && (
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                          Fill Template Data *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {values.selectedTemplate.placeholders.map(
                            (placeholder) => (
                              <div key={placeholder}>
                                <label className="block text-xs text-[var(--text-secondary)] mb-1 capitalize">
                                  {placeholder
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()}
                                </label>
                                <TextInput
                                  type="text"
                                  onChange={(e) => {
                                    setFieldValue(
                                      `templateData.${placeholder}`,
                                      e.target.value
                                    );
                                  }}
                                  value={
                                    values.templateData[
                                      placeholder as keyof typeof values.templateData
                                    ] || ""
                                  }
                                  placeholder={`Enter ${placeholder}`}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent"
                                  label=""
                                  name={`templateData.${placeholder}`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Platform Selection */}

              <SelectPlatform
                platforms={values.platforms}
                onClick={(platform) =>
                  setFieldValue(
                    "platforms",
                    values.platforms.includes(platform)
                      ? values.platforms.filter((p) => p !== platform)
                      : [...values.platforms, platform]
                  )
                }
              />

              {/* Tone Selection */}
              <SelectTone 
                tone={values.tone} 
                onClick={(tone) => setFieldValue("tone", tone)} 
                />
            

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
                    `Generate for ${values.platforms.length} Platform${
                      values.platforms.length !== 1 ? "s" : ""
                    }`
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Results */}
        {results.length > 0 && (
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
                  // setResults([]);
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
