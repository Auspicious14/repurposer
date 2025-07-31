export interface ITemplate {
  _id: string;
  name: string;
  platform: string;
  content: string;
  placeholders: string[];
  placeholderCount: number;
  createdAt: string;
}
