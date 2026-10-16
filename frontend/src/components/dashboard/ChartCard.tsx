import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs hover:shadow-xs transition-shadow duration-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
      <div className="relative w-full h-[260px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
