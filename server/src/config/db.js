import mongoose from 'mongoose';
import env from './env.js';

let cached = global._mongooseCache;

export async function connectDB() {
  if (cached) return cached;

  cached = await mongoose.connect(env.mongoUri);
  global._mongooseCache = cached;
  console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
  return cached;
}

export default connectDB;
