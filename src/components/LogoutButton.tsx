import React from "react";
import { useRouter } from "next/router";

const LogoutButton: React.FC<{ handleLogout: () => void }> = ({
  handleLogout,
}) => {
  const router = useRouter();

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
