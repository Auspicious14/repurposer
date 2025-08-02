import React from "react";
import { TONES } from "@/utils/constants";

interface IProps {
  tone: string;
  onClick: (tone: string) => void;
}

export const SelectTone: React.FC<IProps> = ({ tone, onClick }) => {
  return (
    <div className="card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        Content Tone
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {TONES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onClick(t.value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              tone === t.value
                ? "border-[var(--primary)] bg-[var(--primary)]/10"
                : "border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]/50"
            }`}
          >
            <div className="text-xs font-medium text-[var(--text-primary)]">
              {t.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
