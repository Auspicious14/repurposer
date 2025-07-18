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
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
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
        toast.success("🎉 Success");
        router.push("/");
      }
    } catch (err: unknown) {
      setError(
        (err as Error).message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          <form>
            <div className="mb-4">
              <TextInput label="Email" name="email" type="email" required />
            </div>
            <div className="mb-6">
              <TextInput
                label="Password"
                name="password"
                type="password"
                required
              />
              <div className="flex text-sm gap-1 items-center">
                <p>New User?</p>
                <Link
                  href={"/signup"}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="flex justify-end">
              <p className="text-right text-sm text-gray-500">
                <a href="/password-reset" className="hover:text-blue-500">
                  Forgot Password?
                </a>
              </p>
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mb-4">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? <LoadingSpinner /> : "Sign In"}
              </button>
            </div>
          </form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
