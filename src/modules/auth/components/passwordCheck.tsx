import React from "react";

export const PasswordCheck = ({ password }: { password: string }) => {
  return (
    <div>
      <div className="text-xs text-gray-500 mt-1">
        Password requirements:
        <ul className="list-none space-y-1 mt-1">
          <li className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${
                password.length >= 8 ? "text-green-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            At least 8 characters
          </li>
          <li className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${
                /[A-Z]/.test(password) ? "text-green-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            One uppercase letter
          </li>
          <li className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${
                /[a-z]/.test(password) ? "text-green-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            One lowercase letter
          </li>
          <li className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${
                /\d/.test(password) ? "text-green-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            One number
          </li>
          <li className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${
                /[@$!%*?&]/.test(password) ? "text-green-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            One special character
          </li>
        </ul>
      </div>
    </div>
  );
};
