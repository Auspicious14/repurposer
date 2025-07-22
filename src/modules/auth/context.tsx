"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { FormikHelpers } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "@/helper";
import api from "@/lib/api";

export interface AuthContextType {
  user: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  authStatus: string | null;
  signUp: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  signIn: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authStatus: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  forgotPassword: async () => {},
  logout: () => {},
});

export const AuthContextProvider = ({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser: any;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

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
          const userData = response.data?.data?.user;
          const token = response.data?.data?.token;

          localStorage.setItem("token", token);
          setCookie("token", token, 7);
          setUser(userData);
          setIsLoggedIn(true);
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

  const logout = () => {
    if (!isLoggedIn) return;
    deleteCookie("token", 7);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        user,
        isLoading,
        isLoggedIn,
        error,
        signUp,
        signIn,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
