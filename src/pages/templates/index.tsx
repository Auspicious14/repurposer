import { TemplatesPage } from "@/modules/templates/page";

export default function Templates() {
  const handleSelectTemplate = (template: any) => {
    // Handle selected template (e.g., pass to parent or store in context)
    console.log("Selected template:", template);
  };

  return <TemplatesPage onSelectTemplate={handleSelectTemplate} />;
}
