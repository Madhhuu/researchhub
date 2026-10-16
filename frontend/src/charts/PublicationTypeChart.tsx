import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getDynamicPublicationTypeData } from '../utils/chartData';

interface Props {
  selectedYear?: string;
  selectedDept?: string;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm text-xs">
        <p className="font-bold text-gray-700">{data.name}</p>
        <p className="text-gray-500 font-medium mt-0.5">
          Count: <span className="text-gray-900 font-bold">{data.value.toLocaleString()}</span>
        </p>
        <p className="text-gray-500 font-medium">
          Percentage: <span className="text-blue-600 font-bold">{data.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const PublicationTypeChart: React.FC<Props> = ({ selectedYear, selectedDept }) => {
  const { data, total } = getDynamicPublicationTypeData(selectedYear, selectedDept);

  return (
    <div className="flex flex-col h-full justify-between pb-2">
      <div className="relative w-full h-[180px] flex-shrink-0">
        {/* Centered text in the middle of donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900 block leading-none">{total.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">Publications</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Custom Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-2 text-xs">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-xs flex-shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-gray-600 truncate font-medium">{item.name}</span>
            <span className="text-gray-400 font-semibold ml-auto">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationTypeChart;
