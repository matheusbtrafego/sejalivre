"use client";

import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
};

const colorPalette = [
  "linear-gradient(135deg,#F97316,#EA580C)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#EC4899,#DB2777)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[idx];
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const { container, text } = sizeMap[size];
  return (
    <div
      className={`${container} ${text} ${className} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: getColor(name) }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
