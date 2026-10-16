import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import upload from '../middleware/upload.js';
import { getDB, saveDB } from '../config/db.js';
import { generateResearchPaperPdf, ensureUploadsExist } from '../utils/pdfGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Initialize seeded PDFs
try {
  const initialDb = getDB();
  if (initialDb?.publications) {
    ensureUploadsExist(initialDb.publications);
  }
} catch (e) {
  console.warn('Could not pre-generate PDFs:', e);
}

// GET all publications (filtered by role if Faculty)
router.get('/', (req, res) => {
  const { role, facultyName } = req.query;
  const db = getDB();

  let results = db.publications;

  if (role === 'Faculty') {
    // Strictly Verified papers only
    results = results.filter((p) => p.status === 'Verified');
  }

  res.json({ success: true, publications: results });
});

// GET /:id/download — Download research paper PDF directly
router.get('/:id/download', (req, res) => {
  const db = getDB();
  const pub = db.publications.find((p) => p.id === req.params.id);
  if (!pub) {
    return res.status(404).json({ error: 'Publication not found' });
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = pub.fileUrl || `${pub.id}.pdf`;
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 100) {
    const pdfBuffer = generateResearchPaperPdf(pub);
    fs.writeFileSync(filePath, pdfBuffer);
  }

  const safeTitle = (pub.title || 'Research_Paper').slice(0, 45).replace(/[^a-zA-Z0-9_-]/g, '_');
  const downloadName = `${safeTitle}_ResearchHub.pdf`;

  res.download(filePath, downloadName, (err) => {
    if (err) {
      console.error('File download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    }
  });
});

// GET single publication
router.get('/:id', (req, res) => {
  const db = getDB();
  const pub = db.publications.find((p) => p.id === req.params.id);
  if (!pub) {
    return res.status(404).json({ error: 'Publication not found' });
  }
  res.json({ success: true, publication: pub });
});

// POST new publication with Multer file upload
router.post('/', upload.single('file'), (req, res) => {
  const db = getDB();
  const { title, facultyName, department, year, type, journalOrConference, doi, publisher, abstract } = req.body;

  if (!title || !facultyName) {
    return res.status(400).json({ error: 'Title and Faculty Name are required' });
  }

  let fileUrl = 'submitted_research_paper.pdf';
  if (req.file) {
    fileUrl = req.file.filename;
  }

  const newPub = {
    id: `pub-${Date.now()}`,
    title,
    facultyName,
    department: department || 'CSE',
    year: parseInt(year) || 2026,
    type: type || 'Journal',
    status: 'Pending',
    journalOrConference: journalOrConference || '',
    doi: doi || '',
    publisher: publisher || 'Academic Press',
    abstract: abstract || '',
    submissionDate: new Date().toISOString().split('T')[0],
    citationCount: 0,
    fileUrl,
  };

  db.publications.unshift(newPub);
  saveDB(db);

  res.status(201).json({ success: true, publication: newPub });
});

// PATCH verify publication (Admin action)
router.patch('/:id/verify', (req, res) => {
  const db = getDB();
  const pub = db.publications.find((p) => p.id === req.params.id);
  if (!pub) {
    return res.status(404).json({ error: 'Publication not found' });
  }

  pub.status = 'Verified';
  saveDB(db);

  res.json({ success: true, publication: pub });
});

// PATCH reject publication (Admin action)
router.patch('/:id/reject', (req, res) => {
  const { reason } = req.body;
  const db = getDB();
  const pub = db.publications.find((p) => p.id === req.params.id);
  if (!pub) {
    return res.status(404).json({ error: 'Publication not found' });
  }

  pub.status = 'Rejected';
  pub.rejectionReason = reason || 'Information mismatch or missing proof document.';
  saveDB(db);

  res.json({ success: true, publication: pub });
});

export default router;
