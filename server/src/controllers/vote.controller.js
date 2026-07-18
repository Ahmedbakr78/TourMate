import Vote from '../models/Vote.js';
import Trip from '../models/Trip.js';
import Place from '../models/Place.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

export const createVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { tripId, placeId, voteValue } = req.body;

  if (!tripId || !placeId || !voteValue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'tripId, placeId, and voteValue are required');
  }

  if (!['UP', 'DOWN'].includes(voteValue.toUpperCase())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'voteValue must be UP or DOWN');
  }

  // Ensure trip exists
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  // Ensure place exists
  const place = await Place.findById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }

  // Upsert the vote so that it updates if they already voted on this place in this trip
  const vote = await Vote.findOneAndUpdate(
    { tripId, placeId, userId },
    { voteValue: voteValue.toUpperCase() },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json({ status: 'success', data: vote });
});

export const updateVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const { voteValue } = req.body;

  if (!voteValue || !['UP', 'DOWN'].includes(voteValue.toUpperCase())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'voteValue must be UP or DOWN');
  }

  const vote = await Vote.findById(req.params.id);
  if (!vote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vote not found');
  }

  if (role !== 'ADMIN' && vote.userId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this vote');
  }

  vote.voteValue = voteValue.toUpperCase();
  await vote.save();

  res.json({ status: 'success', data: vote });
});

export const deleteVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();

  const vote = await Vote.findById(req.params.id);
  if (!vote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vote not found');
  }

  if (role !== 'ADMIN' && vote.userId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this vote');
  }

  await Vote.findByIdAndDelete(req.params.id);
  res.json({ status: 'success', message: 'Vote deleted successfully' });
});

export const getPlaceVotes = asyncHandler(async (req, res) => {
  const { placeId } = req.params;
  const { tripId } = req.query;

  const filter = { placeId };
  if (tripId) filter.tripId = tripId;

  const votes = await Vote.find(filter).populate('userId', 'name email');

  const upVotes = votes.filter((v) => v.voteValue === 'UP').length;
  const downVotes = votes.filter((v) => v.voteValue === 'DOWN').length;

  res.json({
    status: 'success',
    data: {
      placeId,
      tripId: tripId || null,
      upVotes,
      downVotes,
      totalVotes: votes.length,
      votes,
    },
  });
});

export const getUserVotes = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const votes = await Vote.find({ userId })
    .populate('tripId')
    .populate('placeId');

  res.json({ status: 'success', data: votes, count: votes.length });
});
