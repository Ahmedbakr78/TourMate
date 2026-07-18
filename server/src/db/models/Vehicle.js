import mongoose from 'mongoose';

const { Schema } = mongoose;

// Aligned to Jamal's canonical Vehicle schema: driverId ref, brand,
// vehicleModel, capacity, plateNumber, carImages[{secure_url, public_id}].
const vehicleSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    brand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    plateNumber: { type: String, required: true, unique: true, trim: true },
    carImages: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    // Ahmed-only extension.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
