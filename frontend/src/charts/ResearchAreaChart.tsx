import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDynamicResearchAreaData } from '../utils/chartData';

interface Props {
  selectedYear?: string;
  selectedDept?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm text-xs">
        <p className="font-bold text-gray-700">{data.name}</p>
        <p className="text-gray-500 font-medium mt-0.5">
          Publications: <span className="text-blue-600 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ResearchAreaChart: React.FC<Props> = ({ selectedYear, selectedDept }) => {
  const data = getDynamicResearchAreaData(selectedYear, selectedDept);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis 
          type="number" 
          stroke="#94a3b8" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false}
          dy={5}
        />
        <YAxis 
          type="category"
          dataKey="name" 
          stroke="#475569"
          fontSize={11} 
          tickLine={false} 
          axisLine={false}
          width={110}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar 
          dataKey="publications" 
          fill="#2563eb" 
          radius={[0, 4, 4, 0]} 
          maxBarSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResearchAreaChart;
