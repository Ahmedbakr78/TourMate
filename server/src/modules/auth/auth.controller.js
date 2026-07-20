import User from '../../db/models/User.js';
import crypto from 'crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken, signRefreshToken, verifyRefreshToken } from '../../middlewares/auth.middleware.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone: rawPhone, role } = req.body;
  const phone = rawPhone || `+000-${Date.now()}`;
  if (!name || !email || !password) throw new ApiError(httpStatus.BAD_REQUEST, 'name, email, and password are required');

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Email already registered');

  const user = await User.create({
    name, email, password: await hashPassword(password), phone,
    role: role?.toUpperCase() || 'TOURIST', status: 'ACTIVE', isVerified: false,
  });

  const token = signToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });
  user.refreshTokens = [refreshToken];
  await user.save();

  res.status(201).json({ status: 'success', data: { user: user.toSafeJSON(), token, refreshToken } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  if (user.status === 'INACTIVE') throw new ApiError(httpStatus.FORBIDDEN, 'Account is blocked');

  const token = signToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({ status: 'success', data: { user: user.toSafeJSON(), token, refreshToken } });
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { refreshToken } = req.body;
  const user = await User.findById(userId);
  if (user && refreshToken) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }
  res.json({ status: 'success', message: 'Logged out' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required');

  let decoded;
  try { decoded = verifyRefreshToken(refreshToken); } catch { throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token'); }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.includes(refreshToken)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');

  const token = signToken({ id: user._id, role: user.role });
  res.json({ status: 'success', data: { token } });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findById(userId).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { name, phone, gender } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (gender) updates.gender = gender;

  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -refreshTokens');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ status: 'success', data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(httpStatus.BAD_REQUEST, 'Current and new password are required');

  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');

  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ status: 'success', message: 'Password changed' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const otp = generateOTP();
  user.otps.push({ value: crypto.createHash('sha256').update(otp).digest('hex'), otpType: 'password_reset' });
  await user.save();

  console.log(`[OTP] Password reset OTP for ${email}: ${otp}`);
  res.json({ status: 'success', message: 'OTP sent to email', data: { otp } });
});

export const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(httpStatus.BAD_REQUEST, 'Email and OTP are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  const otpEntry = user.otps.find((o) => o.value === hashedOTP && o.otpType === 'password_reset' && o.expiredAt > new Date());
  if (!otpEntry) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

  const resetToken = signToken({ id: user._id, purpose: 'password_reset' }, { expiresIn: '15m' });
  res.json({ status: 'success', data: { resetToken } });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) throw new ApiError(httpStatus.BAD_REQUEST, 'Email, OTP, and new password are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  const otpEntry = user.otps.find((o) => o.value === hashedOTP && o.otpType === 'password_reset' && o.expiredAt > new Date());
  if (!otpEntry) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

  user.password = await hashPassword(newPassword);
  user.otps = user.otps.filter((o) => o.otpType !== 'password_reset');
  await user.save();

  res.json({ status: 'success', message: 'Password reset successful' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(httpStatus.BAD_REQUEST, 'Email and OTP are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (user.isVerified) return res.json({ status: 'success', message: 'Email already verified' });

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  const otpEntry = user.otps.find((o) => o.value === hashedOTP && o.otpType === 'email_verification' && o.expiredAt > new Date());
  if (!otpEntry) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

  user.isVerified = true;
  user.otps = user.otps.filter((o) => o.otpType !== 'email_verification');
  await user.save();

  res.json({ status: 'success', message: 'Email verified successfully' });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (user.isVerified) return res.json({ status: 'success', message: 'Email already verified' });

  const otp = generateOTP();
  user.otps.push({ value: crypto.createHash('sha256').update(otp).digest('hex'), otpType: 'email_verification' });
  await user.save();

  console.log(`[OTP] Verification OTP for ${email}: ${otp}`);
  res.json({ status: 'success', message: 'Verification OTP sent', data: { otp } });
});
