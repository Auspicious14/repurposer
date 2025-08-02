import { createContext, useContext, useState } from "react";
import { ITranscribePayload, PlatformResult } from "./model";
import api from "@/lib/api";
import { toast } from "sonner";

interface ITranscriptState {
  loading: boolean;
  results: PlatformResult[];
  transcribe: (payload: ITranscribePayload) => Promise<PlatformResult[]>;
  setResults: React.Dispatch<React.SetStateAction<PlatformResult[]>>;
}

const TranscriptContext = createContext<ITranscriptState | undefined>(
  undefined
);

export const useTranscribe = () => {
  const context = useContext(TranscriptContext);

  if (!context || context === undefined) {
    throw new Error(
      "Transcript context must be used within the App Global Provider"
    );
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const TranscribeContextProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlatformResult[]>([]);

  const transcribe = async (payload: ITranscribePayload) => {
    setLoading(true);
    try {
      const response = await api.post("/repurpose", payload);
      const data = response?.data?.data;
      if (response.data.success) {
        setResults(response.data.data.results);

        toast.success(
          `Generated content for ${response.data.data.summary.successful} platforms!`
        );
        return data;
      } else {
        toast.error(response.data.error || "Failed to generate content");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.response?.data?.error || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TranscriptContext.Provider
      value={{ loading, results, transcribe, setResults }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};
