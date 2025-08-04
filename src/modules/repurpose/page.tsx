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

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useTemplates } from "../templates/context";
import { ITemplate } from "../templates/model";
import { useTranscribe } from "./context";
import { Form, Formik } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";
import { SelectPlatform } from "./components/selectPlatform";
import { SelectTone } from "./components/selectTone";
import { DisplayResults } from "./components/result";
import { SelectTemplate } from "./components/selectTemplate";
import { PLATFORMS } from "@/utils/constants";

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
            (placeholder: any) => !value || (!value[placeholder]?.trim() as any)
          );
          return missing.length === 0;
        }
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const DashboardPage = () => {
  const router = useRouter();
  const { fetchTemplates, templates } = useTemplates();
  const { loading, results, transcribe, setResults } = useTranscribe();

  useEffect(() => {
    fetchTemplates();
  }, []);

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
      <div className="max-w-7xl mx-auto">
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
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              View History
            </button>
            <button
              onClick={() => router.push("/templates/create")}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-lg cursor-pointer"
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
            platforms: PLATFORMS.slice(0, 2).map((platform) => platform.value),
            tone: "Professional",
            useTemplate: false,
            selectedTemplate: templates[0] as ITemplate,
          }}
          onSubmit={handleSubmit}
          // validationSchema={validationSchema}
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
                  <SelectTemplate
                    templates={templates}
                    templateData={values.templateData}
                    setFieldValue={(placeholder, value) =>
                      setFieldValue(placeholder as string, value)
                    }
                    selectedTemplate={values.selectedTemplate}
                    onSelectTemplate={(template, setFieldValue) =>
                      handleTemplateSelect(template, setFieldValue)
                    }
                  />
                )}
              </div>

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

              <SelectTone
                tone={values.tone}
                onClick={(tone) => setFieldValue("tone", tone)}
              />

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

        {results.length > 0 && (
          <DisplayResults
            results={results}
            copyContent={(content) => copyContent(content)}
          />
        )}
      </div>
    </div>
  );
};
