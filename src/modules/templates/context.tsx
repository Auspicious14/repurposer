"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useAuth } from "@/modules/auth/context";
import api from "@/lib/api";
import { toast } from "sonner";

interface Template {
  _id: string;
  name: string;
  content: string;
  platform: "twitter" | "linkedin" | "instagram";
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplatesContextType {
  templates: Template[];
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (values: {
    name: string;
    content: string;
    platform: string;
  }) => Promise<void>;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(
  undefined
);

interface TemplatesProviderProps {
  children: ReactNode;
}

export const TemplatesProvider = ({ children }: TemplatesProviderProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTemplates = async () => {
    if (!user) return;
    try {
      const res = await api.get("/templates");
      if (res.status !== 200) throw new Error("Failed to fetch templates");
      const data = await res.data.data;
      setTemplates(data);
    } catch (err) {
      setError("Error loading templates");
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
        setError("Failed to create template");
      }
    } catch (err) {
      setError("Error creating template");
    }
  };

  return (
    <TemplatesContext.Provider
      value={{ templates, error, fetchTemplates, createTemplate }}
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
