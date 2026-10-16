import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDynamicPublicationTrendData } from '../utils/chartData';

interface Props {
  selectedYear?: string;
  selectedDept?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm text-xs">
        <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{label}</p>
        <p className="text-gray-700 font-medium">
          Publications: <span className="text-blue-600 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PublicationTrendChart: React.FC<Props> = ({ selectedYear, selectedDept }) => {
  const data = getDynamicPublicationTrendData(selectedYear, selectedDept);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPublications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="year" 
          stroke="#94a3b8" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="publications" 
          stroke="#2563eb" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#colorPublications)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PublicationTrendChart;
