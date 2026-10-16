# ResearchHub - Institutional Research Repository & Analytics Platform

A complete full-stack academic research publication auditing, analytics, and repository system with **MongoDB** integration.

---

## 📁 Project Architecture & Folder Structure

```
s7/
├── backend/                  # Node.js & Express REST API Backend
│   ├── config/               # Database setup (db.js with Mongoose & MongoDB connection)
│   ├── middleware/           # File upload (Multer) & auth middleware
│   ├── models/               # Mongoose Schemas & Models (User, Publication, Faculty, PdfRequest)
│   ├── routes/               # API route handlers (auth, publications, faculty, pdfRequests)
│   ├── uploads/              # Storage directory for research paper PDFs
│   ├── utils/                # PDF generation and helper utilities
│   ├── data_store.json       # JSON data backup & document synchronization
│   ├── .env                  # MongoDB connection URI (mongodb://127.0.0.1:27017/researchhub)
│   ├── package.json          # Backend-specific package configuration
│   └── server.js             # Express server entry point (Port 5000)
│
├── frontend/                 # React + TypeScript + Vite Frontend
│   ├── public/               # Static assets & icons
│   ├── src/                  # React components, pages, contexts, and hooks
│   │   ├── components/       # UI, layout, and modal components
│   │   ├── context/          # AuthContext & PublicationContext
│   │   ├── data/             # Mock data benchmarks
│   │   ├── pages/            # Application views (Dashboard, Publications, Faculty, etc.)
│   │   ├── services/         # API integration client
│   │   └── types/            # TypeScript type definitions
│   ├── index.html            # Frontend HTML entry point
│   ├── package.json          # Frontend-specific package configuration
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite build & development configuration
│
├── dist/                     # Optimized production build artifacts
├── .env                      # Environment configuration
├── package.json              # Unified root scripts for easy single-command execution
└── README.md                 # Project documentation
```

---

## 🍃 MongoDB Database Integration

- **Database Engine**: MongoDB (via `mongoose`)
- **Connection URI**: `mongodb://127.0.0.1:27017/researchhub`
- **Mongoose Collections**:
  1. `users`: Authentication records, admin/faculty credentials, roles, and profiles.
  2. `publications`: Research papers, DOI, metadata, abstracts, claims verification status.
  3. `faculties`: Faculty directory profiles, h-index, citations, research domains.
  4. `pdfrequests`: PDF full-text access requests, approvals, and logs.

---

## 🚀 Quick Start Guide

### 1. Run the Entire Project (Backend + Frontend)
From the project root:
```bash
npm start
```
> The application will run at **http://localhost:5000** (connected to MongoDB).

### 2. Frontend Development Mode (Vite HMR)
```bash
npm run dev
```
> Starts Vite development server at **http://localhost:5173** with auto-proxy to the backend API.

### 3. Build Frontend
```bash
npm run build
```
> Compiles TypeScript and generates production assets into `dist/`.
