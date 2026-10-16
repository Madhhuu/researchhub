import type { Publication, FacultyMember, PdfRequest } from '../types';

const API_BASE_URL = '/api';

export const api = {
  // Authentication APIs
  login: async (email: string, password?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  register: async (facultyData: {
    name: string;
    email: string;
    department?: string;
    title?: string;
    password?: string;
    researchInterests?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData),
      });
      if (!res.ok) throw new Error('Registration failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  // Publication Repository APIs
  getPublications: async (role?: string) => {
    try {
      const url = role ? `${API_BASE_URL}/publications?role=${encodeURIComponent(role)}` : `${API_BASE_URL}/publications`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch publications');
      const data = await res.json();
      return data.publications as Publication[];
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  addPublication: async (pubData: Partial<Publication>, file?: File) => {
    try {
      const formData = new FormData();
      Object.keys(pubData).forEach((key) => {
        if (pubData[key as keyof Publication] !== undefined) {
          formData.append(key, String(pubData[key as keyof Publication]));
        }
      });
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`${API_BASE_URL}/publications`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to add publication');
      const data = await res.json();
      return data.publication as Publication;
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  verifyPublication: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/publications/${id}/verify`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to verify publication');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  rejectPublication: async (id: string, reason?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/publications/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to reject publication');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  // Faculty Directory APIs
  getFacultyList: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/faculty`);
      if (!res.ok) throw new Error('Failed to fetch faculty list');
      const data = await res.json();
      return data.faculty as FacultyMember[];
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  // PDF Access Request APIs
  getPdfRequests: async (params?: { facultyName?: string; requesterEmail?: string; publicationId?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.facultyName) query.append('facultyName', params.facultyName);
      if (params?.requesterEmail) query.append('requesterEmail', params.requesterEmail);
      if (params?.publicationId) query.append('publicationId', params.publicationId);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE_URL}/pdf-requests${qs}`);
      if (!res.ok) throw new Error('Failed to fetch PDF requests');
      const data = await res.json();
      return data.pdfRequests as PdfRequest[];
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  createPdfRequest: async (requestData: {
    publicationId: string;
    publicationTitle: string;
    facultyName: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/pdf-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit PDF request');
      }
      const data = await res.json();
      return data.pdfRequest as PdfRequest;
    } catch (err) {
      console.warn('Backend API unreachable or request failed:', err);
      throw err;
    }
  },

  approvePdfRequest: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/pdf-requests/${id}/approve`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to approve PDF request');
      const data = await res.json();
      return data.pdfRequest as PdfRequest;
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  },

  rejectPdfRequest: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/pdf-requests/${id}/reject`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to reject PDF request');
      const data = await res.json();
      return data.pdfRequest as PdfRequest;
    } catch (err) {
      console.warn('Backend API unreachable, using local context state fallback:', err);
      return null;
    }
  }
};

