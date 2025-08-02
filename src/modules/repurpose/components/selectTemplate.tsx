import { TextInput } from "@/components/input/TextInput";
import { ITemplate } from "@/modules/templates/model";
import { useRouter } from "next/navigation";
import React from "react";

interface IProps {
  selectedTemplate: ITemplate;
  templateData: { placeholder: string; value: string };
  templates: ITemplate[];
  setFieldValue: (placeholder?: string, value?: any) => void;
  onSelectTemplate: (template: ITemplate, setFieldValue: any) => void;
}
export const SelectTemplate: React.FC<IProps> = ({
  selectedTemplate,
  templateData,
  templates,
  onSelectTemplate,
  setFieldValue,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Select Template *
        </label>

        {templates.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-[var(--text-secondary)] mb-4">
              No templates available
            </div>
            <button
              type="button"
              onClick={() => router.push("/templates/create")}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium"
            >
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template._id}
                onClick={() => onSelectTemplate(template, setFieldValue)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  (selectedTemplate?._id as string) === (template._id as string)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-[var(--text-primary)]">
                    {template.name}
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    {template.platform}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                  {template.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {template.placeholderCount} placeholder
                    {template.placeholderCount !== 1 ? "s" : ""}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {template.placeholders.slice(0, 3).map((placeholder) => (
                      <span
                        key={placeholder}
                        className="text-xs bg-[var(--primary)] text-white px-2 py-1 rounded-full"
                      >
                        {`{{${placeholder}}}`}
                      </span>
                    ))}
                    {template.placeholders.length > 3 && (
                      <span className="text-xs text-[var(--text-secondary)]">
                        +{template.placeholders.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
            Fill Template Data *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label className="block text-xs text-[var(--text-secondary)] mb-1 capitalize">
                  {placeholder.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <TextInput
                  label=""
                  name={`templateData.${placeholder}`}
                  type="text"
                  onChange={(e) =>
                    setFieldValue(`templateData.${placeholder}`, e.target.value)
                  }
                  value={
                    templateData[placeholder as keyof typeof templateData] || ""
                  }
                  placeholder={`Enter ${placeholder}`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
