import React from 'react';

interface CollabFlowIconProps {
  size?: number;
  className?: string;
}

export const CollabFlowIcon: React.FC<CollabFlowIconProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="14"
        height="14"
        rx="4"
        fill="url(#gradient1)"
        fillOpacity="0.9"
      />
      <rect
        x="14"
        y="14"
        width="14"
        height="14"
        rx="4"
        fill="url(#gradient2)"
        fillOpacity="0.9"
      />
      <defs>
        <linearGradient
          id="gradient1"
          x1="4"
          y1="4"
          x2="18"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient
          id="gradient2"
          x1="14"
          y1="14"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
