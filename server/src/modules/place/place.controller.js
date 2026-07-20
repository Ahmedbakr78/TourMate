import Place from '../../db/models/Place.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const createPlace = asyncHandler(async (req, res) => {
  const place = await Place.create(req.body);
  res.status(201).json({ status: 'success', data: place });
});

export const updatePlace = asyncHandler(async (req, res) => {
  const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!place) throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  res.json({ status: 'success', data: place });
});

export const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findByIdAndDelete(req.params.id);
  if (!place) throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  res.json({ status: 'success', message: 'Place deleted' });
});

export const getPlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  res.json({ status: 'success', data: place });
});

export const getAllPlaces = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, city, category } = req.query;
  const filter = {};
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (category) filter.category = category;
  const places = await Place.find(filter).skip((page - 1) * limit).limit(Number(limit));
  res.json({ status: 'success', data: places, count: places.length });
});

export const searchPlaces = asyncHandler(async (req, res) => {
  const { q, city, category } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (category) filter.category = category;
  const places = await Place.find(filter).limit(50);
  res.json({ status: 'success', data: places, count: places.length });
});

export const filterPlaces = asyncHandler(async (req, res) => {
  const { city, category, minRating } = req.query;
  const filter = {};
  if (city) filter.city = city;
  if (category) filter.category = category;
  let places = await Place.find(filter);
  if (minRating) places = places.filter((p) => (p.averageRating || 0) >= Number(minRating));
  res.json({ status: 'success', data: places, count: places.length });
});

export const getNearbyPlaces = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000, category } = req.query;
  if (!lat || !lng) throw new ApiError(httpStatus.BAD_REQUEST, 'lat and lng are required');
  const filter = { coordinates: { $near: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }, $maxDistance: Number(radius) } } };
  if (category) filter.category = category;
  const places = await Place.find(filter).limit(50);
  res.json({ status: 'success', data: places, count: places.length });
});

export const getPopularPlaces = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const places = await Place.aggregate([
    { $lookup: { from: 'votes', localField: '_id', foreignField: 'placeId', as: 'votes' } },
    { $addFields: { voteCount: { $size: '$votes' } } },
    { $sort: { voteCount: -1 } },
    { $limit: Number(limit) },
    { $project: { votes: 0 } },
  ]);
  res.json({ status: 'success', data: places, count: places.length });
});

export const savePlace = asyncHandler(async (req, res) => {
  const { osmId, name, city, category, description, coordinates } = req.body;
  if (!osmId || !name || !city || !category) throw new ApiError(httpStatus.BAD_REQUEST, 'osmId, name, city, and category are required');
  const existing = await Place.findOne({ osmId });
  if (existing) return res.json({ status: 'success', data: existing });
  const place = await Place.create({ osmId, name, city, category, description, coordinates });
  res.status(201).json({ status: 'success', data: place });
});
