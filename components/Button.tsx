// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean; // New loading prop
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false, // Default to false
  disabled, // Destructure disabled to handle it explicitly
  ...props
}) => {
  let baseStyles = 'font-semibold rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 relative flex items-center justify-center';
  
  // Variant styles
  switch (variant) {
    case 'primary':
      baseStyles += ' bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
    case 'secondary':
      baseStyles += ' bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'danger':
      baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'outline':
      baseStyles += ' border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500';
      break;
  }

  // Size styles
  switch (size) {
    case 'sm':
      baseStyles += ' px-3 py-1 text-sm';
      break;
    case 'md':
      baseStyles += ' px-4 py-2 text-base';
      break;
    case 'lg':
      baseStyles += ' px-6 py-3 text-lg';
      break;
  }

  // Disable button if loading
  const isDisabled = disabled || loading;

  return (
    <button className={`${baseStyles} ${className}`} disabled={isDisabled} {...props}>
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;