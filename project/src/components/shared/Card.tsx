import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export default function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-teal text-white';
      case 'secondary':
        return 'bg-secondary-charcoal text-white';
      case 'accent':
        return 'bg-primary-teal-accent text-secondary-charcoal';
      default:
        return 'bg-white text-secondary-charcoal border border-gray-200';
    }
  };

  const baseClasses = 'rounded-lg shadow-sm p-6 transition-all';
  const variantClasses = getVariantClasses(variant);
  const hoverClasses = onClick ? 'cursor-pointer hover:shadow-md' : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}