import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    red: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/10',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
    gray: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
  };

  const dotColors = {
    green: 'bg-emerald-500',
    red: 'bg-rose-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    gray: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

