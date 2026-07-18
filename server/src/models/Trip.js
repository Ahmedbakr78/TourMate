import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

// Aligned to Jamal's canonical Trip schema (reference field names + uppercase
// status enum). Ahmed-only geo/route fields retained as optional extras used by
// his OSRM + polling tracking features.
const tripSchema = new Schema(
  {
    touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    guideId: { type: Schema.Types.ObjectId, ref: 'Guide' },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    peopleCount: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
    },
    // Ahmed-only extensions (OSRM route + tracking context).
    startLocation: { type: locationSchema },
    endLocation: { type: locationSchema },
    routeGeoJSON: { type: Object },
    distanceMeters: { type: Number },
    durationSeconds: { type: Number },
    fare: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  { timestamps: true }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
