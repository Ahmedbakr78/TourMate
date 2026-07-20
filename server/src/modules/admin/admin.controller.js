import mongoose from 'mongoose';
import User from '../../db/models/User.js';
import Driver from '../../db/models/Driver.js';
import Guide from '../../db/models/Guide.js';
import Vehicle from '../../db/models/Vehicle.js';
import Trip from '../../db/models/Trip.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.status = isActive === 'true' ? 'ACTIVE' : 'INACTIVE';

  const users = await User.find(filter).select('-password -refreshTokens');
  res.json({ status: 'success', data: users });
});

export const getPendingGuides = asyncHandler(async (_req, res) => {
  const guides = await Guide.find({ verificationStatus: 'PENDING' }).populate('userId', '-password -refreshTokens');
  res.json({ status: 'success', data: guides });
});

export const getPendingDrivers = asyncHandler(async (_req, res) => {
  const drivers = await Driver.find({ verificationStatus: 'PENDING' }).populate('userId', '-password -refreshTokens');
  res.json({ status: 'success', data: drivers });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'INACTIVE' },
    { new: true }
  ).select('-password');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'ACTIVE' },
    { new: true }
  ).select('-password');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  await Promise.allSettled([
    Driver.deleteOne({ userId: user._id }),
    Guide.deleteOne({ userId: user._id }),
  ]);
  res.json({ status: 'success', message: 'User deleted' });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  res.json({ status: 'success', message: 'Trip deleted' });
});

export const approveGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'APPROVED' },
    { new: true }
  );
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  res.json({ status: 'success', data: guide });
});

export const rejectGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'REJECTED' },
    { new: true }
  );
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  res.json({ status: 'success', data: guide });
});

export const approveDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'APPROVED' },
    { new: true }
  );
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  res.json({ status: 'success', data: driver });
});

export const rejectDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'REJECTED' },
    { new: true }
  );
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  res.json({ status: 'success', data: driver });
});

export const getStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalDrivers, totalGuides, totalVehicles, activeTrips] =
    await Promise.all([
      User.countDocuments(),
      Driver.countDocuments(),
      Guide.countDocuments(),
      Vehicle.countDocuments(),
      Trip.countDocuments({ status: { $in: ['ONGOING', 'CONFIRMED', 'PENDING'] } }),
    ]);

  res.json({
    status: 'success',
    data: { totalUsers, totalDrivers, totalGuides, totalVehicles, activeTrips },
  });
});

export const getReports = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalDrivers,
    totalGuides,
    totalVehicles,
    totalTrips,
    tripStatusCounts,
    totalReviews,
    totalLostItems,
  ] = await Promise.all([
    User.countDocuments(),
    Driver.countDocuments(),
    Guide.countDocuments(),
    Vehicle.countDocuments(),
    Trip.countDocuments(),
    Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    mongoose.model('Review').countDocuments(),
    mongoose.model('LostItem').countDocuments(),
  ]);

  res.json({
    status: 'success',
    data: {
      totalUsers, totalDrivers, totalGuides, totalVehicles, totalTrips,
      tripStatusCounts: tripStatusCounts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
      totalReviews, totalLostItems,
    },
  });
});
