import mongoose from 'mongoose';

const { Schema } = mongoose;

// Aligned to Jamal's canonical Review schema: tripId, touristId, driverId,
// guideId, placeId, rating, comment.
const reviewSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    guideId: { type: Schema.Types.ObjectId, ref: 'Guide' },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
