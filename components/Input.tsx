
import React from 'react';

interface InputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  min?: number;
  step?: number;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  min,
  step,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      onChange(parseFloat(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      min={min}
      step={step}
      className={`
        w-full p-2.5 rounded-md border border-gray-300 text-base
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        transition-all duration-200
        ${className}
      `}
    />
  );
};

export default Input;
