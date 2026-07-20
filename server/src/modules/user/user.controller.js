import User from '../../db/models/User.js';
import Driver from '../../db/models/Driver.js';
import Guide from '../../db/models/Guide.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';
import { publicUrl, deleteFile } from '../../middlewares/upload.middleware.js';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  if (!req.file) throw new ApiError(httpStatus.UNPROCESSABLE, 'No file uploaded');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  if (user.profileImage?.public_id) {
    await deleteFile(user.profileImage.public_id);
  }

  user.profileImage = { secure_url: publicUrl(req, req.file.filename), public_id: req.file.filename };
  await user.save();

  res.json({ status: 'success', data: user.profileImage });
});

export const deleteProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (!user.profileImage?.public_id) throw new ApiError(httpStatus.NOT_FOUND, 'No profile image');

  await deleteFile(user.profileImage.public_id);
  user.profileImage = undefined;
  await user.save();

  res.json({ status: 'success', message: 'Profile image removed' });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findById(userId).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { name, phone, email } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (phone !== undefined) update.phone = phone;
  if (email !== undefined) update.email = email;

  const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  await Promise.allSettled([
    Driver.deleteOne({ userId: user._id }),
    Guide.deleteOne({ userId: user._id }),
  ]);
  res.json({ status: 'success', message: 'Account deleted' });
});
