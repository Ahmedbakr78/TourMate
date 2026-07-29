import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';
import {
  updateDriverLocation,
  getDriverLocation,
  getLocationsByDrivers,
  getActiveTripLocations,
  removeDriverLocation,
} from '../services/tracking.service.js';
import Driver from '../models/Driver.js';

export const pushLocation = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const { lng, lat, heading, speed, tripId } = req.body;
  if (!lng || !lat) throw new ApiError(httpStatus.BAD_REQUEST, 'lng and lat required');

  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');

  const loc = updateDriverLocation(driverId, [Number(lng), Number(lat)], {
    heading,
    speed,
    tripId,
  });
  driver.currentLocation = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
  driver.lastSeen = new Date();
  await driver.save();

  res.status(200).json({ status: 'success', data: loc });
});

export const pollDriverLocation = asyncHandler(async (req, res) => {
  const loc = getDriverLocation(req.params.driverId);
  if (!loc) throw new ApiError(httpStatus.NOT_FOUND, 'No location reported yet');
  res.json({ status: 'success', data: loc, serverTime: new Date().toISOString() });
});

export const pollAllLocations = asyncHandler(async (req, res) => {
  const ids = req.query.ids ? String(req.query.ids).split(',') : [];
  const locs = getLocationsByDrivers(ids);
  res.json({ status: 'success', data: locs, serverTime: new Date().toISOString() });
});

export const pollActiveTrips = asyncHandler(async (_req, res) => {
  const locs = getActiveTripLocations();
  res.json({ status: 'success', data: locs, serverTime: new Date().toISOString() });
});

export const clearLocation = asyncHandler(async (req, res) => {
  removeDriverLocation(req.params.driverId);
  res.json({ status: 'success', message: 'Location cleared' });
});
