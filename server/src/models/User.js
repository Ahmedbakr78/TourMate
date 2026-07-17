import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['admin', 'tourist', 'driver', 'guide'],
      default: 'tourist',
    },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
