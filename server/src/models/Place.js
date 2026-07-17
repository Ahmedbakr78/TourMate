import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] },
  },
  { _id: false }
);

const placeSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    location: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
    osmId: { type: String },
    source: { type: String, enum: ['overpass', 'manual'], default: 'overpass' },
    address: { type: String },
    tags: { type: Map, of: String },
  },
  { timestamps: true }
);

const Place = mongoose.model('Place', placeSchema);
export default Place;
