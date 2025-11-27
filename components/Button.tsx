
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md font-bold text-base cursor-pointer
        transition-opacity duration-200 w-full sm:w-auto
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-85'}
        ${className}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
