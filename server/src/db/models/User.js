import mongoose from 'mongoose';

const { Schema } = mongoose;

// Aligned to Jamal's canonical User schema (backend_node.js) so both backends
// can read/write the same MongoDB `users` collection.
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, unique: true },
    profileImage: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    role: {
      type: String,
      enum: ['ADMIN', 'TOURIST', 'DRIVER', 'GUIDE'],
      default: 'TOURIST',
    },
    // Jamal uses `status` for active/blocked; replaces Ahmed's previous `isActive`.
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'NOT_VERIFIED'],
      default: 'ACTIVE',
    },
    otps: [
      {
        value: { type: String, required: true },
        expiredAt: { type: Date, default: () => Date.now() + 600000 },
        otpType: { type: String, required: true },
      },
    ],
    isVerified: { type: Boolean, default: false },
    // Ahmed-only: refresh token list for his own JWT auth architecture.
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.otps;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
