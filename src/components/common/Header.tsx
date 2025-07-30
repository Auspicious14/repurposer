import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { ThemeState } from "@/context/theme";
import { useAuth } from "@/modules/auth/context";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { theme, toggleTheme } = ThemeState();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => {
      console.log("Mobile menu toggled. New state:", !prevState);
      return !prevState;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    router.events.on("routeChangeStart", closeMobileMenu);
    return () => {
      router.events.off("routeChangeStart", closeMobileMenu);
    };
  }, [router.events]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--card-bg)] shadow-sm py-4 px-6 flex justify-between items-center">
      <Link
        href={"/"}
        className="text-2xl font-bold text-[var(--text-primary)]"
      >
        Forma
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-[var(--text-secondary)]">
        <Link href="/dashboard" className="hover:text-[var(--primary)]">
          Dashboard
        </Link>
        <Link href="/templates" className="hover:text-[var(--primary)]">
          Templates
        </Link>
        <Link href="/history" className="hover:text-[var(--primary)]">
          History
        </Link>
        <Link href="/community" className="hover:text-[var(--primary)]">
          Community
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--background)]"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>

        <button
          className={
            "md:hidden p-2 rounded-full hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          }
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-[var(--text-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden md:block">
          {isLoggedIn ? (
            <LogoutButton handleLogout={logout} />
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="btn text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 h-full w-64 bg-[var(--card-bg)] shadow-lg flex flex-col pt-4 px-6 md:hidden z-40"
          >
            <button
              className={
                "md:hidden p-2 rounded-full flex items-center self-end w-fit hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              }
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 text-[var(--text-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Link
              href="/dashboard"
              className="py-3 text-lg text-[var(--text-primary)] hover:text-[var(--primary)]"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/templates"
              className="py-3 text-lg text-[var(--text-primary)] hover:text-[var(--primary)]"
              onClick={closeMobileMenu}
            >
              Templates
            </Link>
            <Link
              href="/community"
              className="py-3 text-lg text-[var(--text-primary)] hover:text-[var(--primary)]"
              onClick={closeMobileMenu}
            >
              Community
            </Link>
            <div className="mt-auto pb-6">
              {isLoggedIn ? (
                <LogoutButton handleLogout={logout} />
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="btn w-full"
                >
                  Login
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
