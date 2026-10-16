import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Quote, 
  User, 
  Building2, 
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  FileCheck,
  Mail,
  Check,
  X
} from 'lucide-react';
import { usePublications } from '../context/PublicationContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';

const PublicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getPublicationById, pdfRequests, requestPdf, approvePdfRequest, rejectPdfRequest } = usePublications();
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestNotice, setRequestNotice] = useState<string | null>(null);

  const publication = id ? getPublicationById(id) : undefined;

  if (!publication) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center font-sans">
        <div className="bg-white border border-gray-200/80 rounded-xl p-12 shadow-2xs">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Publication Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            The requested publication record could not be found or has been moved.
          </p>
          <Link to="/publications">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Publications Repository
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user is author of this publication
  const cleanUserName = (user?.name || '').replace(/^Dr\.\s*/i, '').toLowerCase().trim();
  const cleanFacultyName = (publication.facultyName || '').replace(/^Dr\.\s*/i, '').toLowerCase().trim();
  const isAuthor = cleanUserName && (cleanFacultyName.includes(cleanUserName) || cleanUserName.includes(cleanFacultyName));

  // Filter all requests for this specific paper (for author/admin review)
  const paperRequests = pdfRequests.filter((r) => r.publicationId === publication.id);

  // Find user's PDF request for this publication
  const userEmail = (user?.email || 'researcher@university.edu').toLowerCase();
  const existingRequest = pdfRequests.find(
    (r) =>
      r.publicationId === publication.id &&
      (r.requesterEmail.toLowerCase() === userEmail ||
        (cleanUserName && r.requesterName.toLowerCase().includes(cleanUserName)))
  );

  const handleRequestPdf = async () => {
    setSubmittingRequest(true);
    setRequestNotice(null);
    try {
      await requestPdf({
        publicationId: publication.id,
        publicationTitle: publication.title,
        facultyName: publication.facultyName,
        requesterName: user?.name || 'Academic Researcher',
        requesterEmail: user?.email || 'researcher@university.edu',
      });
      setRequestNotice(`Access request successfully sent to ${publication.facultyName}. You will be able to download once approved.`);
    } catch (err: any) {
      setRequestNotice(err?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };



  const apaCitation = `${publication.facultyName} (${publication.year}). "${publication.title}". ${publication.journalOrConference || 'University Repository'}. ${publication.doi ? `https://doi.org/${publication.doi}` : ''}`;

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div>
        <Link 
          to="/publications" 
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Publications Repository
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
              {publication.type}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-md border border-gray-200">
              {publication.department}
            </span>
          </div>
          <StatusBadge status={publication.status} />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {publication.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
            <div className="flex items-center gap-1.5 font-medium text-gray-800">
              <User className="w-4 h-4 text-blue-600" />
              <span>{publication.facultyName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>Department of {publication.department}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Year: <strong className="text-gray-700">{publication.year}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Toolbar & PDF Request Flow */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {/* Author Mode */}
          {isAuthor ? (
            <div className="flex items-center gap-2">
              <a 
                href={`/api/publications/${publication.id}/download`}
                download={`${(publication.title || 'Research_Paper').slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '_')}_AuthorCopy.pdf`}
                className="inline-block"
              >
                <Button variant="primary" size="sm" className="cursor-pointer">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF (Author Copy)
                </Button>
              </a>
              <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-medium">
                You are the author of this work
              </span>
            </div>
          ) : existingRequest?.status === 'Approved' ? (
            /* Approved Request -> Can Download */
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href={`/api/publications/${publication.id}/download`}
                download={`${(publication.title || 'Research_Paper').slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, '_')}_ResearchHub.pdf`}
                className="inline-block"
              >
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </Button>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Request Approved by {publication.facultyName}
              </span>
            </div>
          ) : existingRequest?.status === 'Pending' ? (
            /* Pending Approval */
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>PDF Requested — Awaiting Approval from {publication.facultyName}</span>
              </div>
            </div>
          ) : existingRequest?.status === 'Rejected' ? (
            /* Declined Request */
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-md border border-red-200 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Request Declined by Faculty
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleRequestPdf}
                disabled={submittingRequest}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {submittingRequest ? 'Submitting...' : 'Request Again'}
              </Button>
            </div>
          ) : (
            /* No Request Yet -> Request PDF Button */
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleRequestPdf}
                disabled={submittingRequest}
                className="cursor-pointer"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {submittingRequest ? 'Sending Request...' : 'Request PDF from Faculty'}
              </Button>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/70">
                <Lock className="w-3 h-3 text-gray-400" />
                Requires author authorization
              </span>
            </div>
          )}

          {publication.doi && (
            <a 
              href={`https://doi.org/${publication.doi}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                DOI Link
              </Button>
            </a>
          )}
        </div>

        {/* Informational Request Notice Banner */}
        {requestNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{requestNotice}</span>
            </div>
            <button 
              onClick={() => setRequestNotice(null)} 
              className="text-blue-500 hover:text-blue-800 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Existing Pending Request helper hint */}
        {!isAuthor && existingRequest?.status === 'Pending' && !requestNotice && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Your request was submitted on <strong>{existingRequest.requestedAt}</strong>. Once <strong>{publication.facultyName}</strong> approves, the <strong>Download PDF</strong> button will be unlocked for you here.
            </span>
          </div>
        )}

        {/* Author Review Panel: Visible when the logged in author views their own publication */}
        {isAuthor && paperRequests.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Access Requests for this Paper ({paperRequests.length})
              </span>
              <span className="text-[11px] text-gray-500">
                You can approve or decline reader requests directly here
              </span>
            </div>

            <div className="space-y-2">
              {paperRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50/80 rounded-lg border border-gray-200/70 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-900">{req.requesterName}</span>
                    <span className="text-gray-500 ml-2 font-mono text-[11px]">({req.requesterEmail})</span>
                    <span className="text-gray-400 ml-3 text-[11px]">Requested on {req.requestedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => approvePdfRequest(req.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Access
                        </button>
                        <button
                          onClick={() => rejectPdfRequest(req.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-md font-bold cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </>
                    ) : req.status === 'Approved' ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                          <Check className="w-3 h-3 text-green-600" />
                          Approved
                        </span>
                        <button
                          onClick={() => rejectPdfRequest(req.id)}
                          className="text-gray-400 hover:text-red-600 text-[11px] underline cursor-pointer ml-1"
                        >
                          Revoke
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          <X className="w-3 h-3 text-red-600" />
                          Declined
                        </span>
                        <button
                          onClick={() => approvePdfRequest(req.id)}
                          className="text-gray-400 hover:text-emerald-600 text-[11px] underline cursor-pointer ml-1"
                        >
                          Re-approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout for Metadata & Abstract */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Abstract & APA Citation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abstract */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Abstract</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {publication.abstract || 'No abstract text available for this registered record.'}
            </p>
          </div>

          {/* Citation Format */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Quote className="w-4 h-4 text-blue-600" />
                APA Citation Format
              </h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(apaCitation);
                  alert('Citation copied to clipboard!');
                }}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Copy Citation
              </button>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-lg text-xs font-mono text-gray-700 leading-relaxed">
              {apaCitation}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="space-y-6">
          {/* Key Identifiers */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Publication Identifiers</h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Journal / Venue</span>
                <span className="font-semibold text-gray-800 block mt-0.5">{publication.journalOrConference || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Publisher</span>
                <span className="font-semibold text-gray-800 block mt-0.5">{publication.publisher || 'Institutional Repository'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Digital Object Identifier (DOI)</span>
                <span className="font-mono text-gray-800 block mt-0.5">{publication.doi || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Total Citations</span>
                <span className="font-bold text-blue-600 block mt-0.5 text-base">{publication.citationCount || 0}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Submission Date</span>
                <span className="text-gray-700 block mt-0.5">{publication.submissionDate || '2026-01-01'}</span>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Audit</h3>
            <div className="p-3 rounded-lg border bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">Status</span>
                <StatusBadge status={publication.status} />
              </div>
              {publication.status === 'Verified' ? (
                <p className="text-[11px] text-green-700 bg-green-50 p-2 rounded border border-green-200/60 leading-normal">
                  Verified by Research Office on {publication.submissionDate || '2026-01-15'}. Metadata matches DOI record.
                </p>
              ) : publication.status === 'Pending' ? (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200/60 leading-normal">
                  Awaiting review in the Research Office verification queue.
                </p>
              ) : (
                <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded border border-red-200/60 leading-normal">
                  Reason: {publication.rejectionReason || 'Information mismatch in submission.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetails;
