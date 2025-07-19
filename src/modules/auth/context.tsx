"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { FormikHelpers } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setCookie } from "@/helper";
import api from "@/lib/api";

export interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  authStatus: string | null;
  signUp: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  signIn: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authStatus: null,
  isLoading: false,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  forgotPassword: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const handleAuthRequest = async (
    url: string,
    values: any,
    type: "signup" | "signin"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(url, values);
      if (response?.data?.success) {
        if (type === "signin") {
          localStorage.setItem("token", response.data?.data?.token);
          setCookie("token", response.data?.data?.token, 7);
          setUser(response.data?.data);
          toast.success("🎉 Welcome back!");
          router.push("/dashboard");
        } else {
          toast.success("Success! Proceed to Login");
          router.push("/login");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = useCallback(
    async (values: any, actions: FormikHelpers<any>) => {
      await handleAuthRequest("/auth/register", values, "signup");
      actions.setSubmitting(false);
    },
    []
  );

  const signIn = useCallback(
    async (values: any, actions: FormikHelpers<any>) => {
      await handleAuthRequest("/auth/login", values, "signin");
      actions.setSubmitting(false);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgetPassword", { email });
      toast.success("Password reset email sent");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        user,
        isLoading,
        error,
        signUp,
        signIn,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
