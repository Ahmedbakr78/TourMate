import Vote from '../../db/models/Vote.js';
import Trip from '../../db/models/Trip.js';
import Place from '../../db/models/Place.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const createVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { tripId, placeId, voteValue } = req.body;
  if (!tripId || !placeId || !voteValue) throw new ApiError(httpStatus.BAD_REQUEST, 'tripId, placeId, and voteValue are required');
  if (!['UP', 'DOWN'].includes(voteValue.toUpperCase())) throw new ApiError(httpStatus.BAD_REQUEST, 'voteValue must be UP or DOWN');

  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  const place = await Place.findById(placeId);
  if (!place) throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');

  const existing = await Vote.findOne({ tripId, placeId, userId });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Already voted for this place in this trip');

  const vote = await Vote.create({ tripId, placeId, userId, voteValue: voteValue.toUpperCase() });
  res.status(201).json({ status: 'success', data: vote });
});

export const updateVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { voteValue } = req.body;
  if (!voteValue || !['UP', 'DOWN'].includes(voteValue.toUpperCase())) throw new ApiError(httpStatus.BAD_REQUEST, 'voteValue must be UP or DOWN');

  const vote = await Vote.findOne({ _id: req.params.id, userId });
  if (!vote) throw new ApiError(httpStatus.NOT_FOUND, 'Vote not found or unauthorized');

  vote.voteValue = voteValue.toUpperCase(); await vote.save();
  res.json({ status: 'success', data: vote });
});

export const deleteVote = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const vote = await Vote.findOneAndDelete({ _id: req.params.id, userId });
  if (!vote) throw new ApiError(httpStatus.NOT_FOUND, 'Vote not found or unauthorized');
  res.json({ status: 'success', message: 'Vote deleted' });
});

export const getPlaceVotes = asyncHandler(async (req, res) => {
  const votes = await Vote.find({ placeId: req.params.placeId }).populate('userId', '-password');
  const up = votes.filter((v) => v.voteValue === 'UP').length;
  const down = votes.filter((v) => v.voteValue === 'DOWN').length;
  res.json({ status: 'success', data: { votes, summary: { up, down, total: votes.length } } });
});

export const getUserVotes = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const votes = await Vote.find({ userId }).populate('placeId').populate('tripId');
  res.json({ status: 'success', data: votes, count: votes.length });
});
