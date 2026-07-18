import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

// LostItem aligns with Jamal's module intent (reportedBy user ref, found flag).
const lostItemSchema = new Schema(
  {
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: locationSchema },
    found: { type: Boolean, default: false },
    foundBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;
