import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

// Aligned to Jamal's canonical Place schema: osmId (Number, unique), city,
// category, description, coordinates (Point).
const placeSchema = new Schema(
  {
    osmId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coordinates: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
  },
  { timestamps: true }
);

placeSchema.index({ coordinates: '2dsphere' });

const Place = mongoose.model('Place', placeSchema);
export default Place;
