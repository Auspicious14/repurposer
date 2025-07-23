
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "Formik"
import Link from "next/link"
import { api } from "@/lib/api"
import { TextInput } from "@/components/input/TextInput"
import { toast } from "sonner"

export const ResetPasswordPage = () => {
  const router = useRouter();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link");
    }
  }, [token]);

  const handleReset = async (values: any) => {
    if (!token) return;
    
    const { newPassword } = values
    
    const res = await api.post("/auth/reset-password", { token, newPassword})
    const data = await res.data
    toast.success(data.message || data.error)
    
    if (data.success) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-4 text-center">Reset Password</h1>
        <p className="text-[var(--text-secondary)] text-center mb-6">
          Enter your new password below.
        </p>
        <Formik initialValues={{newPassword: "" }} onSubmit={handleReset} >
          <div className="space-y-4">
          <TextInput
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="New Password"
           // className="w-full p-2 border border-[var(--text-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            disabled={!token}
          >
            Set New Password
          </button>
            </div>
        </Formik>
        <p className="text-center text-[var(--text-secondary)] mt-4">
       <Link href="/login" className="text-[var(--primary)] hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
