import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { ThemeState } from "@/context/theme";
import { useAuth } from "@/modules/auth/context";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = ThemeState();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-[var(--card-bg)] shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Forma</h1>
      <nav className="hidden md:flex items-center gap-6 text-[var(--text-secondary)]">
        <Link href="/dashboard" className="hover:text-[var(--primary)]">
          Dashboard
        </Link>
        <Link href="/templates" className="hover:text-[var(--primary)]">
          Templates
        </Link>
        <Link href="/community" className="hover:text-[var(--primary)]">
          Community
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--background)]"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>
        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <button onClick={() => router.push("/login")} className="btn">
            Login
          </button>
        )}
      </div>
    </header>
  );
};
