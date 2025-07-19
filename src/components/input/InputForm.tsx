import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "@/lib/api";
import { toast } from "sonner";
import LoadingSpinner from "../loader/LoadingSpinner";
import { OutputFormatSelector } from "./OutputFormatSelector";
import { TextInput } from "./TextInput";
import ToneSelector from "../ToneSelector"

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

  const handleSubmit = async (values: { content: string; formats: string[]; tone: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/transcribe", {
        transcript: values.content, // Changed from transcript to match form
        platforms: values.formats,
        tone: values.tone,
      });
      console.log("API Response:", res.data);
      const results = (res.data?.data || []).map((item: { format: string; content?: string }) => ({
        platform: item.format,
        content: item.content || `This is a ${values.tone} ${item.format} version.`,
      }));
      onGenerate(results);
      toast.success("Content generated successfully!");
    } catch (err: unknown) {
      console.error("Submission error:", err);
      toast.error((err as any)?.response?.data?.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ content: "", formats: ["Twitter"], tone: "Professional" }} // Removed hardcoded LinkedIn
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          <p className="text-[var(--text-secondary)] mb-2">Paste your long-form content here to repurpose across platforms!</p>
          <TextInput
            label="Content"
            name="content"
            type="textarea"
            rows={8}
            placeholder="Paste your long-form content here..."
            className="w-full border border-[var(--text-secondary)] p-4 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            required
          />
          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Choose Output Formats</h2>
            <p className="text-sm text-[var(--text-secondary)]">({values.formats.length}/4 selected)</p>
            <OutputFormatSelector
              selectedFormats={values.formats}
              onSelectFormat={(f) => setFieldValue("formats", values.formats.includes(f) ? values.formats.filter((x) => x !== f) : [...values.formats, f])}
            />
            {touched.formats && errors.formats && <p className="text-red-500 text-sm">{errors.formats}</p>}
          </div>
          {/* Assuming ToneSelector exists */}
          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Select Tone</h2>
            <ToneSelector selectedTone={values.tone} onSelectTone={(t) => setFieldValue("tone", t)} />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
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
