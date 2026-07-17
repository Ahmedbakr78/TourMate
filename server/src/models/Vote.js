import mongoose from 'mongoose';

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    voter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ trip: 1, voter: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
