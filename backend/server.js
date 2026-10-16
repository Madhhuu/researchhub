import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB, isMongoConnected } from './config/db.js';
import authRoutes from './routes/auth.js';
import publicationRoutes from './routes/publications.js';
import facultyRoutes from './routes/faculty.js';
import pdfRequestRoutes from './routes/pdfRequests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Locate static frontend build directory (checks root dist, frontend/dist, or local dist)
const distCandidates = [
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, 'dist')
];
const distPath = distCandidates.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) || path.join(__dirname, '../dist');

// Serve static frontend build files
app.use(express.static(distPath));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'JSON Document Database (Active)',
    timestamp: new Date().toISOString()
  });
});

// API index endpoint
app.get('/api', (req, res) => {
  const safeDbUri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researchhub').replace(/:([^:@]+)@/, ':****@');
  res.json({
    message: 'Welcome to ResearchHub Express Backend REST API',
    status: 'Running',
    database: isMongoConnected ? `MongoDB (Connected: ${safeDbUri})` : 'JSON Document Database (Active)',
    endpoints: {
      health: 'http://localhost:5000/api/health',
      publications: 'http://localhost:5000/api/publications',
      faculty: 'http://localhost:5000/api/faculty',
      pdfRequests: 'http://localhost:5000/api/pdf-requests',
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/pdf-requests', pdfRequestRoutes);

// SPA client-side routing fallback handler for Express 5
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please run npm run build.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ResearchHub Express Server running on http://localhost:${PORT}`);
});
