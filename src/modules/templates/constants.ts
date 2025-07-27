

export const PLATFORMS = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'blog', label: 'Blog' },
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
] as const;

export const TONES = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'informative', label: 'Informative' },
] as const;

export const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;

export const VALIDATION_MESSAGES = {
  TEMPLATE_NAME_REQUIRED: 'Template Name is required',
  PLATFORM_REQUIRED: 'Platform is required',
  CONTENT_REQUIRED: 'Template Content is required',
  TONE_REQUIRED: 'Tone is required',
  PLACEHOLDERS_REQUIRED: 'Template must contain at least one placeholder (e.g., {{title}})',
} as const;
