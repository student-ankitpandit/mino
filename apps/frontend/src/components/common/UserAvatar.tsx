import React from "react";

interface UserAvatarProps {
  email?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-600 to-fuchsia-600",
];

export function UserAvatar({ email, id, size = "md", showTooltip = true }: UserAvatarProps) {
  const seed = email || id || "User";
  const initial = seed.charAt(0).toUpperCase();

  // Deterministic color selection
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientIndex = Math.abs(hash) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base font-semibold",
  }[size];

  return (
    <div
      title={showTooltip ? email || id : undefined}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-white font-medium shadow-sm ring-2 ring-[#0b0f19] select-none flex-shrink-0 ${sizeClasses}`}
    >
      {initial}
    </div>
  );
}
