import React from 'react';

interface AegisLogoProps {
  size?: 'small' | 'medium';
}

const AegisLogo: React.FC<AegisLogoProps> = ({ size = 'medium' }) => {
  const isSmall = size === 'small';
  return (
    <div className="flex items-center space-x-3">
      <img
        src="/aegis-logo.svg"
        alt="AEGIS Logo"
        className={isSmall ? 'w-8 h-8' : 'w-10 h-10'}
      />
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
