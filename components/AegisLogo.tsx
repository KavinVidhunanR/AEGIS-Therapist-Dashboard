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
          <path d="M4 2h16v9c0 7-8 11-8 11s-8-4-8-11V2z" fill="#b91c1c" />
          <path d="M12 11.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" fill="white" opacity="0.2" />
          <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" fill="white" />
          <path d="M12.5 8h-1v4h1V8zM9 10.5v-1h6v1H9z" fill="#b91c1c" />
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
