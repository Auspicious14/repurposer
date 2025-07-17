import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-center text-sm mt-10">
      <div className="flex justify-center space-x-6">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Privacy</a>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} Repurposer. All rights reserved.</p>
    </footer>
  );
};

export default Footer;