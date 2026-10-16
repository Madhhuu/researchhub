import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Research Admin', 'Faculty'], default: 'Faculty' },
  email: { type: String, required: true },
  initials: { type: String, default: 'FA' },
  department: { type: String },
  title: { type: String },
  researchInterests: { type: String },
  password: { type: String, default: 'password123' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
