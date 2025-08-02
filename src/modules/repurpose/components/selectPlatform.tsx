import { PLATFORMS } from "@/utils/constants";
import React from "react";

interface IProps {
  onClick: (platform: string) => void;
  platforms: string[];
}
export const SelectPlatform: React.FC<IProps> = ({ platforms, onClick }) => {
  return (
    <div className="card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        Target Platforms
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {PLATFORMS.map((platform) => (
          <button
            key={platform?.value}
            type="button"
            onClick={() => onClick(platform.value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              platforms.includes(platform.value)
                ? "border-[var(--primary)] bg-[var(--primary)]/10"
                : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
            }`}
          >
            <div className="text-center">
              <div className="text-xl mb-1">{platform.icon}</div>
              <div className="text-xs font-medium text-[var(--text-primary)]">
                {platform.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
