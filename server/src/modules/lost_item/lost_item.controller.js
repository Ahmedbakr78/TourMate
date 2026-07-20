import LostItem from '../../db/models/LostItem.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const createLostItem = asyncHandler(async (req, res) => {
  const reportedBy = req.user.id || req.user._id;
  const { title, description, location, tripId } = req.body;
  if (!title) throw new ApiError(httpStatus.BAD_REQUEST, 'Title is required');
  const item = await LostItem.create({ reportedBy, title, description, location, tripId });
  res.status(201).json({ status: 'success', data: item });
});

export const updateLostItem = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const filter = role === 'ADMIN' ? { _id: req.params.id } : { _id: req.params.id, reportedBy: userId };
  const item = await LostItem.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  res.json({ status: 'success', data: item });
});

export const updateLostItemStatus = asyncHandler(async (req, res) => {
  const { found } = req.body;
  if (typeof found !== 'boolean') throw new ApiError(httpStatus.BAD_REQUEST, 'found must be a boolean');
  const item = await LostItem.findByIdAndUpdate(req.params.id, { found }, { new: true });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  res.json({ status: 'success', data: item });
});

export const deleteLostItem = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const filter = role === 'ADMIN' ? { _id: req.params.id } : { _id: req.params.id, reportedBy: userId };
  const item = await LostItem.findOneAndDelete(filter);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  res.json({ status: 'success', message: 'Lost item deleted' });
});

export const getLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id).populate('reportedBy', '-password').populate('foundBy', '-password');
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  res.json({ status: 'success', data: item });
});

export const getAllLostItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, found } = req.query;
  const filter = {};
  if (found !== undefined) filter.found = found === 'true';
  const items = await LostItem.find(filter).populate('reportedBy', '-password')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ status: 'success', data: items, count: items.length });
});

export const getMyLostItems = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const items = await LostItem.find({ reportedBy: userId }).sort({ createdAt: -1 });
  res.json({ status: 'success', data: items, count: items.length });
});

export const getTripLostItems = asyncHandler(async (req, res) => {
  const items = await LostItem.find({ tripId: req.params.tripId })
    .populate('reportedBy', '-password').populate('foundBy', '-password').sort({ createdAt: -1 });
  res.json({ status: 'success', data: items, count: items.length });
});

export const reportFoundItem = asyncHandler(async (req, res) => {
  const foundBy = req.user.id || req.user._id;
  const item = await LostItem.findById(req.params.id);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  item.found = true;
  item.foundBy = foundBy;
  await item.save();
  res.json({ status: 'success', data: item });
});

export const closeLostItem = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const item = await LostItem.findOne({ _id: req.params.id, reportedBy: userId });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  item.found = true;
  await item.save();
  res.json({ status: 'success', data: item });
});

export const reopenLostItem = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const item = await LostItem.findOne({ _id: req.params.id, reportedBy: userId });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Lost item not found');
  item.found = false;
  item.foundBy = null;
  await item.save();
  res.json({ status: 'success', data: item });
});
