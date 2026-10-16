export interface Publication {
  id: string;
  title: string;
  facultyName: string;
  facultyId?: string;
  department: string;
  year: number;
  type: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent';
  status: 'Verified' | 'Pending' | 'Rejected';
  journalOrConference?: string;
  doi?: string;
  citationCount?: number;
  publisher?: string;
  abstract?: string;
  submissionDate?: string;
  fileUrl?: string;
  rejectionReason?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  initials: string;
  totalPublications: number;
  citations: number;
  hIndex: number;
  i10Index: number;
  researchInterests: string[];
  bio: string;
}

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  supportingText: string;
  iconName: string;
}

export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  link?: string;
}

export interface ReportPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  formatOptions: string[];
  lastGenerated: string;
}

export interface PdfRequest {
  id: string;
  publicationId: string;
  publicationTitle: string;
  facultyName: string;
  requesterName: string;
  requesterEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  respondedAt?: string | null;
}

