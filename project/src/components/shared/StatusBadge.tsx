import React from 'react';

interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
  className?: string;
}

export default function StatusBadge({ status, onClick, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace('_', ' ');
    
    switch (normalizedStatus) {
      case 'in production':
        return {
          bg: 'bg-purple-500',
          text: 'text-white',
          label: 'Production'
        };
      case 'ready':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          label: 'Ready'
        };
      case 'urgent':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          label: 'Urgent'
        };
      case 'completed':
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          label: 'Completed'
        };
      case 'paid':
        return {
          bg: 'bg-primary-teal',
          text: 'text-white',
          label: 'Paid'
        };
      case 'partial':
        return {
          bg: 'bg-secondary-charcoal-light',
          text: 'text-white',
          label: 'Partial'
        };
      case 'overdue':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          label: 'Overdue'
        };
      case 'sent':
        return {
          bg: 'bg-primary-teal-light',
          text: 'text-secondary-charcoal',
          label: 'Sent'
        };
      case 'draft':
        return {
          bg: 'bg-neutral-gray-light',
          text: 'text-secondary-charcoal',
          label: 'Draft'
        };
      case 'pending':
        return {
          bg: 'bg-primary-teal-dark',
          text: 'text-white',
          label: 'Pending'
        };
      case 'approved':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          label: 'Approved'
        };
      case 'rejected':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          label: 'Rejected'
        };
      case 'expired':
        return {
          bg: 'bg-orange-500',
          text: 'text-white',
          label: 'Expired'
        };
      case 'active':
        return {
          bg: 'bg-primary-teal',
          text: 'text-white',
          label: 'Active'
        };
      case 'inactive':
        return {
          bg: 'bg-neutral-gray-light',
          text: 'text-secondary-charcoal',
          label: 'Inactive'
        };
      case 'prospect':
        return {
          bg: 'bg-primary-teal-accent',
          text: 'text-secondary-charcoal',
          label: 'Prospect'
        };
      default:
        return {
          bg: 'bg-neutral-gray-light',
          text: 'text-secondary-charcoal',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span 
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer hover:opacity-80 transition-opacity ${config.bg} ${config.text} ${className}`}
      onClick={onClick}
    >
      {config.label}
    </span>
  );
}