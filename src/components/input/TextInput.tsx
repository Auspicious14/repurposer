"use client";

import { useField } from "formik";
import React, { FC, InputHTMLAttributes } from "react";
import { ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: string;
  helperText?: string;
  rows?: number;
  ignoreFormik?: boolean;
}

export const TextInput: FC<ITextInputProps> = ({
  label,
  className = "",
  helperText,
  type = "text",
  ignoreFormik = false,
  ...props
}) => {
  const [field, meta] = ignoreFormik
    ? [props, { touched: false, error: undefined }]
    : useField(props);

  const baseClasses = `
    w-full
    px-4
    rounded-md
    border
    bg-[var(--card-bg)]
    text-[var(--text-primary)]
    transition-all
    duration-300
    ease-in-out
    focus:ring-2
    focus:ring-[var(--primary)]/20
    focus:border-[var(--primary)]
    outline-none
    ${meta.error ? "border-red-500" : "border-[var(--text-secondary)]"}
    ${props.disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : "hover:border-[var(--primary)]"}
    ${className}
  `;

  const inputClasses = `${baseClasses} py-2.5 pr-10 text-sm`;
  const textareaClasses = `${baseClasses} py-2 min-h-[120px] resize-y text-sm`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id || props.name}
        className={`block text-sm font-medium mb-1 transition-colors
          ${meta.error ? "text-red-600" : "text-[var(--text-primary)]"}
        `}
      >
        {label}
      </label>
      <div className="relative">
        {type !== "textarea" ? (
          <input
            {...(ignoreFormik ? props : field)}
            {...props}
            type={type}
            className={inputClasses}
            aria-invalid={meta.touched && meta.error ? "true" : "false"}
            aria-describedby={meta.error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
          />
        ) : (
          <textarea
            {...(ignoreFormik ? props : field)}
            {...props}
            rows={props.rows || 4}
            className={textareaClasses}
            aria-invalid={meta.touched && meta.error ? "true" : "false"}
            aria-describedby={meta.error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
          />
        )}
        {meta.touched && meta.error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div id={`${props.name}-error`} className="flex items-start gap-1.5 text-sm text-red-600">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{meta.error}</span>
        </div>
      ) : (
        helperText && (
          <div id={`${props.name}-helper`} className="flex items-start gap-1.5 text-sm text-[var(--text-secondary)]">
            <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{helperText}</span>
          </div>
        )
      )}
    </div>
  );
};
