"use client";

import { ReactNode } from "react";
import { Formik, Form, Field } from "formik";
import { TextInput } from "@/components/input/TextInput";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    content: string;
    platform: string;
  }) => Promise<void>;
  title: string;
}

export const ModalComponent = ({
  isOpen,
  onClose,
  onSubmit,
  title,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-[var(--text-secondary)]">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          {title}
        </h3>
        <Formik
          initialValues={{ name: "", content: "", platform: "twitter" }}
          onSubmit={onSubmit}
          validate={(values) => {
            const errors: Partial<{
              name: string;
              content: string;
              platform: string;
            }> = {};
            if (!values.name) errors.name = "Name is required";
            if (!values.content) errors.content = "Content is required";
            if (!values.platform) errors.platform = "Platform is required";
            return errors;
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <Field
                as={TextInput}
                name="name"
                label="Template Name"
                placeholder="Enter template name"
                required
              />
              <Field
                as={TextInput}
                name="content"
                label="Content"
                placeholder="Enter content"
                required
              />
              <Field
                as={TextInput}
                name="platform"
                label="Platform"
                placeholder="e.g., twitter, linkedin, instagram"
                required
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-[var(--text-primary)] py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--primary)] text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};
