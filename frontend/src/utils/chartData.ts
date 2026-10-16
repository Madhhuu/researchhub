export interface PublicationTrendPoint {
  year: string;
  publications: number;
  isCurrent?: boolean;
}

export interface DepartmentPerformancePoint {
  name: string;
  publications: number;
  isSelected?: boolean;
}

export interface PublicationTypePoint {
  name: string;
  value: number;
  percentage: number;
}

export interface ResearchAreaPoint {
  name: string;
  publications: number;
}

export const parseYearKey = (yearStr?: string): string => {
  if (!yearStr || yearStr === 'All' || yearStr === 'All Years') return 'All';
  if (yearStr.includes('2026')) return '2026';
  if (yearStr.includes('2025')) return '2025';
  if (yearStr.includes('2024')) return '2024';
  if (yearStr.includes('2023')) return '2023';
  if (yearStr.includes('2022')) return '2022';
  return 'All';
};

// Department multipliers relative to total
const deptMultipliers: Record<string, number> = {
  All: 1.0,
  CSE: 0.35,
  ECE: 0.25,
  EEE: 0.20,
  IT: 0.15,
  Mechanical: 0.10,
  Civil: 0.08,
};

export const getDynamicPublicationTrendData = (
  selectedYear?: string,
  selectedDept?: string
): PublicationTrendPoint[] => {
  const base = [
    { year: '2022', publications: 248 },
    { year: '2023', publications: 312 },
    { year: '2024', publications: 385 },
    { year: '2025', publications: 421 },
    { year: '2026', publications: 476 },
  ];

  const deptKey = selectedDept || 'All';
  const mult = deptMultipliers[deptKey] || 1.0;
  const activeYr = parseYearKey(selectedYear);

  return base.map((item) => {
    const val = Math.round(item.publications * mult);
    return {
      year: item.year,
      publications: val,
      isCurrent: activeYr !== 'All' ? item.year === activeYr : item.year === '2026',
    };
  });
};

export const getDynamicDepartmentData = (
  selectedYear?: string,
  selectedDept?: string
): DepartmentPerformancePoint[] => {
  const yrKey = parseYearKey(selectedYear);

  const yearDepartmentMap: Record<string, Record<string, number>> = {
    All: { CSE: 420, ECE: 315, EEE: 280, IT: 265, Mechanical: 210, Civil: 175 },
    '2026': { CSE: 165, ECE: 108, EEE: 86, IT: 72, Mechanical: 30, Civil: 15 },
    '2025': { CSE: 140, ECE: 95, EEE: 78, IT: 65, Mechanical: 28, Civil: 15 },
    '2024': { CSE: 122, ECE: 85, EEE: 70, IT: 58, Mechanical: 32, Civil: 18 },
    '2023': { CSE: 98, ECE: 68, EEE: 56, IT: 48, Mechanical: 26, Civil: 16 },
    '2022': { CSE: 75, ECE: 52, EEE: 45, IT: 38, Mechanical: 22, Civil: 16 },
  };

  const currentMap = yearDepartmentMap[yrKey] || yearDepartmentMap['All'];
  const activeDept = selectedDept && selectedDept !== 'All' ? selectedDept : null;

  return Object.entries(currentMap).map(([name, publications]) => ({
    name,
    publications,
    isSelected: activeDept ? name === activeDept : true,
  }));
};

export const getDynamicPublicationTypeData = (
  selectedYear?: string,
  selectedDept?: string
): { data: PublicationTypePoint[]; total: number } => {
  const yrKey = parseYearKey(selectedYear);
  const deptKey = selectedDept || 'All';
  const mult = deptMultipliers[deptKey] || 1.0;

  const totalMap: Record<string, number> = {
    All: 1842,
    '2026': 476,
    '2025': 421,
    '2024': 385,
    '2023': 312,
    '2022': 248,
  };

  const baseTotal = Math.round((totalMap[yrKey] || 1842) * mult);

  const jVal = Math.round(baseTotal * 0.55);
  const cVal = Math.round(baseTotal * 0.30);
  const bVal = Math.round(baseTotal * 0.10);
  const pVal = Math.max(1, baseTotal - jVal - cVal - bVal);

  return {
    total: baseTotal,
    data: [
      { name: 'Journal', value: jVal, percentage: 55 },
      { name: 'Conference', value: cVal, percentage: 30 },
      { name: 'Book Chapter', value: bVal, percentage: 10 },
      { name: 'Patent', value: pVal, percentage: 5 },
    ],
  };
};

export const getDynamicResearchAreaData = (
  selectedYear?: string,
  selectedDept?: string
): ResearchAreaPoint[] => {
  const yrKey = parseYearKey(selectedYear);
  const deptKey = selectedDept || 'All';
  const mult = deptMultipliers[deptKey] || 1.0;

  const scaleMap: Record<string, number> = {
    All: 1.0,
    '2026': 0.26,
    '2025': 0.23,
    '2024': 0.20,
    '2023': 0.17,
    '2022': 0.14,
  };

  const scale = (scaleMap[yrKey] || 1.0) * mult;

  const baseAreas = [
    { name: 'Artificial Intelligence', publications: 320 },
    { name: 'Machine Learning', publications: 285 },
    { name: 'Data Science', publications: 240 },
    { name: 'IoT', publications: 205 },
    { name: 'Cyber Security', publications: 180 },
    { name: 'Cloud Computing', publications: 160 },
  ];

  return baseAreas
    .map((item) => ({
      name: item.name,
      publications: Math.round(item.publications * scale),
    }))
    .sort((a, b) => b.publications - a.publications);
};

export const getDynamicKpis = (selectedYear?: string, selectedDept?: string) => {
  const yrKey = parseYearKey(selectedYear);
  const deptKey = selectedDept || 'All';
  const mult = deptMultipliers[deptKey] || 1.0;

  const citationsMap: Record<string, number> = {
    All: 6840,
    '2026': 1820,
    '2025': 1650,
    '2024': 1410,
    '2023': 1120,
    '2022': 840,
  };

  const publicationsMap: Record<string, number> = {
    All: 1842,
    '2026': 476,
    '2025': 421,
    '2024': 385,
    '2023': 312,
    '2022': 248,
  };

  const totalCitations = Math.round((citationsMap[yrKey] || 6840) * mult);
  const totalPubs = Math.round((publicationsMap[yrKey] || 1842) * mult);
  const verifiedPubs = Math.round(totalPubs * 0.88);
  const pendingPubs = Math.max(2, Math.round(totalPubs * 0.05));

  return {
    totalCitations,
    totalPubs,
    verifiedPubs,
    pendingPubs,
    avgHIndex: (19.4 * (mult < 1 ? 0.85 : 1)).toFixed(1),
    scopusPercent: '88.5%',
    internationalPercent: '34.2%',
  };
};
