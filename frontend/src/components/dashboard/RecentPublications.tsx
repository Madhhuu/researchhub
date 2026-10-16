import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { usePublications } from '../../context/PublicationContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';

const RecentPublications: React.FC = () => {
  const { publications } = usePublications();
  const { user } = useAuth();

  const visiblePublications = publications.filter((pub) => {
    if (user?.role === 'Faculty') {
      return pub.status === 'Verified';
    }
    return true;
  }).slice(0, 6);

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden font-sans">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Publications</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {user?.role === 'Faculty' ? 'Verified research & your submitted claims' : 'Latest research added to the repository'}
          </p>
        </div>
        <Link 
          to="/publications" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All Publications
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3.5">Publication</th>
              <th className="px-6 py-3.5">Faculty</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Year</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {visiblePublications.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 max-w-sm sm:max-w-xs md:max-w-md lg:max-w-lg truncate">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/publications/${pub.id}`} className="font-semibold text-gray-900 block truncate hover:text-blue-600">
                        {pub.title}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{pub.facultyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-bold text-gray-500 bg-gray-100 rounded-md border border-gray-200/50">
                    {pub.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">{pub.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{pub.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={pub.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPublications;
