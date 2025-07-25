"use client";

import { ReactNode } from "react";
import { Formik, Form, Field } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
    name: Yup.string().required('Template Name is required'),
    content: Yup.string().required('Content is required'),
    platform: Yup.string().required('Platform is required')
})
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
    <dialog open className="modal w-full">
      <div className="modal-box bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-[var(--text-secondary)]">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          {title}
        </h3>
        <Formik
          initialValues={{ name: "", content: "", platform: "twitter" }}
          onSubmit={onSubmit}
          validateSchema={FormSchema}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput
                name="name"
                label="Template Name"
                placeholder="Enter template name"
                required
              />
              <TextInput
                label="Content"
                type="textarea"
                name="content"
                placeholder="Enter content"
                required
              />
              <TextInput
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
    </dialog>
  );
};
