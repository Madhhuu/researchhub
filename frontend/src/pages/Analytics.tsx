import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  Download, 
  Globe,
  Calendar
} from 'lucide-react';
import ChartCard from '../components/dashboard/ChartCard';
import PublicationTrendChart from '../charts/PublicationTrendChart';
import DepartmentChart from '../charts/DepartmentChart';
import PublicationTypeChart from '../charts/PublicationTypeChart';
import ResearchAreaChart from '../charts/ResearchAreaChart';
import Button from '../components/common/Button';
import { getDynamicKpis } from '../utils/chartData';

const Analytics: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const departments = ['All', 'CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil'];
  const years = ['All Years', '2026 (AY 2025-26)', '2025 (AY 2024-25)', '2024 (AY 2023-24)', '2023 (AY 2022-23)', '2022'];

  const kpis = getDynamicKpis(selectedYear, selectedDept);

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Intelligence Suite</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">Institutional Research Analytics</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer text-xs"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter Selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : `Dept of ${d}`}
              </option>
            ))}
          </select>

          <Button variant="secondary" size="sm" onClick={() => alert('Analytics report exported!')}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Charts
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Citations</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{kpis.totalCitations.toLocaleString()}</h3>
          <p className="text-xs text-green-600 font-semibold mt-1">↑ +22.4% vs prev period</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg h-index</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{kpis.avgHIndex}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Across active faculty</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scopus / WoS Indexed</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{kpis.scopusPercent}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">High-impact publications</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">International Co-Authors</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{kpis.internationalPercent}</h3>
          <p className="text-xs text-green-600 font-semibold mt-1">Global collaboration</p>
        </div>
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
          title="Citation & Output Growth Trajectory" 
          subtitle={`Trajectory overview (${selectedYear === 'All Years' ? '2022–2026' : selectedYear} | ${selectedDept === 'All' ? 'All Depts' : selectedDept})`}
          className="lg:col-span-2"
        >
          <PublicationTrendChart selectedYear={selectedYear} selectedDept={selectedDept} />
        </ChartCard>

        <ChartCard 
          title="Department Productivity Index" 
          subtitle={`Volume breakdown (${selectedYear === 'All Years' ? 'Cumulative' : selectedYear})`}
          className="lg:col-span-1"
        >
          <DepartmentChart selectedYear={selectedYear} selectedDept={selectedDept} />
        </ChartCard>
      </div>

      {/* Row 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
          title="Top Research Domain Keywords" 
          subtitle={`Publications by domain (${selectedDept === 'All' ? 'All Depts' : selectedDept})`}
          className="lg:col-span-2"
        >
          <ResearchAreaChart selectedYear={selectedYear} selectedDept={selectedDept} />
        </ChartCard>

        <ChartCard 
          title="Format Distribution" 
          subtitle="Journal, Conference, Book Chapter, Patent ratio"
          className="lg:col-span-1"
        >
          <PublicationTypeChart selectedYear={selectedYear} selectedDept={selectedDept} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
