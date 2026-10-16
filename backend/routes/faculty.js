import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

// GET all faculty members
router.get('/', (req, res) => {
  const db = getDB();
  res.json({ success: true, faculty: db.faculty });
});

// GET single faculty profile
router.get('/:id', (req, res) => {
  const db = getDB();
  const fac = db.faculty.find((f) => f.id === req.params.id || f.name.toLowerCase().includes(req.params.id.toLowerCase()));
  if (!fac) {
    return res.status(404).json({ error: 'Faculty profile not found' });
  }
  res.json({ success: true, faculty: fac });
});

export default router;
