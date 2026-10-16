import express from 'express';
import { getDB, saveDB } from '../config/db.js';

const router = express.Router();

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = getDB();

  // Admin login check
  if (email.toLowerCase().includes('admin@')) {
    const adminUser = {
      name: 'Dr. Karthika',
      role: 'Research Admin',
      email: email,
      initials: 'DK',
    };
    return res.json({ success: true, user: adminUser });
  }

  // Check existing user or faculty list
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const matchedFaculty = db.faculty.find((f) => f.email.toLowerCase() === email.toLowerCase());
    const formattedName = email.split('@')[0].split('.').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const facultyName = matchedFaculty ? matchedFaculty.name : (formattedName.startsWith('Dr.') ? formattedName : `Dr. ${formattedName}`);
    const initials = matchedFaculty
      ? matchedFaculty.initials
      : facultyName.replace('Dr. ', '').split(' ').map((s) => s[0]).join('').toUpperCase().substring(0, 2);

    user = {
      id: `usr-${Date.now()}`,
      name: facultyName,
      role: 'Faculty',
      email: email,
      initials: initials || 'FM',
    };
    db.users.push(user);
    saveDB(db);
  }

  return res.json({ success: true, user });
});

// Register Faculty Route
router.post('/register', (req, res) => {
  const { name, email, department, title, password, researchInterests } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const db = getDB();

  const formattedName = name.startsWith('Dr.') ? name : `Dr. ${name}`;
  const nameParts = formattedName.replace(/Dr\./g, '').trim().split(' ');
  const initials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : nameParts[0].substring(0, 2).toUpperCase();

  const newUser = {
    id: `usr-${Date.now()}`,
    name: formattedName,
    role: 'Faculty',
    email: email,
    initials,
  };

  const interestsArray = Array.isArray(researchInterests)
    ? researchInterests
    : (researchInterests ? researchInterests.split(',').map((s) => s.trim()) : ['Research']);

  const newFaculty = {
    id: `fac-${Date.now()}`,
    name: formattedName,
    title: title || 'Assistant Professor',
    department: department || 'CSE',
    email: email,
    initials,
    totalPublications: 0,
    citations: 0,
    hIndex: 0,
    i10Index: 0,
    researchInterests: interestsArray,
    bio: `${title || 'Assistant Professor'} in the Department of ${department || 'CSE'}.`,
  };

  db.users.push(newUser);
  db.faculty.push(newFaculty);
  saveDB(db);

  return res.status(201).json({ success: true, user: newUser });
});

export default router;
