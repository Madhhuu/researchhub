import React from 'react';
import { FileText, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  supportingText: string;
  iconName: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  FileText,
  CheckCircle,
  Clock,
  Users,
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  supportingText,
  iconName,
}) => {
  const Icon = iconMap[iconName] || FileText;
  
  // Custom styling for pending cards to differentiate warnings
  const isPending = iconName === 'Clock';

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${
          isPending 
            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
            : 'bg-blue-50 text-blue-600 border border-blue-100'
        }`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">{value}</h3>
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold py-0.5 px-1.5 rounded ${
            isPending 
              ? 'bg-amber-50 text-amber-700' 
              : isPositive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
          }`}>
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {change}
          </span>
          <span className="text-xs text-gray-400 font-medium">{supportingText}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
