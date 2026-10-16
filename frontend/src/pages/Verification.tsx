import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Check, 
  X, 
  ShieldCheck
} from 'lucide-react';
import { usePublications } from '../context/PublicationContext';
import Button from '../components/common/Button';

const Verification: React.FC = () => {
  const { publications, verifyPublication, rejectPublication } = usePublications();

  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingList = publications.filter((pub) => pub.status === 'Pending');
  const verifiedList = publications.filter((pub) => pub.status === 'Verified');
  const rejectedList = publications.filter((pub) => pub.status === 'Rejected');

  const handleApprove = (id: string) => {
    verifyPublication(id);
  };

  const handleConfirmReject = () => {
    if (selectedRejectId) {
      rejectPublication(selectedRejectId, rejectReason || 'Metadata mismatch or missing full-text PDF.');
      setSelectedRejectId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Admin Audit Suite</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">Publication Verification Queue</h2>
          <p className="text-xs text-gray-500 mt-0.5">Approve or reject research claims submitted by faculty members.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            {pendingList.length} Pending Claims
          </span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Claims</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{pendingList.length}</h3>
          <p className="text-xs text-gray-400 mt-1">Requires admin review</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Records</span>
            <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{verifiedList.length}</h3>
          <p className="text-xs text-gray-400 mt-1">Approved & indexed</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rejected Submissions</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-3">{rejectedList.length}</h3>
          <p className="text-xs text-gray-400 mt-1">Information mismatch</p>
        </div>
      </div>

      {/* Rejection Reason Modal Dialog */}
      {selectedRejectId && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Reject Publication Claim</h3>
              <button onClick={() => setSelectedRejectId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Please enter the audit rejection reason so the faculty author can revise their submission.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. DOI metadata mismatch, or attached PDF is unreadable."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-900 outline-none focus:border-red-500 focus:bg-white"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedRejectId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReject}>
                Reject Submission
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Claims List */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Pending Review Submissions</h3>
          <p className="text-xs text-gray-500 mt-0.5">Approve or reject research claims submitted by faculty</p>
        </div>

        <div className="overflow-x-auto">
          {pendingList.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400 space-y-2">
              <ShieldCheck className="w-10 h-10 text-green-500 mx-auto" />
              <h4 className="text-sm font-bold text-gray-800">Verification Queue Clear</h4>
              <p>All faculty publication claims have been reviewed and verified.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Submission & Venue</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {pendingList.map((pub) => (
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{pub.facultyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-xs font-bold text-gray-600 bg-gray-100 rounded border border-gray-200/50">
                        {pub.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                      {pub.submissionDate || '2026-03-01'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{pub.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/publications/${pub.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg inline-flex"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleApprove(pub.id)}
                          className="px-2.5 py-1 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200/60 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedRejectId(pub.id)}
                          className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
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

export default Verification;
