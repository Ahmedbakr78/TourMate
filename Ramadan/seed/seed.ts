import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Schema, model } from 'mongoose';

// Load .env from backend (relative to this script)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../TourMate-backend_node.js (2)/TourMate-backend_node.js/.env');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
} catch { /* no .env found */ }

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DB_URL_LOCAL;
  if (!uri) { console.error('No DB URL. Set MONGODB_URI or DB_URL_LOCAL'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('MongoDB connected\n');

  const SALT = parseInt(process.env.SALT_ROUNDS || '10');
  const hash = (s: string) => bcrypt.hashSync(s, SALT);
  const IV_LENGTH = parseInt(process.env.IV_LENGTH || '16');
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY || '12345678901234567890123456789012');
  const enc = (text: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encData = cipher.update(text, 'utf-8', 'hex');
    encData += cipher.final('hex');
    return `${iv.toString('hex')}:${encData}`;
  };

  const User = model('User', new Schema({
    name: String, email: { type: String, unique: true, lowercase: true },
    password: { type: String }, phone: { type: String, unique: true },
    gender: { type: String, enum: ['male', 'female'] },
    role: { type: String, enum: ['tourist', 'driver', 'guide', 'admin'], default: 'tourist' },
    status: { type: String, default: 'active' },
    otps: [{ value: String, expiredAt: Date, otpType: String }],
    isVerified: { type: Boolean, default: false },
    savedPlaces: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
  }, { timestamps: true }));

  const Guide = model('Guide', new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    languages: [String], experience: { type: Number, default: 0 },
    certificate: { secure_url: String, public_id: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    availability: { type: Boolean, default: true },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  }, { timestamps: true }));

  const Driver = model('Driver', new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    licenseNumber: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    availability: { type: Boolean, default: true },
    currentLocation: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  }, { timestamps: true }));

  const Place = model('Place', new Schema({
    osmId: { type: Number, required: true, unique: true },
    name: String, city: String, category: String, description: { type: String, default: '' },
    coordinates: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], required: true } },
    price: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  }, { timestamps: true }));

  const Vehicle = model('Vehicle', new Schema({
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    brand: String, vehicleModel: String, capacity: Number,
    plateNumber: { type: String, unique: true },
    carImages: [{ secure_url: String, public_id: String }],
  }));

  const Review = model('Review', new Schema({
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    touristId: { type: Schema.Types.ObjectId, ref: 'User' },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    guideId: { type: Schema.Types.ObjectId, ref: 'Guide' },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  }, { timestamps: true }));

  await Promise.all([
    User.deleteMany({}), Guide.deleteMany({}), Driver.deleteMany({}),
    Place.deleteMany({}), Vehicle.deleteMany({}), Review.deleteMany({}),
  ]);
  console.log('Cleared old data');

  const users = await User.insertMany([
    { name: 'Ahmed Tour Guide', email: 'ahmed.guide@tourmate.com', password: hash('123456'), phone: enc('01000000001'), gender: 'male', role: 'guide', isVerified: true },
    { name: 'Sara Tour Guide', email: 'sara.guide@tourmate.com', password: hash('123456'), phone: enc('01000000002'), gender: 'female', role: 'guide', isVerified: true },
    { name: 'Mohamed Driver', email: 'mohamed.driver@tourmate.com', password: hash('123456'), phone: enc('01000000003'), gender: 'male', role: 'driver', isVerified: true },
    { name: 'Ali Driver', email: 'ali.driver@tourmate.com', password: hash('123456'), phone: enc('01000000004'), gender: 'male', role: 'driver', isVerified: true },
    { name: 'Test Tourist', email: 'tourist@tourmate.com', password: hash('123456'), phone: enc('01000000005'), gender: 'male', role: 'tourist', isVerified: true },
    { name: 'Laila Tourist', email: 'laila@tourmate.com', password: hash('123456'), phone: enc('01000000006'), gender: 'female', role: 'tourist', isVerified: true },
    { name: 'Admin', email: 'admin@tourmate.com', password: hash('123456'), phone: enc('01000000007'), gender: 'male', role: 'admin', isVerified: true },
  ]);
  console.log(`${users.length} users`);

  const u = (n: string) => users.find(x => x.name.startsWith(n))!;
  const guides = await Guide.insertMany([
    { userId: u('Ahmed')._id, languages: ['Arabic', 'English', 'French'], experience: 8, availability: true, verificationStatus: 'approved', rating: 4.8 },
    { userId: u('Sara')._id, languages: ['Arabic', 'English', 'German'], experience: 5, availability: true, verificationStatus: 'approved', rating: 4.6 },
  ]);
  console.log(`${guides.length} guides`);

  const drivers = await Driver.insertMany([
    { userId: u('Mohamed')._id, licenseNumber: 'LIC-2024-001', availability: true, verificationStatus: 'approved', rating: 4.5, currentLocation: { type: 'Point', coordinates: [31.2357, 30.0444] } },
    { userId: u('Ali')._id, licenseNumber: 'LIC-2024-002', availability: true, verificationStatus: 'approved', rating: 4.3, currentLocation: { type: 'Point', coordinates: [31.2333, 30.0500] } },
  ]);
  console.log(`${drivers.length} drivers`);

  const vehicles = await Vehicle.insertMany([
    { driverId: drivers[0]._id, brand: 'Toyota', vehicleModel: 'Hiace 2023', capacity: 14, plateNumber: 'ABC-123', carImages: [] },
    { driverId: drivers[0]._id, brand: 'Hyundai', vehicleModel: 'Staria 2024', capacity: 7, plateNumber: 'DEF-456', carImages: [] },
    { driverId: drivers[1]._id, brand: 'Mercedes', vehicleModel: 'Sprinter 2023', capacity: 20, plateNumber: 'GHI-789', carImages: [] },
  ]);
  console.log(`${vehicles.length} vehicles`);

  const places = await Place.insertMany([
    { osmId: 1, name: 'Pyramids of Giza', city: 'Giza', category: 'Historical', description: 'The iconic ancient pyramids.', coordinates: { type: 'Point', coordinates: [31.1312, 29.9792] }, price: 240, averageRating: 4.9, reviewsCount: 1245 },
    { osmId: 2, name: 'The Egyptian Museum', city: 'Cairo', category: 'Museum', description: 'Home to over 120,000 artifacts.', coordinates: { type: 'Point', coordinates: [31.2336, 30.0478] }, price: 100, averageRating: 4.5, reviewsCount: 890 },
    { osmId: 3, name: 'Khan El Khalili Bazaar', city: 'Cairo', category: 'Shopping', description: 'Historic souk with traditional crafts.', coordinates: { type: 'Point', coordinates: [31.2624, 30.0483] }, price: 0, averageRating: 4.3, reviewsCount: 567 },
    { osmId: 4, name: 'Nile Corniche', city: 'Cairo', category: 'Scenic', description: 'Waterfront promenade along the Nile.', coordinates: { type: 'Point', coordinates: [31.2310, 30.0550] }, price: 0, averageRating: 4.6, reviewsCount: 432 },
    { osmId: 5, name: 'Citadel of Saladin', city: 'Cairo', category: 'Historical', description: 'Medieval Islamic fortification.', coordinates: { type: 'Point', coordinates: [31.2565, 30.0297] }, price: 180, averageRating: 4.4, reviewsCount: 678 },
    { osmId: 6, name: 'Al-Azhar Park', city: 'Cairo', category: 'Park', description: 'Green park with views of historic Cairo.', coordinates: { type: 'Point', coordinates: [31.2683, 30.0403] }, price: 35, averageRating: 4.5, reviewsCount: 345 },
    { osmId: 7, name: 'Bibliotheca Alexandrina', city: 'Alexandria', category: 'Museum', description: 'Modern library and cultural center.', coordinates: { type: 'Point', coordinates: [29.9095, 31.2021] }, price: 70, averageRating: 4.7, reviewsCount: 789 },
    { osmId: 8, name: 'Montaza Palace', city: 'Alexandria', category: 'Historical', description: 'Royal palace with Mediterranean views.', coordinates: { type: 'Point', coordinates: [30.0133, 31.2820] }, price: 50, averageRating: 4.3, reviewsCount: 234 },
    { osmId: 9, name: 'Luxor Temple', city: 'Luxor', category: 'Historical', description: 'Ancient Egyptian temple complex.', coordinates: { type: 'Point', coordinates: [32.6396, 25.6996] }, price: 180, averageRating: 4.8, reviewsCount: 1123 },
    { osmId: 10, name: 'Valley of the Kings', city: 'Luxor', category: 'Historical', description: 'Burial site of pharaohs.', coordinates: { type: 'Point', coordinates: [32.5925, 25.7387] }, price: 260, averageRating: 4.7, reviewsCount: 987 },
    { osmId: 11, name: 'Sharm El-Sheikh Beach', city: 'Sharm El-Sheikh', category: 'Beach', description: 'Red Sea beach with coral reefs.', coordinates: { type: 'Point', coordinates: [34.2746, 27.9158] }, price: 0, averageRating: 4.8, reviewsCount: 1567 },
    { osmId: 12, name: 'Ras Mohammed National Park', city: 'Sharm El-Sheikh', category: 'Nature', description: 'Marine reserve for diving.', coordinates: { type: 'Point', coordinates: [34.2610, 27.7317] }, price: 150, averageRating: 4.9, reviewsCount: 876 },
    { osmId: 13, name: 'Abu Simbel Temples', city: 'Aswan', category: 'Historical', description: 'Rock-cut temples by Ramesses II.', coordinates: { type: 'Point', coordinates: [31.6260, 22.3366] }, price: 300, averageRating: 4.9, reviewsCount: 654 },
    { osmId: 14, name: 'Philae Temple', city: 'Aswan', category: 'Historical', description: 'Temple dedicated to Isis.', coordinates: { type: 'Point', coordinates: [32.8850, 24.0246] }, price: 140, averageRating: 4.5, reviewsCount: 543 },
    { osmId: 15, name: 'Siwa Oasis', city: 'Siwa', category: 'Nature', description: 'Remote oasis with salt lakes.', coordinates: { type: 'Point', coordinates: [25.5250, 29.2050] }, price: 200, averageRating: 4.6, reviewsCount: 312 },
    { osmId: 16, name: 'Dahab Lagoon', city: 'Dahab', category: 'Beach', description: 'Beach town for windsurfing.', coordinates: { type: 'Point', coordinates: [34.3437, 28.4972] }, price: 0, averageRating: 4.7, reviewsCount: 456 },
    { osmId: 17, name: 'Saint Catherine Monastery', city: 'Sinai', category: 'Historical', description: 'UNESCO-listed monastery.', coordinates: { type: 'Point', coordinates: [33.9784, 28.5557] }, price: 100, averageRating: 4.6, reviewsCount: 234 },
    { osmId: 18, name: 'Salah El-Din Castle', city: 'Taba', category: 'Historical', description: 'Crusader castle.', coordinates: { type: 'Point', coordinates: [34.9028, 29.4917] }, price: 80, averageRating: 4.2, reviewsCount: 123 },
    { osmId: 19, name: 'Mall of Arabia', city: '6th October City', category: 'Shopping', description: 'Modern shopping mall.', coordinates: { type: 'Point', coordinates: [30.9376, 29.9762] }, price: 0, averageRating: 4.1, reviewsCount: 345 },
    { osmId: 20, name: 'Baron Empain Palace', city: 'Heliopolis', category: 'Historical', description: 'Hindu-inspired palace.', coordinates: { type: 'Point', coordinates: [31.3276, 30.0912] }, price: 60, averageRating: 4.3, reviewsCount: 167 },
    { osmId: 21, name: 'Urouba', city: 'Cairo', category: 'Restaurant', description: 'Famous Egyptian street food.', coordinates: { type: 'Point', coordinates: [31.2470, 30.0615] }, price: 200, averageRating: 4.4, reviewsCount: 567 },
    { osmId: 22, name: 'Sofitel Winter Palace', city: 'Luxor', category: 'Hotel', description: 'Historic hotel on the Nile.', coordinates: { type: 'Point', coordinates: [32.6400, 25.6980] }, price: 2000, averageRating: 4.8, reviewsCount: 789 },
    { osmId: 23, name: 'Nile Maxim Dinner Cruise', city: 'Cairo', category: 'Restaurant', description: 'Dinner cruise on the Nile.', coordinates: { type: 'Point', coordinates: [31.2240, 30.0430] }, price: 500, averageRating: 4.2, reviewsCount: 456 },
    { osmId: 24, name: 'Grand Egyptian Museum', city: 'Giza', category: 'Museum', description: 'New museum near the Pyramids.', coordinates: { type: 'Point', coordinates: [31.1176, 29.9961] }, price: 200, averageRating: 4.7, reviewsCount: 234 },
  ]);
  console.log(`${places.length} places`);

  const reviews = await Review.insertMany([
    { tripId: null, touristId: u('Laila')._id, placeId: places[0]._id, rating: 5, comment: 'Amazing experience! The pyramids are breathtaking.' },
    { tripId: null, touristId: u('Test Tourist')._id, placeId: places[0]._id, rating: 5, comment: 'Worth every penny. A must-see!' },
    { tripId: null, touristId: u('Laila')._id, placeId: places[1]._id, rating: 4, comment: 'Incredible collection of artifacts.' },
    { tripId: null, touristId: u('Laila')._id, guideId: guides[0]._id, rating: 5, comment: 'Ahmed was an excellent guide! Very knowledgeable.' },
    { tripId: null, touristId: u('Test Tourist')._id, guideId: guides[0]._id, rating: 4, comment: 'Great tour guide, very friendly.' },
    { tripId: null, touristId: u('Laila')._id, driverId: drivers[0]._id, rating: 5, comment: 'Mohamed is a safe and punctual driver.' },
    { tripId: null, touristId: u('Test Tourist')._id, driverId: drivers[1]._id, rating: 4, comment: 'Ali drove us comfortably.' },
  ]);
  console.log(`${reviews.length} reviews`);

  console.log('\n--- Seeding Complete ---');
  console.log('Login credentials (password: 123456):');
  console.log('  Guide 1: ahmed.guide@tourmate.com');
  console.log('  Guide 2: sara.guide@tourmate.com');
  console.log('  Driver 1: mohamed.driver@tourmate.com');
  console.log('  Driver 2: ali.driver@tourmate.com');
  console.log('  Tourist 1: tourist@tourmate.com');
  console.log('  Tourist 2: laila@tourmate.com');
  console.log('  Admin: admin@tourmate.com');

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
