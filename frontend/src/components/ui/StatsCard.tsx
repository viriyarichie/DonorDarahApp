import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
  subtitle?: string;
}

const colorConfig = {
  red: { bg: 'bg-red-50', icon: 'bg-red-600 text-white', text: 'text-red-600' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-600 text-white', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-600 text-white', text: 'text-green-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-500 text-white', text: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-600 text-white', text: 'text-purple-600' },
};

export const StatsCard = ({ title, value, icon: Icon, color = 'red', trend, subtitle }: StatsCardProps) => {
  const colors = colorConfig[color];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
};
