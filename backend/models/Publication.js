import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  facultyName: { type: String, required: true },
  facultyId: { type: String },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['Journal', 'Conference', 'Book Chapter', 'Patent'], required: true },
  status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  journalOrConference: { type: String },
  doi: { type: String },
  citationCount: { type: Number, default: 0 },
  publisher: { type: String },
  abstract: { type: String },
  submissionDate: { type: String },
  fileUrl: { type: String },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Publication = mongoose.models.Publication || mongoose.model('Publication', publicationSchema);
