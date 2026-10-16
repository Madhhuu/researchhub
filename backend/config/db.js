import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { User } from '../models/User.js';
import { Publication } from '../models/Publication.js';
import { Faculty } from '../models/Faculty.js';
import { PdfRequest } from '../models/PdfRequest.js';

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../data_store.json');

export let isMongoConnected = false;

// Initial seed data fallback
const initialData = {
  users: [
    {
      id: 'usr-1',
      name: 'Dr. Karthika',
      role: 'Research Admin',
      email: 'admin@researchhub.edu',
      initials: 'DK',
    },
    {
      id: 'usr-2',
      name: 'Dr. Priya',
      role: 'Faculty',
      email: 'faculty@researchhub.edu',
      initials: 'DP',
    }
  ],
  publications: [
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
    }
  ],
  faculty: [
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
      bio: 'Dr. Karthika leads the AI & Medical Imaging Research Group.'
    }
  ],
  pdfRequests: []
};

// Initialize file if not exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf8');
}

export const getDB = () => {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return initialData;
  }
};

export const saveDB = (db) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local database file:', err);
  }

  // Mirror updates into MongoDB in real time if connected
  if (isMongoConnected) {
    (async () => {
      try {
        if (db.users) {
          for (const u of db.users) {
            try { await User.updateOne({ id: u.id }, { $set: u }, { upsert: true }); } catch {}
          }
        }
        if (db.publications) {
          for (const p of db.publications) {
            try { await Publication.updateOne({ id: p.id }, { $set: p }, { upsert: true }); } catch {}
          }
        }
        if (db.faculty) {
          for (const f of db.faculty) {
            try { await Faculty.updateOne({ id: f.id }, { $set: f }, { upsert: true }); } catch {}
          }
        }
        if (db.pdfRequests) {
          for (const r of db.pdfRequests) {
            try { await PdfRequest.updateOne({ id: r.id }, { $set: r }, { upsert: true }); } catch {}
          }
        }
      } catch (e) {
        console.warn('MongoDB sync error:', e.message);
      }
    })();
  }
};

// Seed MongoDB from existing local data on connect
async function seedMongoFromLocal() {
  try {
    // Drop old strict unique index if it exists
    try { await Faculty.collection.dropIndex('email_1'); } catch {}
    try { await User.collection.dropIndex('email_1'); } catch {}

    const local = getDB();
    if (local.users && local.users.length > 0) {
      for (const u of local.users) {
        try { await User.updateOne({ id: u.id }, { $set: u }, { upsert: true }); } catch {}
      }
    }
    if (local.publications && local.publications.length > 0) {
      for (const p of local.publications) {
        try { await Publication.updateOne({ id: p.id }, { $set: p }, { upsert: true }); } catch {}
      }
    }
    if (local.faculty && local.faculty.length > 0) {
      for (const f of local.faculty) {
        try { await Faculty.updateOne({ id: f.id }, { $set: f }, { upsert: true }); } catch {}
      }
    }
    if (local.pdfRequests && local.pdfRequests.length > 0) {
      for (const r of local.pdfRequests) {
        try { await PdfRequest.updateOne({ id: r.id }, { $set: r }, { upsert: true }); } catch {}
      }
    }
    console.log('📦 Synchronized records into MongoDB collections: users, publications, faculties, pdfrequests.');
  } catch (err) {
    console.warn('Could not sync MongoDB collections:', err.message);
  }
}

// Connect to MongoDB with automatic fallback
export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researchhub';
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    isMongoConnected = true;
    console.log(`🍃 MongoDB Connected: ${MONGODB_URI}`);
    await seedMongoFromLocal();
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection skipped (${error.message}). Running with local JSON document store.`);
  }
};
