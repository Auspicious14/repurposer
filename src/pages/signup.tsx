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
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const { firstName, lastName, email, password } = values;
    setError("");
    setMessage("");
    setLoading(true);

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
      const fallback = "Registration failed. Please try again.";
      setError((err as Error)?.message || fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Create Your Account
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
          <form className="space-y-5">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="w-full">
                <TextInput
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  type="text"
                  required
                />
              </div>
              <div className="w-full">
                <TextInput
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  type="text"
                  required
                />
              </div>
            </div>

            <TextInput
              label="Email"
              name="email"
              placeholder="example@example.com"
              type="email"
              required
            />

            <TextInput
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
              required
            />
            {/* {error && <p className="text-red-600 text-sm mt-2">{error}</p>} */}
            {/* {message && <p className="text-green-600 text-sm mt-2">{message}</p>} */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </Formik>

        <p className="text-center text-sm text-gray-600">
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
