import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Eye, 
  LayoutGrid,
  List
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationContext';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';

const Publications: React.FC = () => {
  const { publications } = usePublications();
  const { user } = useAuth();

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const departments = ['All', 'CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil'];
  const types = ['All', 'Journal', 'Conference', 'Book Chapter', 'Patent'];
  const statuses = ['All', 'Verified', 'Pending', 'Rejected'];

  // Filtered publications logic
  const filteredPublications = publications.filter((pub) => {
    // Strict Role based visibility check:
    // Faculty members see STRICTLY Verified/Approved papers only. Zero pending papers displayed!
    if (user?.role === 'Faculty' && pub.status !== 'Verified') {
      return false;
    }

    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.journalOrConference && pub.journalOrConference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || pub.department === selectedDept;
    const matchesType = selectedType === 'All' || pub.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || pub.status === selectedStatus;

    return matchesSearch && matchesDept && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Page Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Repository Management</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">Faculty Research Publications</h2>
        </div>
        {user?.role === 'Faculty' && (
          <Link to="/publications/add">
            <Button variant="primary" size="md" className="cursor-pointer">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Upload New Research</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, journal..."
              className="bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 w-full"
            />
          </div>

          {/* Filters & View toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Dept Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Dept: All</option>
              {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Type: All</option>
              {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Status: All</option>
              {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Toggle Table/Grid */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200/60 ml-auto md:ml-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing <strong className="text-gray-900 font-semibold">{filteredPublications.length}</strong> publications</span>
        {(searchTerm || selectedDept !== 'All' || selectedType !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDept('All');
              setSelectedType('All');
              setSelectedStatus('All');
            }}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Publications View */}
      {filteredPublications.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl p-12 text-center shadow-2xs">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No publications found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find what you are looking for.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Title & Venue</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Year</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredPublications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <Link 
                            to={`/publications/${pub.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                          >
                            {pub.title}
                          </Link>
                          {pub.journalOrConference && (
                            <span className="text-xs text-gray-400 block truncate mt-0.5">{pub.journalOrConference}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{pub.facultyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-xs font-bold text-gray-600 bg-gray-100 rounded border border-gray-200/50">
                        {pub.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">{pub.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{pub.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={pub.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link 
                        to={`/publications/${pub.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPublications.map((pub) => (
            <div key={pub.id} className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded">
                    {pub.type}
                  </span>
                  <StatusBadge status={pub.status} />
                </div>
                <Link to={`/publications/${pub.id}`} className="block">
                  <h3 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors line-clamp-2">
                    {pub.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 font-medium">{pub.facultyName} • <span className="font-bold text-gray-700">{pub.department}</span></p>
                {pub.abstract && (
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">
                    {pub.abstract}
                  </p>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Year: <strong className="text-gray-700">{pub.year}</strong></span>
                <Link to={`/publications/${pub.id}`} className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  View <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Publications;
