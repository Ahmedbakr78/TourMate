import mongoose from 'mongoose';

const { Schema } = mongoose;

// Aligned to Jamal's canonical Notification schema: senderId, receiverId,
// title, message, isRead. Ahmed-only `type` retained as an optional extra.
const notificationSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    // Ahmed-only extension.
    type: {
      type: String,
      enum: ['trip', 'system', 'review', 'lostItem', 'general'],
      default: 'general',
    },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
