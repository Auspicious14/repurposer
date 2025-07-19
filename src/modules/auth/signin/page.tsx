"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { toast } from "sonner";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";
import { useAuth } from "../context";

interface LoginFormValues {
  email: string;
  password: string;
}

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters"),
});

export const LoginPage: React.FC = () => {
  const { isLoading, signIn } = useAuth();

  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)] font-sans">
      <div className="card w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[var(--primary)]">
          Log In to Forma
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={(values, actions) => signIn(values, actions)}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput
                label="Email"
                name="email"
                type="email"
                required
                aria-required="true"
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                required
                aria-required="true"
              />

              {error && (
                <p className="text-sm text-red-600 animate-fade-in">{error}</p>
              )}

              <div className="flex justify-end items-center text-sm">
                <Link
                  href="/password-reset"
                  className="text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="btn w-full py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                aria-label="Log in"
              >
                {isLoading ? <LoadingSpinner className="" /> : "Sign In"}
              </button>
              <Link
                href="/signup"
                className="text-[var(--primary)] hover:underline"
              >
                Create account
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
