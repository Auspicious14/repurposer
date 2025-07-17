import { useState } from "react";
import LoadingSpinner from "../loader/LoadingSpinner";
import ToneSelector from "../ToneSelector";
import { OutputFormatSelector } from "./OutputFormatSelector";

interface InputFormProps {
  onGenerate: (results: { content: string; platform: string }[]) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [content, setContent] = useState("");
  const [formats, setFormats] = useState<string[]>([]);
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate generation logic
    await new Promise((r) => setTimeout(r, 1000));
    const results = formats.map((f) => ({
      platform: f,
      content: `This is a ${tone.toLowerCase()} ${f} version of your content.`,
    }));

    onGenerate(results);
    setLoading(false);
  };

  const toggleFormat = (f: string) =>
    setFormats((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <textarea
        rows={8}
        placeholder="Paste your long-form content here..."
        className="w-full border border-gray-300 p-4 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div>
        <h2 className="text-lg font-medium text-gray-800">
          Choose output format
        </h2>
        <OutputFormatSelector
          selectedFormats={formats}
          onSelectFormat={toggleFormat}
        />
      </div>

      <ToneSelector selectedTone={tone} onSelectTone={setTone} />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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
    </form>
  );
};
