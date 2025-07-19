import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--card-bg)] py-6 px-6 text-[var(--text-secondary)] text-center text-sm">
      <div className="flex justify-center gap-6">
        <a href="#" className="hover:text-[var(--primary)]">About</a>
        <a href="#" className="hover:text-[var(--primary)]">Contact</a>
        <a href="#" className="hover:text-[var(--primary)]">Privacy</a>
      </div>
      <p className="mt-4">
        © {new Date().getFullYear()} forma. All rights reserved.
      </p>
    </footer>
  );
};
