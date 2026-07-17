import mongoose from 'mongoose';

const { Schema } = mongoose;

const vehicleSchema = new Schema(
  {
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: {
      type: String,
      enum: ['sedan', 'suv', 'van', 'minibus', 'bus'],
      default: 'sedan',
    },
    model: { type: String },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
