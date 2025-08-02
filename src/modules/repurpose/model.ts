export interface ITranscribePayload {
  useTemplate: boolean;
  template?: string;
  platforms: string[];
  tone: string;
  templateData?: Record<string, string>;
  templateId?: string;
}

export interface PlatformResult {
  format: string;
  content?: string;
  error?: string;
  success: boolean;
  latencyMs?: number;
  source?: string;
}
