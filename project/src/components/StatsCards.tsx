import React from 'react';
import { TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$15,240',
    change: '+12.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: '#D1FAE5',
    iconBg: '#10B981'
  },
  {
    title: 'Active Jobs',
    value: '23',
    change: '+5',
    trend: 'up',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: '#DBEAFE',
    iconBg: '#3B82F6'
  },
  {
    title: 'Completed Jobs',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: '#D1FAE5',
    iconBg: '#10B981'
  },
  {
    title: 'Pending Quotes',
    value: '12',
    change: '+3',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: '#FEF3C7',
    iconBg: '#F59E0B'
  }
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="rounded shadow-sm p-6 border border-gray-200" style={{ backgroundColor: stat.bgColor }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: stat.iconBg }}>{stat.title}</p>
              <p className="text-2xl font-bold" style={{ color: stat.iconBg }}>{stat.value}</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: stat.iconBg }}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium" style={{ color: stat.iconBg }}>
              {stat.change}
            </span>
            <span className="text-sm ml-2" style={{ color: stat.iconBg, opacity: 0.75 }}>vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}