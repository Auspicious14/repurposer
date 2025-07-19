"use client";

import React from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";
import { useAuth } from "../context";

// Define TypeScript interface for form values

// Enhanced validation schema
const FormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const SignUpPage: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)] font-sans ">
      <div className="card w-full max-w-xl p-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">
          Create Your Forma Account
        </h2>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={FormSchema}
          onSubmit={(values, actions) => signUp(values, actions)}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  name="firstName"
                  label="First Name"
                  required
                  aria-required="true"
                />
                <TextInput
                  name="lastName"
                  label="Last Name"
                  required
                  aria-required="true"
                />
              </div>

              <TextInput
                name="email"
                label="Email"
                type="email"
                required
                aria-required="true"
              />
              <TextInput
                name="password"
                label="Password"
                type="password"
                required
                aria-required="true"
              />
              <TextInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                aria-required="true"
              />

              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="btn w-full py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                aria-label="Sign up"
              >
                {isLoading ? (
                  <LoadingSpinner className="flex justify-center items-center text-[var(--text-primary)]" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};
