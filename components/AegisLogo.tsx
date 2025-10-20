import React from 'react';

interface AegisLogoProps {
  size?: 'small' | 'medium';
}

const AegisLogo: React.FC<AegisLogoProps> = ({ size = 'medium' }) => {
  const isSmall = size === 'small';
  return (
    <div className="flex items-center space-x-3">
      <div className={isSmall ? 'w-8 h-8' : 'w-10 h-10'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-label="AEGIS Logo"
          role="img"
          className="w-full h-full"
        >
          <path
            d="M4 2h16v9c0 7-8 11-8 11s-8-4-8-11V2z"
            fill="#b91c1c"
            stroke="#4b5563"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="11.5" r="5" fill="white" />
          <path
            d="M8.5 10.5 H 11 V 9.5 H 13 V 10.5 H 15.5 V 12.5 H 13 V 13.5 H 11 V 12.5 H 8.5 Z"
            fill="none"
            stroke="#111827"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <span className={`font-bold ${isSmall ? 'text-xl' : 'text-2xl'} text-[var(--text-heading)]`}>AEGIS</span>
        {!isSmall && (
            <p className="text-xs text-[var(--text-muted)] -mt-1">Mind, Health, Voice</p>
        )}
      </div>
    </div>
  );
};

export default AegisLogo;
