import React from "react";

interface MinoLogoProps {
  size?: number;
  className?: string;
}

export function MinoLogo({ size = 28, className = "" }: MinoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-lg shadow-sm flex-shrink-0 select-none ${className}`}
    >
      {/* Trello-blue rounded square background */}
      <rect width="32" height="32" rx="7" fill="#0065ff" />

      {/* 3 Vertical Lines in Trello white: Medium, Short, Long */}
      {/* Left bar (medium) */}
      <rect x="6" y="6.5" width="4.5" height="13.5" rx="2.25" fill="#ffffff" />

      {/* Middle bar (short) */}
      <rect x="13.75" y="6.5" width="4.5" height="7.5" rx="2.25" fill="#ffffff" />

      {/* Right bar (long) */}
      <rect x="21.5" y="6.5" width="4.5" height="19" rx="2.25" fill="#ffffff" />
    </svg>
  );
}
