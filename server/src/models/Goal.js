import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:     { type: String, required: true, trim: true },
    target:   { type: Number, required: true, min: 1 },
    current:  { type: Number, default: 0, min: 0 },
    icon:     { type: String, default: '🎯' },
    deadline: { type: Date, default: null },
    color:    { type: String, default: 'accent' },
  },
  { timestamps: true }
);

export const Goal = mongoose.model('Goal', goalSchema);
