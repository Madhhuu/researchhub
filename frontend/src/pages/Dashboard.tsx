import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationContext';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import PublicationTrendChart from '../charts/PublicationTrendChart';
import DepartmentChart from '../charts/DepartmentChart';
import PublicationTypeChart from '../charts/PublicationTypeChart';
import ResearchAreaChart from '../charts/ResearchAreaChart';
import RecentPublications from '../components/dashboard/RecentPublications';
import Button from '../components/common/Button';
import { getDynamicKpis } from '../utils/chartData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { publications } = usePublications();
  const [academicYear, setAcademicYear] = useState('AY 2025 - 2026');
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [selectedDept, setSelectedDept] = useState('All');
  const departments = ['All', 'CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil'];
  const years = ['All Years', 'AY 2025 - 2026', 'AY 2024 - 2025', 'AY 2023 - 2024', 'AY 2022 - 2023'];

  const dynamicKpis = getDynamicKpis(academicYear, selectedDept);

  const myPapers = publications.filter((pub) => {
    if (!user?.name) return false;
    const cleanUserName = user.name.replace(/^Dr\.\s*/i, '').toLowerCase();
    const cleanFacultyName = pub.facultyName.replace(/^Dr\.\s*/i, '').toLowerCase();
    return cleanFacultyName.includes(cleanUserName) || cleanUserName.includes(cleanFacultyName);
  });

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full">
      {/* Dashboard Sub-Header / Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Institutional Overview</span>
          <h2 className="text-base font-bold text-gray-900 mt-0.5">Filter & Export Research Data</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto relative">
          {/* Department Filter selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : `Dept of ${d}`}
              </option>
            ))}
          </select>

          {/* Academic Year Dropdown selector */}
          <div className="relative">
            <button
              onClick={() => setShowYearMenu(!showYearMenu)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{academicYear}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showYearMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowYearMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-sm z-20 overflow-hidden divide-y divide-gray-50">
                  {years.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        setAcademicYear(yr);
                        setShowYearMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        yr === academicYear 
                          ? 'bg-blue-50/65 text-blue-600 font-semibold' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Report Action Button */}
          <Button
            onClick={handleExport}
            variant="secondary"
            size="sm"
            disabled={exporting}
            className="cursor-pointer"
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 animate-bounce" />
                <span className="text-green-600">Exported!</span>
              </>
            ) : (
              <>
                <Download className={`w-3.5 h-3.5 text-gray-400 ${exporting ? 'animate-pulse' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Faculty Personal Submission Tracker Banner */}
      {user?.role === 'Faculty' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Faculty Submissions Tracker</span>
            <h3 className="text-base font-bold">Welcome back, {user.name}</h3>
            <p className="text-xs text-blue-100">
              You have <strong>{myPapers.length}</strong> total paper submissions recorded in your workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/my-publications">
              <Button variant="secondary" size="sm" className="bg-white text-blue-700 border-none font-bold hover:bg-blue-50 cursor-pointer">
                View My Uploads ({myPapers.length})
              </Button>
            </Link>
            <Link to="/publications/add">
              <Button variant="primary" size="sm" className="bg-blue-500 hover:bg-blue-400 font-bold border-none cursor-pointer">
                + Upload New Research
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Row 1: KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Publications"
          value={dynamicKpis.totalPubs.toLocaleString()}
          change="+18.4%"
          isPositive={true}
          supportingText="vs previous period"
          iconName="FileText"
        />
        <StatCard
          title="Verified Publications"
          value={dynamicKpis.verifiedPubs.toLocaleString()}
          change="+14.2%"
          isPositive={true}
          supportingText="vs previous period"
          iconName="CheckCircle"
        />
        <StatCard
          title="Pending Verification"
          value={dynamicKpis.pendingPubs.toLocaleString()}
          change="Updated"
          isPositive={false}
          supportingText="awaiting review"
          iconName="Clock"
        />
        <StatCard
          title="Active Faculty"
          value="245"
          change="+8.7%"
          isPositive={true}
          supportingText="across engineering"
          iconName="Users"
        />
      </div>

      {/* Row 2: Publication Growth & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
          title="Publication Growth" 
          subtitle={`Trajectory (${academicYear})`}
          className="lg:col-span-2"
        >
          <PublicationTrendChart selectedYear={academicYear} selectedDept={selectedDept} />
        </ChartCard>

        <ChartCard 
          title="Publications by Department" 
          subtitle={`Department volume (${academicYear})`}
          className="lg:col-span-1"
        >
          <DepartmentChart selectedYear={academicYear} selectedDept={selectedDept} />
        </ChartCard>
      </div>

      {/* Row 3: Research Fields & Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
          title="Top Research Areas" 
          subtitle="Highest publication volumes by domain keyword"
          className="lg:col-span-2"
        >
          <ResearchAreaChart selectedYear={academicYear} selectedDept={selectedDept} />
        </ChartCard>

        <ChartCard 
          title="Publication Types" 
          subtitle="Distribution of research formats"
          className="lg:col-span-1"
        >
          <PublicationTypeChart selectedYear={academicYear} selectedDept={selectedDept} />
        </ChartCard>
      </div>

      {/* Row 4: Recent Publications list */}
      <div className="w-full">
        <RecentPublications />
      </div>
    </div>
  );
};

export default Dashboard;
