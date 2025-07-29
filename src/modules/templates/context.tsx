"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { ITemplate } from "./model";

interface PreviewRequest {
  content: string;
  tone: string;
  sampleData: Record<string, string>;
  platform?: string;
}

interface TemplatesContextType {
  templates: ITemplate[];
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (values: {
    name: string;
    content: string;
    platform: string;
  }) => Promise<void>;
  previewContent: string;
  isPreviewLoading: boolean;
  previewError: string | null;
  sampleData: Record<string, string>;
  setSampleData: (data: any) => void;
  updateSampleData: (key: string, value: string) => void;
  generatePreview: (request: PreviewRequest) => Promise<void>;
  saveOutput: (outputData?: any) => Promise<void>;
  extractPlaceholders: (content: string) => string[];
  resetPreview: () => void;
  getTemplate: (id: string) => Promise<ITemplate | null>;
  updateTemplate: (id: string, data: Partial<ITemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(
  undefined
);

interface TemplatesProviderProps {
  children: ReactNode;
}

export const TemplatesProvider = ({ children }: TemplatesProviderProps) => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [previewContent, setPreviewContent] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, string>>({});

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates");
      if (res.status !== 200) throw new Error("Failed to fetch templates");
      const data = await res.data.data;
      setTemplates(data);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error loading templates";
      setError(errorMessage);
      console.error("Fetch templates error:", err);
    }
  };

  const createTemplate = async (values: {
    name: string;
    content: string;
    platform: string;
  }) => {
    try {
      const res = await api.post("/templates", values);
      if (res.status === 201) {
        toast.success("Template created successfully");
        setTemplates((prev) => [...prev, res.data.data]);
        return;
      } else {
        throw new Error(res.data.message || "Failed to create template");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error creating template";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const getTemplate = useCallback(
    async (id: string): Promise<ITemplate | null> => {
      try {
        const res = await api.get(`/templates/${id}`);
        if (res.data.success) {
          return res.data.data;
        }
        throw new Error(res.data.message || "Failed to fetch template");
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Error fetching template";
        toast.error(errorMessage);
        console.error("Get template error:", err);
        return null;
      }
    },
    []
  );

  const updateTemplate = async (id: string, data: Partial<ITemplate>) => {
    try {
      const res = await api.put(`/templates/${id}`, data);
      if (res.data.success) {
        toast.success("Template updated successfully");
        setTemplates((prev) =>
          prev.map((template) =>
            template._id === id ? { ...template, ...res.data.data } : template
          )
        );
      } else {
        throw new Error(res.data.message || "Failed to update template");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error updating template";
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const res = await api.delete(`/templates/${id}`);
      if (res.data.success) {
        toast.success("Template deleted successfully");
        setTemplates((prev) => prev.filter((template) => template._id !== id));
      } else {
        throw new Error(res.data.message || "Failed to delete template");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error deleting template";
      toast.error(errorMessage);
      throw err;
    }
  };

  const extractPlaceholders = useCallback((content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map((match) => match.slice(2, -2)) : [];
  }, []);

  const updateSampleData = useCallback((key: string, value: string) => {
    setSampleData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const generatePreview = async (request: PreviewRequest) => {
    if (!request.content.trim() || !request.tone) {
      setPreviewContent("");
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError(null);

    try {
      const response = await api.post("/templates/preview", {
        content: request.content,
        tone: request.tone,
        sampleData: request.sampleData,
        platform: request.platform,
      });

      if (response.data.success) {
        setPreviewContent(response.data.data.content);
      } else {
        throw new Error(response.data.message || "Failed to generate preview");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate preview";
      setPreviewError(errorMessage);
      toast.error(errorMessage);
      console.error("Preview generation error:", error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const saveOutput = useCallback(
    async (outputData?: any) => {
      if (!previewContent && !outputData?.content) {
        toast.error("No content to save. Generate a preview first.");
        return;
      }

      try {
        const dataToSave = outputData || {
          content: previewContent,
          timestamp: new Date().toISOString(),
          sampleData,
        };

        const response = await api.post("/templates/outputs", dataToSave);

        if (response.data.success) {
          toast.success("Output saved successfully!");
          return response.data.data;
        } else {
          throw new Error(response.data.message || "Failed to save output");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to save output";
        toast.error(errorMessage);
        throw error;
      }
    },
    [previewContent, sampleData]
  );

  const resetPreview = useCallback(() => {
    setPreviewContent("");
    setPreviewError(null);
    setIsPreviewLoading(false);
  }, []);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        error,
        createTemplate,
        fetchTemplates,
        previewContent,
        isPreviewLoading,
        previewError,
        sampleData,
        setSampleData,
        updateSampleData,
        generatePreview,
        saveOutput,
        extractPlaceholders,
        resetPreview,
        getTemplate,
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplatesProvider");
  }
  return context;
};
