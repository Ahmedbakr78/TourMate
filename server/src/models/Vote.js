import mongoose from 'mongoose';

const { Schema } = mongoose;

// Aligned to Jamal's canonical Vote schema: tripId, placeId, userId, voteValue.
const voteSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voteValue: { type: String, enum: ['UP', 'DOWN'], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ tripId: 1, placeId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
