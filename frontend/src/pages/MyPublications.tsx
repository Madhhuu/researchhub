import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  Plus, 
  BookOpen, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  Mail,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationContext';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';

const MyPublications: React.FC = () => {
  const { user } = useAuth();
  const { publications, pdfRequests, approvePdfRequest, rejectPdfRequest } = usePublications();
  const [activeTab, setActiveTab] = useState<'uploads' | 'requests'>('uploads');

  // Filter papers submitted by the logged-in faculty member
  const cleanUserName = user?.name ? user.name.replace(/^Dr\.\s*/i, '').toLowerCase().trim() : '';
  const myPapers = publications.filter((pub) => {
    if (!cleanUserName) return false;
    const cleanFacultyName = pub.facultyName.replace(/^Dr\.\s*/i, '').toLowerCase().trim();
    return cleanFacultyName.includes(cleanUserName) || cleanUserName.includes(cleanFacultyName);
  });

  // Filter PDF requests addressed to this faculty member
  const incomingRequests = pdfRequests.filter((req) => {
    if (!cleanUserName) return true;
    const cleanReqFaculty = req.facultyName.replace(/^Dr\.\s*/i, '').toLowerCase().trim();
    return cleanReqFaculty.includes(cleanUserName) || cleanReqFaculty.includes(cleanUserName);
  });

  const verifiedCount = myPapers.filter((p) => p.status === 'Verified').length;
  const pendingCount = myPapers.filter((p) => p.status === 'Pending').length;
  const rejectedCount = myPapers.filter((p) => p.status === 'Rejected').length;
  const pendingRequestsCount = incomingRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Faculty Workspace</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">My Uploads & Requests</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your uploaded research outputs and authorize full-text PDF access requests from scholars.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/publications/add">
            <Button variant="primary" size="md" className="cursor-pointer">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Upload New Research</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Personal KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Submissions</span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">{myPapers.length}</span>
          <span className="text-[11px] text-gray-400 font-medium">Uploaded by you</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block">Verified</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-green-700 mt-1 block">{verifiedCount}</span>
          <span className="text-[11px] text-gray-400 font-medium">Indexed in repository</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">In Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{pendingCount}</span>
          <span className="text-[11px] text-gray-400 font-medium">In admin queue</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Needs Revision</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-600 mt-1 block">{rejectedCount}</span>
          <span className="text-[11px] text-gray-400 font-medium">Revisions requested</span>
        </div>

        <div 
          onClick={() => setActiveTab('requests')}
          className="bg-white border border-blue-200/80 rounded-xl p-4 shadow-2xs cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">PDF Requests</span>
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-blue-700">{pendingRequestsCount}</span>
            <span className="text-xs text-gray-500">pending</span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Click to review</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'uploads'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          My Uploaded Research ({myPapers.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Incoming PDF Requests</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Uploads Log */}
      {activeTab === 'uploads' && (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Your Upload Log</h3>
              <p className="text-xs text-gray-500 mt-0.5">Historical log of all research outputs submitted under {user?.name}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
              {myPapers.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            {myPapers.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 space-y-3">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">No uploads recorded yet</h4>
                <p className="max-w-xs mx-auto">
                  You haven't submitted any research outputs yet. Click "Upload New Research" to register your first output.
                </p>
                <Link to="/publications/add" className="inline-block pt-2">
                  <Button variant="primary" size="sm">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Submit Your Research
                  </Button>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Title & Venue</th>
                    <th className="px-6 py-3.5">Format Type</th>
                    <th className="px-6 py-3.5">Upload Date</th>
                    <th className="px-6 py-3.5">Attached Proof</th>
                    <th className="px-6 py-3.5">Verification Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {myPapers.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 max-w-md">
                        <Link 
                          to={`/publications/${pub.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 block truncate"
                        >
                          {pub.title}
                        </Link>
                        <span className="text-xs text-gray-400 block truncate mt-0.5">
                          {pub.journalOrConference || 'Journal Submission'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{pub.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                        {pub.submissionDate || `${pub.year}-01-15`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60 font-mono text-[11px]">
                          <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                          {pub.fileUrl || 'paper_document.pdf'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <StatusBadge status={pub.status} />
                          {pub.status === 'Rejected' && (
                            <p className="text-[10px] text-red-600 max-w-xs font-medium leading-tight">
                              Reason: {pub.rejectionReason}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link 
                          to={`/publications/${pub.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
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
      )}

      {/* Tab 2: Incoming PDF Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Full-Text PDF Authorization Requests</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Students and scholars who have requested permission to download your full research paper.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
              {incomingRequests.length} Total Requests
            </span>
          </div>

          <div className="overflow-x-auto">
            {incomingRequests.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 space-y-3">
                <Mail className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">No access requests pending</h4>
                <p className="max-w-xs mx-auto">
                  When scholars or students request full PDF access for your publications, their requests will appear here for your approval.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Requester</th>
                    <th className="px-6 py-3.5">Requested Publication</th>
                    <th className="px-6 py-3.5">Request Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Approval Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {incomingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{req.requesterName}</div>
                        <div className="text-xs text-gray-400">{req.requesterEmail}</div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <Link 
                          to={`/publications/${req.publicationId}`} 
                          className="font-medium text-blue-600 hover:underline block truncate text-xs"
                        >
                          {req.publicationTitle}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                        {req.requestedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {req.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Approved
                          </span>
                        ) : req.status === 'Rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-500" />
                            Declined
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {req.status === 'Pending' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => approvePdfRequest(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                              title="Approve access"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectPdfRequest(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-bold cursor-pointer transition-colors"
                              title="Decline access"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        ) : req.status === 'Approved' ? (
                          <button
                            onClick={() => rejectPdfRequest(req.id)}
                            className="text-xs text-gray-400 hover:text-red-600 cursor-pointer underline"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <button
                            onClick={() => approvePdfRequest(req.id)}
                            className="text-xs text-gray-400 hover:text-emerald-600 cursor-pointer underline"
                          >
                            Re-approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPublications;
