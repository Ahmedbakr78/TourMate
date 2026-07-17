import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    tourist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    startLocation: { type: locationSchema },
    endLocation: { type: locationSchema },
    routeGeoJSON: { type: Object },
    distanceMeters: { type: Number },
    durationSeconds: { type: Number },
    fare: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
    numberOfPassengers: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
