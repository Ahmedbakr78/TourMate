import Driver from '../../db/models/Driver.js';
import User from '../../db/models/User.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';
import { hashPassword } from '../../utils/password.js';

export const createDriver = asyncHandler(async (req, res) => {
  const { name, email, password, phone: rawPhone, licenseNumber, nationalId } = req.body;
  const phone = rawPhone || `+000-${Date.now()}`;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Email already registered');

  const user = await User.create({
    name,
    email,
    password: await hashPassword(password || 'TourMate@123'),
    phone,
    role: 'DRIVER',
  });

  const driver = await Driver.create({
    userId: user._id,
    licenseNumber,
    nationalId,
  });

  res.status(201).json({ status: 'success', data: { driver, user: user.toSafeJSON() } });
});

export const getDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate('userId', '-password');
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  res.json({ status: 'success', data: driver });
});

export const getAllDrivers = asyncHandler(async (req, res) => {
  const { availability, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (availability !== undefined) {
    const map = { available: true, busy: true, offline: false };
    filter.availability =
      typeof availability === 'string' ? (availability in map ? map[availability] : true) : availability;
  }

  const drivers = await Driver.find(filter)
    .populate('userId', '-password')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ status: 'success', data: drivers, count: drivers.length });
});

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('userId', '-password');
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  res.json({ status: 'success', data: driver });
});

export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  await User.findByIdAndDelete(driver.userId);
  res.json({ status: 'success', message: 'Driver deleted' });
});

export const searchDrivers = asyncHandler(async (req, res) => {
  const { q, availability, lat, lng, radius = 5000 } = req.query;
  const filter = {};
  if (availability) filter.availability = availability;

  let query = Driver.find(filter).populate('userId', '-password');
  if (q) query = query.where('licenseNumber').regex(new RegExp(q, 'i'));

  if (lat && lng) {
    query = query.where('currentLocation').near({
      center: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
      maxDistance: Number(radius),
    });
  }
  const drivers = await query.limit(50);
  res.json({ status: 'success', data: drivers });
});

export const updateAvailability = asyncHandler(async (req, res) => {
  let availability = req.body.availability;
  if (typeof availability === 'string') {
    const map = { available: true, busy: true, offline: false };
    if (!(availability in map)) {
      throw new ApiError(httpStatus.UNPROCESSABLE, 'Invalid availability value');
    }
    availability = map[availability];
  }
  if (typeof availability !== 'boolean') {
    throw new ApiError(httpStatus.UNPROCESSABLE, 'Availability must be a boolean');
  }
  let driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { availability, lastSeen: new Date() },
    { new: true }
  );
  if (!driver) {
    driver = await Driver.findOneAndUpdate(
      { userId: req.params.id },
      { availability, lastSeen: new Date() },
      { new: true }
    );
  }
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  res.json({ status: 'success', data: driver });
});
