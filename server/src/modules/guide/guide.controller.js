import Guide from '../../db/models/Guide.js';
import User from '../../db/models/User.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';
import { hashPassword } from '../../utils/password.js';
import { publicUrl, deleteFile } from '../../middlewares/upload.middleware.js';

export const createGuide = asyncHandler(async (req, res) => {
  const { name, email, password, phone: rawPhone, languages } = req.body;
  const phone = rawPhone || `+000-${Date.now()}`;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Email already registered');

  const user = await User.create({
    name,
    email,
    password: await hashPassword(password || 'TourMate@123'),
    phone,
    role: 'GUIDE',
  });

  const guide = await Guide.create({
    userId: user._id,
    languages: languages || [],
  });

  res.status(201).json({ status: 'success', data: { guide, user: user.toSafeJSON() } });
});

export const getGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findById(req.params.id).populate('userId', '-password');
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  res.json({ status: 'success', data: guide });
});

export const getAllGuides = asyncHandler(async (req, res) => {
  const { availability, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (availability !== undefined) {
    const map = { available: true, busy: true, offline: false };
    filter.availability =
      typeof availability === 'string' ? (availability in map ? map[availability] : true) : availability;
  }

  const guides = await Guide.find(filter)
    .populate('userId', '-password')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ status: 'success', data: guides, count: guides.length });
});

export const updateGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('userId', '-password');
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  res.json({ status: 'success', data: guide });
});

export const deleteGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findByIdAndDelete(req.params.id);
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  await User.findByIdAndDelete(guide.userId);
  res.json({ status: 'success', message: 'Guide deleted' });
});

export const searchGuides = asyncHandler(async (req, res) => {
  const { q, language, specialty, lat, lng, radius = 5000 } = req.query;
  const filter = {};
  if (language) filter.languages = language;
  if (specialty) filter.languages = specialty;

  let query = Guide.find(filter).populate('userId', '-password');
  if (q) query = query.where('languages').regex(new RegExp(q, 'i'));

  if (lat && lng) {
    query = query.where('currentLocation').near({
      center: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
      maxDistance: Number(radius),
    });
  }
  const guides = await query.limit(50);
  res.json({ status: 'success', data: guides });
});

export const updateAvailability = asyncHandler(async (req, res) => {
  let { availability } = req.body;
  if (typeof availability === 'string') {
    const map = { available: true, busy: true, offline: false };
    if (!(availability in map)) {
      throw new ApiError(httpStatus.UNPROCESSABLE, 'Invalid availability value');
    }
    availability = map[availability];
  }
  if (typeof availability !== 'boolean') {
    throw new ApiError(httpStatus.UNPROCESSABLE, 'Availability must be a boolean or valid string');
  }
  let guide = await Guide.findByIdAndUpdate(
    req.params.id,
    { availability, lastSeen: new Date() },
    { new: true }
  );
  if (!guide) {
    guide = await Guide.findOneAndUpdate(
      { userId: req.params.id },
      { availability, lastSeen: new Date() },
      { new: true }
    );
  }
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  res.json({ status: 'success', data: guide });
});

export const uploadCertificate = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(httpStatus.UNPROCESSABLE, 'No file uploaded');
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  const url = publicUrl(req, req.file.filename);
  guide.certificate = url;
  await guide.save();
  res.json({ status: 'success', data: { url, certificate: guide.certificate } });
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  guide.certificate = null;
  deleteFile(url);
  await guide.save();
  res.json({ status: 'success', data: { certificate: guide.certificate } });
});
