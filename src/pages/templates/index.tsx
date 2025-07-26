import { TemplatesPage } from "@/modules/templates/page";
import { GetServerSideProps } from "next";
import { withProtectedAuth } from "@/utils/auth"

export default function Templates() {
  const handleSelectTemplate = (template: any) => {
    // Handle selected template (e.g., pass to parent or store in context)
    console.log("Selected template:", template);
  };

  return <TemplatesPage onSelectTemplate={handleSelectTemplate} />;
}

export const getServerSideProps = withProtectedAuth();
