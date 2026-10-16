import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Eye
} from 'lucide-react';
import { usePublications } from '../context/PublicationContext';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';

const FacultyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFacultyById, publications } = usePublications();

  const faculty = id ? getFacultyById(id) : undefined;

  // Filter publications authored by this faculty
  const facultyPublications = publications.filter((pub) =>
    faculty ? pub.facultyName.toLowerCase().includes(faculty.name.toLowerCase()) || pub.facultyId === faculty.id : false
  );

  if (!faculty) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center font-sans">
        <div className="bg-white border border-gray-200/80 rounded-xl p-12 shadow-2xs">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Faculty Profile Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            The requested faculty profile could not be found.
          </p>
          <Link to="/faculty">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Faculty Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans max-w-6xl mx-auto">
      {/* Top Nav */}
      <div>
        <Link 
          to="/faculty" 
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Faculty Directory
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center border-2 border-blue-700 shadow-sm flex-shrink-0">
              {faculty.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{faculty.name}</h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{faculty.title}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded text-[10px]">
                  Dept of {faculty.department}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  {faculty.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Biography & Research Domains */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biography & Background</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {faculty.bio}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Research Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {faculty.researchInterests.map((interest, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg border border-gray-200/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Publications</span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">{faculty.totalPublications}</span>
          <span className="text-[11px] text-gray-400 font-medium">Indexed in repository</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Citations</span>
          <span className="text-2xl font-bold text-blue-600 mt-1 block">{faculty.citations}</span>
          <span className="text-[11px] text-gray-400 font-medium">Across Scopus & WoS</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">h-index</span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">{faculty.hIndex}</span>
          <span className="text-[11px] text-gray-400 font-medium">Academic impact factor</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">i10-index</span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">{faculty.i10Index}</span>
          <span className="text-[11px] text-gray-400 font-medium">Papers with 10+ citations</span>
        </div>
      </div>

      {/* Authored Publications Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Authored Publications</h3>
            <p className="text-xs text-gray-500 mt-0.5">Research outputs published by {faculty.name}</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            {facultyPublications.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          {facultyPublications.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No specific publication records linked to this profile.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Title & Venue</th>
                  <th className="px-6 py-3.5">Year</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Citations</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {facultyPublications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <Link 
                        to={`/publications/${pub.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                      >
                        {pub.title}
                      </Link>
                      {pub.journalOrConference && (
                        <span className="text-xs text-gray-400 block truncate mt-0.5">{pub.journalOrConference}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">{pub.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{pub.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-blue-600">{pub.citationCount || 0}</td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
