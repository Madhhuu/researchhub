import mongoose from 'mongoose';

const pdfRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  publicationId: { type: String, required: true },
  publicationTitle: { type: String, required: true },
  facultyName: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestedAt: { type: String, required: true },
  respondedAt: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const PdfRequest = mongoose.models.PdfRequest || mongoose.model('PdfRequest', pdfRequestSchema);
