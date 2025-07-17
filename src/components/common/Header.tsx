import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import LogoutButton from '../LogoutButton';

export const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <header className="w-full py-4 px-6 bg-white dark:bg-gray-800 shadow-md flex sticky top-0 justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Repurposer
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
