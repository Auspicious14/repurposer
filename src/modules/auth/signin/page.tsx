"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";
import { useAuth } from "../context";
import { PasswordCheck } from "../components/passwordCheck";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

export const LoginPage: React.FC = () => {
  const { isLoading, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
          {({ values, isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput
                label="Email"
                name="email"
                type="email"
                required
                aria-required="true"
              />
              <div className="relative">
                <TextInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <PasswordCheck password={values.password} />

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
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <LoadingSpinner className="text-white" />
                  </div>
                ) : (
                  "Sign In"
                )}
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
