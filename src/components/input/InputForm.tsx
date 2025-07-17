import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "@/lib/api";
import LoadingSpinner from "../loader/LoadingSpinner";
import ToneSelector from "../ToneSelector";
import { OutputFormatSelector } from "./OutputFormatSelector";
import { TextInput } from "./TextInput";

const FormSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
  formats: Yup.array().min(1, "Select at least one format"),
  tone: Yup.string().required("Tone is required"),
});

interface InputFormProps {
  onGenerate: (results: { content: string; platform: string }[]) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    content: string;
    formats: string[];
    tone: string;
  }) => {
    setLoading(true);

    try {
      const res = await api.post("/transcribe", {
        transcript: values.content,
        platforms: values.formats,
        tone: values.tone,
      });
      console.log({ results: res.data?.data });
      const results = (res.data?.data || []).map((item: any) => ({
        platform: item.format,
        content:
          item.content || `This is a ${values.tone} ${item.format} version.`,
      }));

      onGenerate(results);
    } catch (err: unknown) {
      console.error("Submission error:", err);
      // Optionally show toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        content: "",
        formats: ["LinkedIn"],
        tone: "Professional",
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          <TextInput
            label="Content"
            name="content"
            type="textarea"
            rows={8}
            placeholder="Paste your long-form content here..."
            className="w-full border border-gray-300 p-4 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Choose output format
            </h2>
            <OutputFormatSelector
              selectedFormats={values.formats}
              onSelectFormat={(f) => {
                const next = values.formats.includes(f)
                  ? values.formats.filter((x) => x !== f)
                  : [...values.formats, f];
                setFieldValue("formats", next);
              }}
            />
            {touched.formats && errors.formats && (
              <p className="text-red-500 text-sm">{errors.formats}</p>
            )}
          </div>

          <ToneSelector
            selectedTone={values.tone}
            onSelectTone={(t) => setFieldValue("tone", t)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner />
                <span className="ml-2">Generating...</span>
              </div>
            ) : (
              "Generate"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};
