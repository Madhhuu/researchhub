import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDB, saveDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET all PDF requests (optionally filtered by facultyName, requesterEmail, or publicationId)
router.get('/', (req, res) => {
  const { facultyName, requesterEmail, publicationId } = req.query;
  const db = getDB();
  if (!db.pdfRequests) db.pdfRequests = [];

  let results = db.pdfRequests;
  if (publicationId) {
    results = results.filter((r) => r.publicationId === publicationId);
  }
  if (facultyName) {
    const cleanFaculty = facultyName.replace(/^Dr\.\s*/i, '').toLowerCase().trim();
    results = results.filter((r) => {
      const cleanR = r.facultyName.replace(/^Dr\.\s*/i, '').toLowerCase().trim();
      return cleanR.includes(cleanFaculty) || cleanFaculty.includes(cleanR);
    });
  }
  if (requesterEmail) {
    results = results.filter((r) => r.requesterEmail.toLowerCase() === requesterEmail.toLowerCase());
  }

  res.json({ success: true, pdfRequests: results });
});

// POST — submit a new PDF request
router.post('/', (req, res) => {
  const { publicationId, publicationTitle, facultyName, requesterName, requesterEmail } = req.body;
  if (!publicationId || !facultyName || !requesterEmail) {
    return res.status(400).json({ error: 'publicationId, facultyName and requesterEmail are required' });
  }

  const db = getDB();
  if (!db.pdfRequests) db.pdfRequests = [];

  // Prevent duplicate pending requests from the same user for the same paper
  const existing = db.pdfRequests.find(
    (r) => r.publicationId === publicationId && r.requesterEmail === requesterEmail && r.status === 'Pending'
  );
  if (existing) {
    return res.status(409).json({ error: 'You already have a pending request for this publication.' });
  }

  const newRequest = {
    id: `req-${Date.now()}`,
    publicationId,
    publicationTitle: publicationTitle || '',
    facultyName,
    requesterName: requesterName || 'Unknown',
    requesterEmail,
    status: 'Pending',
    requestedAt: new Date().toISOString().split('T')[0],
    respondedAt: null,
  };

  db.pdfRequests.unshift(newRequest);
  saveDB(db);

  res.status(201).json({ success: true, pdfRequest: newRequest });
});

// PATCH — faculty approves a request
router.patch('/:id/approve', (req, res) => {
  const db = getDB();
  if (!db.pdfRequests) db.pdfRequests = [];

  const request = db.pdfRequests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = 'Approved';
  request.respondedAt = new Date().toISOString().split('T')[0];
  saveDB(db);

  res.json({ success: true, pdfRequest: request });
});

// PATCH — faculty rejects a request
router.patch('/:id/reject', (req, res) => {
  const db = getDB();
  if (!db.pdfRequests) db.pdfRequests = [];

  const request = db.pdfRequests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = 'Rejected';
  request.respondedAt = new Date().toISOString().split('T')[0];
  saveDB(db);

  res.json({ success: true, pdfRequest: request });
});

export default router;
