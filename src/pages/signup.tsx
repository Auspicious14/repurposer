"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Updated for Next.js 13+
import api from "../lib/api";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { toast } from "sonner";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";

// Define TypeScript interface for form values
interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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

const RegisterPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: RegisterFormValues) => {
    const { firstName, lastName, email, password } = values;
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      if (response.data?.success) {
        toast.success("🎉 Registration successful! You can now log in.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Registration failed. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)] font-sans">
      <div className="card w-full max-w-xl p-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">Create Your forma Account</h2>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput name="firstName" label="First Name" required aria-required="true" />
                <TextInput name="lastName" label="Last Name" required aria-required="true" />
              </div>

              <TextInput name="email" label="Email" type="email" required aria-required="true" />
              <TextInput name="password" label="Password" type="password" required aria-required="true" />
              <TextInput name="confirmPassword" label="Confirm Password" type="password" required aria-required="true" />

              {error && <p className="text-sm text-red-500 mt-1 animate-fade-in">{error}</p>}

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="btn w-full py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                aria-label="Sign up"
              >
                {loading ? <LoadingSpinner /> : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--primary)] hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
