import type { Publication, StatItem, NotificationItem, FacultyMember, ReportPreset } from '../types';

export const kpiStats: StatItem[] = [
  {
    id: 'total-publications',
    title: 'Total Publications',
    value: '1,842',
    change: '+18.4%',
    isPositive: true,
    supportingText: 'vs previous year',
    iconName: 'FileText',
  },
  {
    id: 'verified-publications',
    title: 'Verified Publications',
    value: '1,625',
    change: '+14.2%',
    isPositive: true,
    supportingText: 'vs previous year',
    iconName: 'CheckCircle',
  },
  {
    id: 'pending-verification',
    title: 'Pending Verification',
    value: '87',
    change: '12 new',
    isPositive: false,
    supportingText: 'this week',
    iconName: 'Clock',
  },
  {
    id: 'active-faculty',
    title: 'Active Faculty',
    value: '245',
    change: '+8.7%',
    isPositive: true,
    supportingText: 'vs previous year',
    iconName: 'Users',
  },
];

export const publicationTrendData = [
  { year: '2022', publications: 248 },
  { year: '2023', publications: 312 },
  { year: '2024', publications: 385 },
  { year: '2025', publications: 421 },
  { year: '2026', publications: 476 },
];

export const departmentPerformanceData = [
  { name: 'CSE', publications: 420 },
  { name: 'ECE', publications: 315 },
  { name: 'EEE', publications: 280 },
  { name: 'IT', publications: 265 },
  { name: 'Mechanical', publications: 210 },
  { name: 'Civil', publications: 175 },
];

export const publicationTypeData = [
  { name: 'Journal', value: 1013, percentage: 55 },
  { name: 'Conference', value: 553, percentage: 30 },
  { name: 'Book Chapter', value: 184, percentage: 10 },
  { name: 'Patent', value: 92, percentage: 5 },
];

export const researchAreaData = [
  { name: 'Artificial Intelligence', publications: 320 },
  { name: 'Machine Learning', publications: 285 },
  { name: 'Data Science', publications: 240 },
  { name: 'IoT', publications: 205 },
  { name: 'Cyber Security', publications: 180 },
  { name: 'Cloud Computing', publications: 160 },
].sort((a, b) => b.publications - a.publications);

