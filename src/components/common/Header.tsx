import React, { useState } from "react";

export const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

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
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Login/Signup
        </button>
      </div>
    </header>
  );
};
