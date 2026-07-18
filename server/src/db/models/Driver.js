import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

// Aligned to Jamal's canonical Driver schema: userId ref, Boolean availability,
// verificationStatus. Ahmed-only extras (vehicleIds, lastSeen) retained for his
// vehicle-linking and tracking logic.
const driverSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    // Jamal uses a Boolean availability flag.
    availability: { type: Boolean, default: true },
    currentLocation: { type: locationSchema, default: () => ({ type: 'Point', coordinates: [0, 0] }) },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    // Ahmed-only extensions (ignored by Jamal's API).
    vehicleIds: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    lastSeen: { type: Date, default: Date.now },
    nationalId: { type: String },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

driverSchema.index({ currentLocation: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
