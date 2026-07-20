import Review from '../../db/models/Review.js';
import Trip from '../../db/models/Trip.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const createReview = asyncHandler(async (req, res) => {
  const touristId = req.user.id || req.user._id;
  const { tripId, driverId, guideId, placeId, rating, comment } = req.body;
  if (!tripId || !rating) throw new ApiError(httpStatus.BAD_REQUEST, 'tripId and rating are required');
  if (rating < 1 || rating > 5) throw new ApiError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5');

  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  const existing = await Review.findOne({ tripId, touristId });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Already reviewed this trip');

  const review = await Review.create({ tripId, touristId, driverId, guideId, placeId, rating, comment });
  res.status(201).json({ status: 'success', data: review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { rating, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id, touristId: userId });
  if (!review) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found or unauthorized');
  if (rating !== undefined) { if (rating < 1 || rating > 5) throw new ApiError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5'); review.rating = rating; }
  if (comment !== undefined) review.comment = comment;
  await review.save();
  res.json({ status: 'success', data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const filter = role === 'ADMIN' ? { _id: req.params.id } : { _id: req.params.id, touristId: userId };
  const review = await Review.findOneAndDelete(filter);
  if (!review) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found or unauthorized');
  res.json({ status: 'success', message: 'Review deleted' });
});

export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('touristId', '-password');
  if (!review) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  res.json({ status: 'success', data: review });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const reviews = await Review.find().populate('touristId', '-password')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ status: 'success', data: reviews, count: reviews.length });
});

export const getTripReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tripId: req.params.tripId }).populate('touristId', '-password');
  res.json({ status: 'success', data: reviews, count: reviews.length });
});

export const getGuideReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ guideId: req.params.guideId }).populate('touristId', '-password');
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ status: 'success', data: reviews, averageRating: Math.round(avg * 10) / 10, count: reviews.length });
});

export const getDriverReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ driverId: req.params.driverId }).populate('touristId', '-password');
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ status: 'success', data: reviews, averageRating: Math.round(avg * 10) / 10, count: reviews.length });
});

export const getPlaceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ placeId: req.params.placeId }).populate('touristId', '-password');
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ status: 'success', data: reviews, averageRating: Math.round(avg * 10) / 10, count: reviews.length });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const reviews = await Review.find({ touristId: userId }).sort({ createdAt: -1 });
  res.json({ status: 'success', data: reviews, count: reviews.length });
});
