import React from "react";

interface UserAvatarProps {
  email?: string;
  id?: string;
  name?: string | null;
  profilePicture?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showTooltip?: boolean;
  className?: string;
}

const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-600 to-fuchsia-600",
];

export function UserAvatar({
  email,
  id,
  name,
  profilePicture,
  size = "md",
  showTooltip = true,
  className = "",
}: UserAvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // Reset image error if profile picture URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [profilePicture]);

  const seed = name || email || id || "User";
  const initial = seed.charAt(0).toUpperCase();

  // Deterministic color selection
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientIndex = Math.abs(hash) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  const sizeClasses = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base font-semibold",
    xl: "w-14 h-14 text-xl font-bold",
    "2xl": "w-20 h-20 text-3xl font-bold",
  }[size];

  const tooltipText = name && email ? `${name} (${email})` : name || email || id;

  if (profilePicture && !imageError) {
    return (
      <div
        title={showTooltip ? tooltipText : undefined}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm ring-2 ring-[#0b0f19] select-none flex-shrink-0 bg-slate-800 ${sizeClasses} ${className}`}
      >
        <img
          src={profilePicture}
          alt={tooltipText || "Avatar"}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      title={showTooltip ? tooltipText : undefined}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-white font-medium shadow-sm ring-2 ring-[#0b0f19] select-none flex-shrink-0 ${sizeClasses} ${className}`}
    >
      {initial}
    </div>
  );
}
