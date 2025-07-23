
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { useAuth } from "@/modules/auth/context";
import { TextInput } from "@/components/input/TextInput";

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPasswordPage = () => {
  const [message, setMessage] = useState<string>("");
  const { forgotPassword, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values: ForgotPasswordValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const result = await forgotPassword(values.email);
      
    } catch (error) {
      setMessage("Failed to send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-4 text-center">Forgot Password</h1>
        <p className="text-[var(--text-secondary)] text-center mb-6">
          Enter your email to receive a password reset link.
        </p>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: Partial<ForgotPasswordValues> = {};
            if (!values.email) errors.email = "Email is required";
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
              errors.email = "Invalid email address";
            return errors;
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <Field
                as={TextInput}
                type="email"
                name="email"
                label="Email"
                placeholder="Email Address"
                required
              />
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              {message && <p className="text-center text-[var(--text-primary)] mt-2">{message}</p>}
            </Form>
          )}
        </Formik>
        <p className="text-center text-[var(--text-secondary)] mt-4">
          <Link href="/login" className="text-[var(--primary)] hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};
