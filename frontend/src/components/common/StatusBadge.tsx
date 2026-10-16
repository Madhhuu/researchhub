import React from 'react';

interface StatusBadgeProps {
  status: 'Verified' | 'Pending' | 'Rejected';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    Verified: 'bg-green-50 text-green-700 border-green-200/60',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
    Rejected: 'bg-red-50 text-red-700 border-red-200/60',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
        status === 'Verified' ? 'bg-green-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
      }`} />
      {status}
    </span>
  );
};

export default StatusBadge;
