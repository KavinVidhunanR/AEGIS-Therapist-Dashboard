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
            d="M12,22 C12,22 4,16 4,8.5 C4,4.5 5.5,2 12,2 C18.5,2 20,4.5 20,8.5 C20,16 12,22 12,22Z" 
            fill="#b91c1c" 
            stroke="#4b5563"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="10" r="4.5" fill="white" />
          <path 
            d="M11.25 7.5 H12.75 V10 H15 V11.5 H12.75 V14 H11.25 V11.5 H9 V10 H11.25 V7.5 Z"
            fill="white"
            stroke="#111827"
            strokeWidth="0.35"
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