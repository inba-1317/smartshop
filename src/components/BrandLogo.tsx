import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<LogoProps> = ({ className = "h-8 w-8", size }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Handle */}
      <path 
        d="M 37 52 L 37 38 C 37 25, 63 25, 63 38 L 63 52" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Grommets / Eyelets */}
      <circle cx="37" cy="52" r="3.5" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="63" cy="52" r="3.5" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
      
      {/* Top horizontal line */}
      <line x1="27" y1="46.5" x2="73" y2="46.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Left flared side curve */}
      <path 
        d="M 27 46.5 C 31 56, 29 65, 27.5 73" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      
      {/* Right flared side curve */}
      <path 
        d="M 73 46.5 C 69 56, 71 65, 72.5 73" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
    </svg>
  );
};
