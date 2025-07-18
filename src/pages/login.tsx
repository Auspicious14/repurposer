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
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters"),
});

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const { email, password } = values;
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response?.data?.success) {
        localStorage.setItem("token", response.data.token);
        toast.success("🎉 Welcome back!");
        router.push("/");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-[var(--foreground)] rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[var(--primary)]">
          Log In
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          <form className="space-y-4">
            <TextInput label="Email" name="email" type="email" required />
            <TextInput
              label="Password"
              name="password"
              type="password"
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between items-center text-sm">
              <Link
                href="/password-reset"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--primary)] hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              {loading ? <LoadingSpinner /> : "Sign In"}
            </button>
          </form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
