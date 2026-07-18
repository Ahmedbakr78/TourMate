import mongoose from 'mongoose';
import env from './env.js';

let cached = global._mongooseCache;

export async function connectDB() {
  if (cached) return cached;

  try {
    cached = await mongoose.connect(env.mongoUri);
    global._mongooseCache = cached;
    console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
    return cached;
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
    if (process.env.VERCEL) {
      // In serverless, don't crash — let it retry on next request
      return null;
    }
    process.exit(1);
  }
}

export default connectDB;