export const initialPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Deep Learning Approaches for Smart Healthcare',
    facultyName: 'Dr. Karthika',
    facultyId: 'fac-1',
    department: 'CSE',
    year: 2026,
    type: 'Journal',
    status: 'Verified',
    journalOrConference: 'IEEE Transactions on Medical Imaging',
    doi: '10.1109/TMI.2026.3104928',
    citationCount: 42,
    publisher: 'IEEE',
    abstract: 'This paper presents a novel deep learning framework for predictive healthcare diagnostic systems using multi-modal patient sensor data, achieving superior accuracy in early cardiovascular disease classification.',
    submissionDate: '2026-01-14',
    fileUrl: 'deep_learning_smart_healthcare.pdf'
  },
  {
    id: 'pub-2',
    title: 'Secure IoT Framework for Smart Campus Infrastructure',
    facultyName: 'Dr. Arun Kumar',
    facultyId: 'fac-2',
    department: 'ECE',
    year: 2026,
    type: 'Conference',
    status: 'Verified',
    journalOrConference: 'ACM/IEEE IPSN Conference',
    doi: '10.1145/3587000.3587042',
    citationCount: 18,
    publisher: 'ACM',
    abstract: 'We propose a lightweight cryptographic key management protocol for edge-assisted IoT sensor deployments across university smart campuses.',
    submissionDate: '2026-02-02',
    fileUrl: 'secure_iot_smart_campus.pdf'
  },
  {
    id: 'pub-3',
    title: 'Machine Learning Based Precision Crop Yield Prediction',
    facultyName: 'Dr. Priya',
    facultyId: 'fac-3',
    department: 'IT',
    year: 2026,
    type: 'Journal',
    status: 'Pending',
    journalOrConference: 'Computers and Electronics in Agriculture',
    doi: '10.1016/j.compag.2026.108421',
    citationCount: 5,
    publisher: 'Elsevier',
    abstract: 'Integration of satellite imagery and localized soil moisture sensor data with ensemble gradient boosting trees for regional crop yield forecasting.',
    submissionDate: '2026-03-10',
    fileUrl: 'ml_crop_prediction.pdf'
  },
  {
    id: 'pub-4',
    title: 'Cloud-Based Research Data Management and FAIR Compliance',
    facultyName: 'Dr. Rajesh',
    facultyId: 'fac-4',
    department: 'CSE',
    year: 2025,
    type: 'Journal',
    status: 'Verified',
    journalOrConference: 'Journal of Grid Computing',
    doi: '10.1007/s10723-025-09681-x',
    citationCount: 65,
    publisher: 'Springer',
    abstract: 'Architectural evaluation of distributed cloud repositories enforcing Findable, Accessible, Interoperable, and Reusable (FAIR) data principles for academic institutions.',
    submissionDate: '2025-09-18',
    fileUrl: 'fair_cloud_data_management.pdf'
  },
  {
    id: 'pub-5',
    title: 'AI Assisted Medical Image Classification Using Vision Transformers',
    facultyName: 'Dr. Meena',
    facultyId: 'fac-5',
    department: 'CSE',
    year: 2025,
    type: 'Conference',
    status: 'Pending',
    journalOrConference: 'ICCV International Conference',
    doi: '10.1109/ICCV.2025.1092834',
    citationCount: 12,
    publisher: 'IEEE',
    abstract: 'Vision Transformers applied to high-resolution MRI scans enable zero-shot segmentation of tissue anomalies with reduced computational overhead.',
    submissionDate: '2025-11-20',
    fileUrl: 'ai_medical_image_classification.pdf'
  },
  {
    id: 'pub-6',
    title: '5G Next-Generation Beamforming Antennas for Dense Urban Deployments',
    facultyName: 'Dr. Suresh',
    facultyId: 'fac-6',
    department: 'ECE',
    year: 2025,
    type: 'Patent',
    status: 'Verified',
    journalOrConference: 'Indian Patent Office',
    doi: 'IN202541092831A',
    citationCount: 8,
    publisher: 'Intellectual Property India',
    abstract: 'Patented compact microstrip antenna array configuration providing dynamic beam-steering capabilities in mmWave frequency bands.',
    submissionDate: '2025-06-12',
    fileUrl: 'patent_5g_antenna.pdf'
  },
  {
    id: 'pub-7',
    title: 'Generative AI Systems in Higher Education: A Comprehensive Survey',
    facultyName: 'Dr. Karthika',
    facultyId: 'fac-1',
    department: 'CSE',
    year: 2025,
    type: 'Book Chapter',
    status: 'Verified',
    journalOrConference: 'Handbook of Educational Technology Innovations',
    doi: '10.1007/978-3-031-48210-9_14',
    citationCount: 89,
    publisher: 'Springer',
    abstract: 'Comprehensive study surveying the deployment, ethical considerations, and assessment impacts of LLMs across university curricula.',
    submissionDate: '2025-04-15',
    fileUrl: 'genai_higher_education.pdf'
  },
  {
    id: 'pub-8',
    title: 'Zero-Trust Cybersecurity Architecture for Industrial Control Systems',
    facultyName: 'Dr. Priya',
    facultyId: 'fac-3',
    department: 'IT',
    year: 2025,
    type: 'Journal',
    status: 'Pending',
    journalOrConference: 'IEEE Transactions on Industrial Informatics',
    doi: '10.1109/TII.2025.3210984',
    citationCount: 15,
    publisher: 'IEEE',
    abstract: 'Continuous identity verification mechanism utilizing micro-segmentation for SCADA networks in smart grid infrastructure.',
    submissionDate: '2025-12-05',
    fileUrl: 'zero_trust_scada.pdf'
  }
];

export const recentPublications: Publication[] = initialPublications;

