import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String },
  department: { type: String, required: true },
  email: { type: String, required: true },
  initials: { type: String },
  totalPublications: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  hIndex: { type: Number, default: 0 },
  i10Index: { type: Number, default: 0 },
  researchInterests: [{ type: String }],
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);
