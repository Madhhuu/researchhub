import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDynamicDepartmentData } from '../utils/chartData';

interface Props {
  selectedYear?: string;
  selectedDept?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm text-xs">
        <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{label} Department</p>
        <p className="text-gray-700 font-medium">
          Publications: <span className="text-blue-600 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DepartmentChart: React.FC<Props> = ({ selectedYear, selectedDept }) => {
  const data = getDynamicDepartmentData(selectedYear, selectedDept);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar 
          dataKey="publications" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={40}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.isSelected ? '#3b82f6' : '#cbd5e1'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DepartmentChart;
