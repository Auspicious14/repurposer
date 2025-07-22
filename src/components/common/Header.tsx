import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { ThemeState } from "@/context/theme";
import { useAuth } from "@/modules/auth/context";

export const Header = () => {
  const { theme, toggleTheme } = ThemeState();
  const { isLoggedIn, user, logout } = useAuth();

  const router = useRouter();
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
        <Link href="/community" className="hover:text-[var(--primary)]">
          Community
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--background)]"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>
        {isLoggedIn ? (
          <LogoutButton handleLogout={logout} />
        ) : (
          <button onClick={() => router.push("/login")} className="btn text-sm">
            Login
          </button>
        )}
      </div>
    </header>
  );
};
