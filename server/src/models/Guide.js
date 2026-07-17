import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] },
  },
  { _id: false }
);

const guideSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    languages: [{ type: String }],
    specialties: [{ type: String }],
    bio: { type: String },
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    certificateUrls: [{ type: String }],
    currentLocation: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Guide = mongoose.model('Guide', guideSchema);
export default Guide;
