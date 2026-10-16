import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Publication, FacultyMember, PdfRequest } from '../types';
import { initialPublications, mockFacultyList } from '../data/mockData';
import { api } from '../services/api';

interface PublicationContextType {
  publications: Publication[];
  facultyList: FacultyMember[];
  pdfRequests: PdfRequest[];
  addPublication: (newPub: Omit<Publication, 'id' | 'status'>, file?: File) => Promise<void>;
  addFacultyMember: (newFaculty: Omit<FacultyMember, 'id' | 'totalPublications' | 'citations' | 'hIndex' | 'i10Index'>) => Promise<void>;
  verifyPublication: (id: string) => Promise<void>;
  rejectPublication: (id: string, reason?: string) => Promise<void>;
  getPublicationById: (id: string) => Publication | undefined;
  getFacultyById: (id: string) => FacultyMember | undefined;
  requestPdf: (data: { publicationId: string; publicationTitle: string; facultyName: string; requesterName: string; requesterEmail: string }) => Promise<PdfRequest>;
  approvePdfRequest: (id: string) => Promise<void>;
  rejectPdfRequest: (id: string) => Promise<void>;
  refreshPdfRequests: () => Promise<void>;
}

const PublicationContext = createContext<PublicationContextType | undefined>(undefined);

export const PublicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(mockFacultyList);
  const [pdfRequests, setPdfRequests] = useState<PdfRequest[]>([]);

  const refreshPdfRequests = async () => {
    const list = await api.getPdfRequests();
    if (list) {
      setPdfRequests(list);
    }
  };

  useEffect(() => {
    // Attempt fetching live data from Express REST API
    const loadApiData = async () => {
      const serverPubs = await api.getPublications();
      if (serverPubs && serverPubs.length > 0) {
        setPublications(serverPubs);
      }
      const serverFaculty = await api.getFacultyList();
      if (serverFaculty && serverFaculty.length > 0) {
        setFacultyList(serverFaculty);
      }
      const serverRequests = await api.getPdfRequests();
      if (serverRequests) {
        setPdfRequests(serverRequests);
      }
    };
    loadApiData();
  }, []);

  const addPublication = async (newPubData: Omit<Publication, 'id' | 'status'>, file?: File) => {
    const apiResult = await api.addPublication(newPubData, file);

    const newPub: Publication = apiResult || {
      ...newPubData,
      id: `pub-${Date.now()}`,
      status: 'Pending',
      submissionDate: new Date().toISOString().split('T')[0],
      citationCount: 0,
      fileUrl: file ? file.name : 'submitted_paper.pdf',
    };

    setPublications((prev) => [newPub, ...prev]);
  };

  const addFacultyMember = async (newFacData: Omit<FacultyMember, 'id' | 'totalPublications' | 'citations' | 'hIndex' | 'i10Index'>) => {
    await api.register({
      name: newFacData.name,
      email: newFacData.email,
      department: newFacData.department,
      title: newFacData.title,
      researchInterests: newFacData.researchInterests.join(', '),
    });

    const newFac: FacultyMember = {
      ...newFacData,
      id: `fac-${Date.now()}`,
      totalPublications: 0,
      citations: 0,
      hIndex: 0,
      i10Index: 0,
    };
    setFacultyList((prev) => [newFac, ...prev]);
  };

  const verifyPublication = async (id: string) => {
    await api.verifyPublication(id);

    setPublications((prev) =>
      prev.map((pub) => (pub.id === id ? { ...pub, status: 'Verified' } : pub))
    );
  };

  const rejectPublication = async (id: string, reason?: string) => {
    await api.rejectPublication(id, reason);

    setPublications((prev) =>
      prev.map((pub) =>
        pub.id === id ? { ...pub, status: 'Rejected', rejectionReason: reason || 'Information mismatch' } : pub
      )
    );
  };

  const getPublicationById = (id: string) => {
    return publications.find((pub) => pub.id === id);
  };

  const getFacultyById = (id: string) => {
    return facultyList.find((fac) => fac.id === id || fac.name.toLowerCase().includes(id.toLowerCase()));
  };

  const requestPdf = async (reqData: {
    publicationId: string;
    publicationTitle: string;
    facultyName: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    try {
      const result = await api.createPdfRequest(reqData);
      if (result) {
        setPdfRequests((prev) => [result, ...prev.filter((r) => r.id !== result.id)]);
        return result;
      }
    } catch (e) {
      console.warn('API error creating PDF request, falling back to local state:', e);
    }
    const fallback: PdfRequest = {
      id: `req-${Date.now()}`,
      ...reqData,
      status: 'Pending',
      requestedAt: new Date().toISOString().split('T')[0],
      respondedAt: null,
    };
    setPdfRequests((prev) => [fallback, ...prev]);
    return fallback;
  };

  const approvePdfRequest = async (id: string) => {
    await api.approvePdfRequest(id);
    setPdfRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved', respondedAt: new Date().toISOString().split('T')[0] } : r))
    );
  };

  const rejectPdfRequest = async (id: string) => {
    await api.rejectPdfRequest(id);
    setPdfRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected', respondedAt: new Date().toISOString().split('T')[0] } : r))
    );
  };

  return (
    <PublicationContext.Provider
      value={{
        publications,
        facultyList,
        pdfRequests,
        addPublication,
        addFacultyMember,
        verifyPublication,
        rejectPublication,
        getPublicationById,
        getFacultyById,
        requestPdf,
        approvePdfRequest,
        rejectPdfRequest,
        refreshPdfRequests,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export const usePublications = () => {
  const context = useContext(PublicationContext);
  if (!context) {
    throw new Error('usePublications must be used within a PublicationProvider');
  }
  return context;
};
