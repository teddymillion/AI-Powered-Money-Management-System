import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:  { type: String, required: true },
    avatar:        { type: String, default: null },
    isVerified:    { type: Boolean, default: false },
    // OTP
    otp:           { type: String, default: null },
    otpExpiry:     { type: Date,   default: null },
    // Password reset
    resetToken:    { type: String, default: null },
    resetExpiry:   { type: Date,   default: null },
    // Notifications
    notifications: [{
      id:        { type: String },
      title:     { type: String },
      message:   { type: String },
      type:      { type: String, enum: ['info','success','warning','error'], default: 'info' },
      read:      { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
