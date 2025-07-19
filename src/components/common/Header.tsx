import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import LogoutButton from '../LogoutButton';

export const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--card-bg)] shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">forma</h1>
      <nav className="hidden md:flex items-center gap-6 text-[var(--text-secondary)]">
        <a href="/dashboard" className="hover:text-[var(--primary)]">Dashboard</a>
        <a href="/templates" className="hover:text-[var(--primary)]">Templates</a>
        <a href="/community" className="hover:text-[var(--primary)]">Community</a>
      </nav>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-[var(--background)]"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="btn"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
