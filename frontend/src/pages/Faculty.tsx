import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ExternalLink, Mail } from 'lucide-react';
import { usePublications } from '../context/PublicationContext';
import Button from '../components/common/Button';

const Faculty: React.FC = () => {
  const { facultyList } = usePublications();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil'];

  const filteredFaculty = facultyList.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.researchInterests.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Academic Directory</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">Faculty Members & Researchers</h2>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Total Faculty: <strong className="text-gray-900">{facultyList.length}</strong>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, title, research interest..."
            className="bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 w-full"
          />
        </div>

        {/* Dept filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-gray-500 font-semibold whitespace-nowrap">Filter Dept:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer w-full md:w-auto"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : `Department of ${d}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl p-12 text-center shadow-2xs">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No faculty members found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your search criteria or department filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div 
              key={faculty.id} 
              className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Profile Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center border border-blue-700 shadow-xs flex-shrink-0">
                    {faculty.initials}
                  </div>
                  <div className="min-w-0">
                    <Link 
                      to={`/faculty/${faculty.id}`}
                      className="font-bold text-gray-900 text-base hover:text-blue-600 transition-colors block truncate"
                    >
                      {faculty.name}
                    </Link>
                    <p className="text-xs text-gray-500 font-medium truncate">{faculty.title}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded">
                      Dept of {faculty.department}
                    </span>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/70 rounded-lg border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Papers</span>
                    <span className="text-sm font-bold text-gray-900">{faculty.totalPublications}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Citations</span>
                    <span className="text-sm font-bold text-blue-600">{faculty.citations}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">h-index</span>
                    <span className="text-sm font-bold text-gray-900">{faculty.hIndex}</span>
                  </div>
                </div>

                {/* Research Interests Tags */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Research Domains
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {faculty.researchInterests.slice(0, 3).map((topic, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded border border-gray-200/50"
                      >
                        {topic}
                      </span>
                    ))}
                    {faculty.researchInterests.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-gray-400 font-medium">
                        +{faculty.researchInterests.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {faculty.email}
                </span>
                <Link to={`/faculty/${faculty.id}`}>
                  <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;
