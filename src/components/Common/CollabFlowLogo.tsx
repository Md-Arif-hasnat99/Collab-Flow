import React from 'react';
import { CollabFlowIcon } from './CollabFlowIcon';

interface CollabFlowLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  isDark?: boolean;
}

export function CollabFlowLogo({ size = 48, className = '', showText = true, isDark = false }: CollabFlowLogoProps) {
  const iconSize = size;
  const fontSize = size * 0.4; // Adjusted font size multiplier for better visual balance
  
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <CollabFlowIcon size={iconSize} />
      
      {showText && (
        <div className="flex flex-col items-start">
          <span 
            className={`font-bold leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            Collab<span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>Flow</span>
          </span>
        </div>
      )}
    </div>
  );
}
