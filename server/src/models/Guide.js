import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

// Aligned to Jamal's canonical Guide schema: userId ref, Boolean availability,
// single `certificate` string, verificationStatus, experience.
const guideSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    languages: [{ type: String }],
    experience: { type: Number, default: 0 },
    // Jamal stores a single certificate string (Ahmed previously used certificateUrls[]).
    certificate: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    availability: { type: Boolean, default: true },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    // Ahmed-only extension.
    currentLocation: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Guide = mongoose.model('Guide', guideSchema);
export default Guide;