export const mockFacultyList: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Karthika',
    title: 'Professor & Head of Research',
    department: 'CSE',
    email: 'karthika@university.edu',
    initials: 'DK',
    totalPublications: 48,
    citations: 1420,
    hIndex: 22,
    i10Index: 35,
    researchInterests: ['Artificial Intelligence', 'Deep Learning', 'Healthcare Informatics', 'Generative Models'],
    bio: 'Dr. Karthika leads the AI & Medical Imaging Research Group. She has published over 40 journal papers in IEEE and Springer journals and serves as an Associate Editor for Healthcare Systems.'
  },
  {
    id: 'fac-2',
    name: 'Dr. Arun Kumar',
    title: 'Associate Professor',
    department: 'ECE',
    email: 'arunkumar@university.edu',
    initials: 'AK',
    totalPublications: 32,
    citations: 890,
    hIndex: 17,
    i10Index: 24,
    researchInterests: ['IoT', 'Embedded Systems', 'Sensor Networks', 'Wireless Security'],
    bio: 'Dr. Arun Kumar specializes in smart sensors and wireless mesh communication networks with a focus on campus micro-grid automation.'
  },
  {
    id: 'fac-3',
    name: 'Dr. Priya',
    title: 'Associate Professor',
    department: 'IT',
    email: 'priya@university.edu',
    initials: 'DP',
    totalPublications: 29,
    citations: 640,
    hIndex: 14,
    i10Index: 19,
    researchInterests: ['Machine Learning', 'Agri-Tech', 'Cyber Security', 'Data Science'],
    bio: 'Dr. Priya conducts interdisciplinary research combining machine learning algorithms with agricultural IoT sensors and predictive analytics.'
  },
  {
    id: 'fac-4',
    name: 'Dr. Rajesh',
    title: 'Professor',
    department: 'CSE',
    email: 'rajesh@university.edu',
    initials: 'DR',
    totalPublications: 54,
    citations: 2150,
    hIndex: 28,
    i10Index: 45,
    researchInterests: ['Cloud Computing', 'Big Data Architecture', 'Distributed Systems'],
    bio: 'Dr. Rajesh directs the High-Performance Computing Laboratory and consults on large-scale FAIR repository infrastructures for national databases.'
  },
  {
    id: 'fac-5',
    name: 'Dr. Meena',
    title: 'Assistant Professor',
    department: 'CSE',
    email: 'meena@university.edu',
    initials: 'DM',
    totalPublications: 18,
    citations: 380,
    hIndex: 11,
    i10Index: 14,
    researchInterests: ['Computer Vision', 'Vision Transformers', 'Medical Image Segmentation'],
    bio: 'Dr. Meena focuses on applying attention-based neural architectures to MRI and CT scan diagnostics.'
  },
  {
    id: 'fac-6',
    name: 'Dr. Suresh',
    title: 'Professor',
    department: 'ECE',
    email: 'suresh@university.edu',
    initials: 'DS',
    totalPublications: 41,
    citations: 1180,
    hIndex: 20,
    i10Index: 31,
    researchInterests: ['5G Antennas', 'RF Engineering', 'mmWave Communication', 'Smart Grids'],
    bio: 'Dr. Suresh holds 4 granted patents in microstrip antenna beamforming arrays for next-generation telecommunications.'
  }
];

export const mockReportPresets: ReportPreset[] = [
  {
    id: 'rep-1',
    title: 'NAAC Accreditation Research Summary (Criteria 3)',
    description: 'Comprehensive compilation of journal publications, conference proceedings, patents, and citation metrics formatted for NAAC accreditation submission.',
    category: 'Accreditation',
    formatOptions: ['PDF Document', 'Excel Data Sheet (XLSX)'],
    lastGenerated: '2026-02-15'
  },
  {
    id: 'rep-2',
    title: 'NIRF Ranking Data Output File',
    description: 'Standardized publication count, Scopus/Web of Science indexed papers, and h-index benchmarks required for NIRF engineering category.',
    category: 'Accreditation',
    formatOptions: ['PDF Document', 'CSV Export'],
    lastGenerated: '2026-01-30'
  },
  {
    id: 'rep-3',
    title: 'Annual Departmental Research Performance Audit',
    description: 'Comparative publication volume, verified claims, and citation breakdown categorized by academic department.',
    category: 'Departmental',
    formatOptions: ['PDF Document', 'Interactive Dashboard PDF'],
    lastGenerated: '2026-03-01'
  },
  {
    id: 'rep-4',
    title: 'Faculty Productivity & Citation Impact Index',
    description: 'Individual faculty publication logs, h-index ranking, and co-authorship collaboration statistics.',
    category: 'Faculty',
    formatOptions: ['PDF Document', 'Excel Sheet'],
    lastGenerated: '2026-03-12'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    text: '3 publications awaiting verification',
    time: '10m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    text: 'New faculty profile added',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'notif-3',
    text: 'Annual research report is ready',
    time: '1d ago',
    unread: false,
  },
];
