import User from '../models/User.js';
import Driver from '../models/Driver.js';
import Guide from '../models/Guide.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.status = isActive === 'true' ? 'ACTIVE' : 'INACTIVE';

  const users = await User.find(filter).select('-password -refreshTokens');
  res.json({ status: 'success', data: users });
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
