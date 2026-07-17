import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] },
  },
  { _id: false }
);

const driverSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    nationalId: { type: String },
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    vehicleIds: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    currentLocation: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
    lastSeen: { type: Date, default: Date.now },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
