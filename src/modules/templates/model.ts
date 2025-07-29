export interface ITemplate {
  _id: string;
  name: string;
  content: string;
  platform:
    | "twitter"
    | "linkedin"
    | "instagram"
    | "blog"
    | "email"
    | "facebook"
    | "tiktok";
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
