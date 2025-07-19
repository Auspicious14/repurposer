"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { toast } from "sonner";
import { Formik } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8).max(20).required("Password is required"),
});

const RegisterPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
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
      setError((err as Error)?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-lg bg-white dark:bg-[var(--foreground)] rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[var(--primary)]">
          Create Account
        </h2>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <TextInput name="firstName" label="First Name" required />
              <TextInput name="lastName" label="Last Name" required />
            </div>

            <TextInput name="email" label="Email" type="email" required />
            <TextInput
              name="password"
              label="Password"
              type="password"
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--primary)] hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              {loading ? <LoadingSpinner /> : "Sign Up"}
            </button>
      </div>>
        </Formik>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
