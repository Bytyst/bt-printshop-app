import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'accent' | 'light';
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  change, 
  icon: Icon, 
  variant = 'primary',
  trend = 'neutral'
}: StatsCardProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-primary-teal',
          text: 'text-white',
          iconBg: 'bg-primary-teal-dark'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-charcoal',
          text: 'text-white',
          iconBg: 'bg-secondary-charcoal-light'
        };
      case 'accent':
        return {
          bg: 'bg-primary-teal-accent',
          text: 'text-secondary-charcoal',
          iconBg: 'bg-secondary-charcoal'
        };
      case 'light':
        return {
          bg: 'bg-primary-teal-light',
          text: 'text-secondary-charcoal',
          iconBg: 'bg-secondary-charcoal'
        };
      default:
        return {
          bg: 'bg-primary-teal',
          text: 'text-white',
          iconBg: 'bg-primary-teal-dark'
        };
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'opacity-80';
    }
  };

  const classes = getVariantClasses(variant);

  return (
    <div className={`rounded-lg shadow-lg p-6 ${classes.bg} ${classes.text}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-80 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`flex items-center mt-2 text-sm font-medium ${getTrendColor(trend)}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${classes.iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}