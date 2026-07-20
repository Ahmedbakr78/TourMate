const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://127.0.0.1:27017/tourmate';

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, enum: ['ADMIN', 'TOURIST', 'DRIVER', 'GUIDE'] },
  phone: String, status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'NOT_VERIFIED'] },
  isVerified: Boolean, refreshTokens: [String],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  licenseNumber: String, rating: Number, availability: Boolean,
  currentLocation: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
  verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
  vehicleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  lastSeen: Date, nationalId: String,
}, { timestamps: true });
const Driver = mongoose.model('Driver', driverSchema);

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  languages: [String], experience: Number, rating: Number, availability: Boolean,
  verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
  lastSeen: Date,
}, { timestamps: true });
const Guide = mongoose.model('Guide', guideSchema);

const vehicleSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  brand: String, vehicleModel: String, capacity: Number, plateNumber: String,
  carImages: [{ secure_url: String, public_id: String }], isActive: Boolean,
}, { timestamps: true });
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('[seed] Connected');

  await mongoose.connection.db.dropDatabase();
  console.log('[seed] Recreated DB');

  // Users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@tourmate.com', password: await bcrypt.hash('password123', 12), role: 'ADMIN', phone: '+201001234567', status: 'ACTIVE', isVerified: true, refreshTokens: [] },
    { name: 'Ahmed Tourist', email: 'tourist@tourmate.com', password: await bcrypt.hash('password123', 12), role: 'TOURIST', phone: '+201009876543', status: 'ACTIVE', isVerified: true, refreshTokens: [] },
    { name: 'Khaled Driver', email: 'driver@tourmate.com', password: await bcrypt.hash('password123', 12), role: 'DRIVER', phone: '+201005551111', status: 'ACTIVE', isVerified: true, refreshTokens: [] },
    { name: 'Mona Guide', email: 'guide@tourmate.com', password: await bcrypt.hash('password123', 12), role: 'GUIDE', phone: '+201005552222', status: 'ACTIVE', isVerified: true, refreshTokens: [] },
  ]);
  console.log('[seed] Users:', users.map(u => `${u.name} (${u.role})`).join(', '));

  // Driver & Guide profiles
  const driver = await Driver.create({
    userId: users[2]._id, licenseNumber: 'EG-123456', rating: 4.5, availability: true,
    currentLocation: { type: 'Point', coordinates: [31.2336, 30.0478] },
    verificationStatus: 'APPROVED', lastSeen: new Date(), nationalId: '29801011234567',
  });
  const guide = await Guide.create({
    userId: users[3]._id, languages: ['Arabic', 'English', 'French'], experience: 8, rating: 4.8,
    availability: true, verificationStatus: 'APPROVED', lastSeen: new Date(),
  });
  console.log('[seed] Driver & Guide profiles created');

  // Vehicles
  const vehicle = await Vehicle.create({
    driverId: driver._id, brand: 'Toyota', vehicleModel: 'Hiace', capacity: 12, plateNumber: 'ABC-1234',
    carImages: [], isActive: true,
  });
  driver.vehicleIds.push(vehicle._id);
  await driver.save();
  console.log('[seed] Vehicle created');

  // 2dsphere index for Place $near queries
  try { await mongoose.connection.db.collection('places').createIndex({ coordinates: '2dsphere' }); } catch {}

  // Places
  const places = await mongoose.connection.db.collection('places').insertMany([
    { osmId: 1, name: 'Egyptian Museum', city: 'Cairo', category: 'museum', lat: 30.0478, lng: 31.2336, coordinates: { type: 'Point', coordinates: [31.2336, 30.0478] }, description: 'Over 120,000 artifacts including Tutankhamun treasures', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Egyptian_Museum.jpg/300px-Egyptian_Museum.jpg', tags: ['history', 'pharaohs', 'downtown'], rating: 4.5, visitDuration: 180, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 2, name: 'Pyramids of Giza', city: 'Giza', category: 'historical', lat: 29.9792, lng: 31.1342, coordinates: { type: 'Point', coordinates: [31.1342, 29.9792] }, description: 'The last surviving Wonder of the Ancient World', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/300px-Kheops-Pyramid.jpg', tags: ['wonder', 'pharaohs', 'UNESCO'], rating: 4.8, visitDuration: 240, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 3, name: 'Khan El Khalili', city: 'Cairo', category: 'market', lat: 30.0477, lng: 31.2627, coordinates: { type: 'Point', coordinates: [31.2627, 30.0477] }, description: 'Famous historic bazaar and souq', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Khan_el-Khalili.jpg/300px-Khan_el-Khalili.jpg', tags: ['shopping', 'souvenir', 'historic'], rating: 4.2, visitDuration: 120, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 4, name: 'Nile Corniche', city: 'Cairo', category: 'landmark', lat: 30.0514, lng: 31.2307, coordinates: { type: 'Point', coordinates: [31.2307, 30.0514] }, description: 'Scenic waterfront promenade along the Nile', tags: ['river', 'walk', 'view'], rating: 4.3, visitDuration: 60, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 5, name: 'Luxor Temple', city: 'Luxor', category: 'historical', lat: 25.6997, lng: 32.6393, coordinates: { type: 'Point', coordinates: [32.6393, 25.6997] }, description: 'Ancient Egyptian temple complex on the east bank of the Nile', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Luxor_temple.jpg/300px-Luxor_temple.jpg', tags: ['temple', 'pharaohs', 'UNESCO'], rating: 4.6, visitDuration: 150, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 6, name: 'Valley of the Kings', city: 'Luxor', category: 'historical', lat: 25.7402, lng: 32.6010, coordinates: { type: 'Point', coordinates: [32.6010, 25.7402] }, description: 'Burial site of pharaohs including Tutankhamun', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Valley_of_the_Kings.jpg/300px-Valley_of_the_Kings.jpg', tags: ['tomb', 'pharaohs', 'UNESCO'], rating: 4.7, visitDuration: 180, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 7, name: 'Alexandria Library', city: 'Alexandria', category: 'museum', lat: 31.2089, lng: 29.9090, coordinates: { type: 'Point', coordinates: [29.9090, 31.2089] }, description: 'Modern library and cultural center on the ancient Library of Alexandria site', tags: ['library', 'culture', 'modern'], rating: 4.4, visitDuration: 120, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 8, name: 'Sharm El-Sheikh Beach', city: 'Sharm El-Sheikh', category: 'beach', lat: 27.9158, lng: 34.3298, coordinates: { type: 'Point', coordinates: [34.3298, 27.9158] }, description: 'World-class diving and Red Sea beaches', tags: ['diving', 'sea', 'resort'], rating: 4.6, visitDuration: 300, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 9, name: 'Citadel of Saladin', city: 'Cairo', category: 'historical', lat: 30.0296, lng: 31.2600, coordinates: { type: 'Point', coordinates: [31.2600, 30.0296] }, description: 'Medieval Islamic fortification with panoramic city views', tags: ['castle', 'islamic', 'view'], rating: 4.3, visitDuration: 120, createdAt: new Date(), updatedAt: new Date() },
    { osmId: 10, name: 'Abu Simbel', city: 'Aswan', category: 'historical', lat: 22.3372, lng: 31.6258, coordinates: { type: 'Point', coordinates: [31.6258, 22.3372] }, description: 'Two massive rock-cut temples built by Ramesses II', tags: ['temple', 'UNESCO', 'monument'], rating: 4.9, visitDuration: 180, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('[seed] Places:', places.insertedCount);

  // Trips
  const trip1 = await mongoose.connection.db.collection('trips').insertOne({
    touristId: users[1]._id, name: 'Cairo Heritage Tour',
    description: 'A 3-day tour of Cairo\'s greatest historical sites',
    startDate: new Date('2026-08-01T09:00:00Z'), endDate: new Date('2026-08-03T18:00:00Z'),
    places: [places.insertedIds['0'], places.insertedIds['1'], places.insertedIds['3'], places.insertedIds['8']],
    status: 'DRAFT', peopleCount: 2, price: 500,
    driverId: null, guideId: null,
    createdAt: new Date(), updatedAt: new Date(),
  });
  console.log('[seed] Trip 1 created');

  await mongoose.connection.db.collection('trips').insertOne({
    touristId: users[1]._id, name: 'Luxor Adventure',
    description: 'Exploring the wonders of Upper Egypt',
    startDate: new Date('2026-09-15T09:00:00Z'), endDate: new Date('2026-09-17T18:00:00Z'),
    places: [places.insertedIds['4'], places.insertedIds['5']],
    status: 'CONFIRMED', peopleCount: 4, price: 1200,
    driverId: driver._id, guideId: guide._id,
    createdAt: new Date(), updatedAt: new Date(),
  });
  console.log('[seed] Trip 2 created');

  // Reviews
  await mongoose.connection.db.collection('reviews').insertMany([
    { touristId: users[1]._id, tripId: trip1.insertedId, placeId: places.insertedIds['0'], rating: 5, comment: 'Incredible collection of artifacts!', createdAt: new Date(), updatedAt: new Date() },
    { touristId: users[1]._id, tripId: trip1.insertedId, placeId: places.insertedIds['1'], rating: 5, comment: 'The pyramids are breathtaking!', createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('[seed] Reviews created');

  // Votes
  await mongoose.connection.db.collection('votes').insertMany([
    { userId: users[1]._id, placeId: places.insertedIds['0'], tripId: trip1.insertedId, voteValue: 'UP', createdAt: new Date(), updatedAt: new Date() },
    { userId: users[1]._id, placeId: places.insertedIds['1'], tripId: trip1.insertedId, voteValue: 'UP', createdAt: new Date(), updatedAt: new Date() },
    { userId: users[1]._id, placeId: places.insertedIds['8'], tripId: trip1.insertedId, voteValue: 'DOWN', createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('[seed] Votes created');

  // Notifications
  await mongoose.connection.db.collection('notifications').insertMany([
    { senderId: users[0]._id, receiverId: users[1]._id, title: 'Welcome!', message: 'Welcome to TourMate, Ahmed! Start planning your next adventure.', type: 'system', isRead: false, createdAt: new Date(), updatedAt: new Date() },
    { senderId: users[0]._id, receiverId: users[1]._id, title: 'Trip Confirmed', message: 'Your Luxor Adventure trip has been confirmed!', type: 'trip', isRead: false, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('[seed] Notifications created');

  console.log('\n========== SEED COMPLETE ==========');
  console.log('Admin:  admin@tourmate.com / password123');
  console.log('Tourist:tourist@tourmate.com / password123');
  console.log('Driver: driver@tourmate.com / password123');
  console.log('Guide:  guide@tourmate.com / password123');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
