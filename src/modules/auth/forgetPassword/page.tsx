"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Formik } from "formik"
import { useAuth } from "@/modules/auth/context"
import { TextInput } from "@/components/input/TextInput"

export const ForgotPasswordPage = () => {
  const [message, setMessage] = useState("");
  const {forgotPassword,  isLoading } = useAuth()
  const router = useRouter();


  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-4 text-center">Forgot Password</h1>
        <p className="text-[var(--text-secondary)] text-center mb-6">
          Enter your email to receive a password reset link.
        </p>
        <Formik initialValues={{ email: "" }} onSubmit={(values, actions) => forgotPassword(values.email)}>
         <TextInput 
           type="email"
           label="Email"
            placeholder="Email Address"
            // className="w-full p-2 border border-[var(--text-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Send Reset Link
          </button>
          {/*{message && <p className="text-center text-[var(--text-primary)] mt-2">{message}</p>}*/}
        </Formik>
        <p className="text-center text-[var(--text-secondary)] mt-4">
          <Link href="/login" className="text-[var(--primary)] hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
