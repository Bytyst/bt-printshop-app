import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  headerVariant?: 'default' | 'primary' | 'secondary';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  size = 'lg',
  headerVariant = 'primary'
}: ModalProps) {
  if (!isOpen) return null;

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      default: return 'max-w-4xl';
    }
  };

  const getHeaderClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-teal text-white';
      case 'secondary':
        return 'bg-secondary-charcoal text-white';
      default:
        return 'bg-gray-50 text-secondary-charcoal border-b border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${getSizeClasses(size)}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 ${getHeaderClasses(headerVariant)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{title}</h3>
              {subtitle && (
                <p className="opacity-90 mt-1">{subtitle}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}