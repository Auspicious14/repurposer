"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import Link from "next/link";
import LoadingSpinner from "@/components/loader/LoadingSpinner";
import { toast } from "sonner";
import { Formik, Form } from "formik";
import { TextInput } from "@/components/input/TextInput";
import * as Yup from "yup";

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

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", values);
      console.log("API Response:", response); // Debug log
      if (response.status === 200 && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("🎉 Welcome back!");
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response: No token found");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err); // Debug log
      const message =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)]">
      <div className="card w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[var(--primary)]">Log In to forma</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput label="Email" name="email" type="email" required aria-required="true" />
              <TextInput label="Password" name="password" type="password" required aria-required="true" />

              {error && <p className="text-sm text-red-600 animate-fade-in">{error}</p>}

              <div className="flex justify-end items-center text-sm">
                <Link href="/password-reset" className="text-[var(--primary)] hover:underline">
                  Forgot password?
                </Link>
                
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="btn w-full py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                aria-label="Log in"
              >
                {loading ? <LoadingSpinner /> : "Sign In"}
              </button> 
             <Link href="/register" className="text-[var(--primary)] hover:underline">
                  Create account
                </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
