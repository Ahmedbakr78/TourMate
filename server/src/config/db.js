import mongoose from 'mongoose';
import env from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
    process.exit(1);
  }
}

export default connectDB;
