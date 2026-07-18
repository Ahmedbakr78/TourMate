import Trip from '../models/Trip.js';
import Place from '../models/Place.js';
import Guide from '../models/Guide.js';
import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import { getRoute } from '../services/osrm.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

// Helper to calculate routing details and estimate price
async function calculateRouteAndEstimation(params) {
  const {
    places = [],
    startDate,
    endDate,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
    peopleCount = 1,
  } = params;

  // Retrieve place details to get coordinates in order
  const placeDocs = await Place.find({ _id: { $in: places } });
  const orderedPlaces = places
    .map((id) => placeDocs.find((p) => p._id.toString() === id.toString()))
    .filter(Boolean);

  const coords = [];
  if (startLocation && startLocation.coordinates && startLocation.coordinates.length === 2) {
    coords.push(startLocation.coordinates);
  }
  for (const p of orderedPlaces) {
    if (p.coordinates && p.coordinates.coordinates && p.coordinates.coordinates.length === 2) {
      coords.push(p.coordinates.coordinates);
    }
  }
  if (endLocation && endLocation.coordinates && endLocation.coordinates.length === 2) {
    coords.push(endLocation.coordinates);
  }

  let distanceMeters = 0;
  let durationSeconds = 0;
  const geometries = [];

  for (let i = 0; i < coords.length - 1; i++) {
    try {
      const route = await getRoute({
        start: coords[i],
        end: coords[i + 1],
      });
      if (route) {
        distanceMeters += route.distanceMeters || 0;
        durationSeconds += route.durationSeconds || 0;
        if (route.geometry) {
          geometries.push(route.geometry);
        }
      }
    } catch (err) {
      console.warn('[Trip Price Estimation] Route calculation step failed:', err.message);
    }
  }

  let routeGeoJSON = null;
  if (geometries.length > 0) {
    routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: geometries.flatMap((g) => g.coordinates || []),
      },
    };
  }

  // Price Calculation Logic
  const baseFee = 50;
  const placeCost = orderedPlaces.length * 30;
  const days = Math.max(
    1,
    Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
  );
  const distanceCost = (distanceMeters / 1000) * 1.2; // $1.2 per km

  let additionalFees = 0;
  if (guideId) additionalFees += days * 150; // $150 per day for guide
  if (driverId) additionalFees += days * 100; // $100 per day for driver
  if (vehicleId) additionalFees += days * 50; // $50 per day for vehicle
  if (peopleCount > 1) additionalFees += (peopleCount - 1) * 10 * days; // $10 per extra person per day

  const totalPrice = Math.round((baseFee + placeCost + distanceCost + additionalFees) * 100) / 100;

  return {
    distanceMeters,
    durationSeconds,
    routeGeoJSON,
    price: totalPrice,
  };
}

export const createTrip = asyncHandler(async (req, res) => {
  const touristId = req.user.id || req.user._id;
  const {
    places,
    startDate,
    endDate,
    peopleCount,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
  } = req.body;

  if (!places || !Array.isArray(places) || places.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'At least one place is required');
  }
  if (!startDate || !endDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Start and End dates are required');
  }

  const estimation = await calculateRouteAndEstimation({
    places,
    startDate,
    endDate,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
    peopleCount,
  });

  const trip = await Trip.create({
    touristId,
    places,
    startDate,
    endDate,
    peopleCount,
    price: req.body.price || estimation.price,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
    routeGeoJSON: estimation.routeGeoJSON,
    distanceMeters: estimation.distanceMeters,
    durationSeconds: estimation.durationSeconds,
    fare: estimation.price,
    status: 'DRAFT',
  });

  res.status(201).json({ status: 'success', data: trip });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  // Auth check: Admin or the owner tourist can edit
  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this trip');
  }

  // If places or dates changed, recalculate estimation
  const placesChanged = req.body.places && JSON.stringify(req.body.places) !== JSON.stringify(trip.places);
  const datesChanged = (req.body.startDate && req.body.startDate !== trip.startDate?.toISOString()) ||
                       (req.body.endDate && req.body.endDate !== trip.endDate?.toISOString());

  if (placesChanged || datesChanged || req.body.startLocation || req.body.endLocation) {
    const estimation = await calculateRouteAndEstimation({
      places: req.body.places || trip.places,
      startDate: req.body.startDate || trip.startDate,
      endDate: req.body.endDate || trip.endDate,
      startLocation: req.body.startLocation || trip.startLocation,
      endLocation: req.body.endLocation || trip.endLocation,
      guideId: req.body.guideId || trip.guideId,
      driverId: req.body.driverId || trip.driverId,
      vehicleId: req.body.vehicleId || trip.vehicleId,
      peopleCount: req.body.peopleCount || trip.peopleCount,
    });

    req.body.routeGeoJSON = estimation.routeGeoJSON;
    req.body.distanceMeters = estimation.distanceMeters;
    req.body.durationSeconds = estimation.durationSeconds;
    req.body.fare = estimation.price;
    if (!req.body.price) {
      req.body.price = estimation.price;
    }
  }

  const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ status: 'success', data: updatedTrip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this trip');
  }

  await Trip.findByIdAndDelete(req.params.id);
  res.json({ status: 'success', message: 'Trip deleted successfully' });
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate('places')
    .populate('touristId', '-password')
    .populate({
      path: 'guideId',
      populate: { path: 'userId', select: '-password' },
    })
    .populate({
      path: 'driverId',
      populate: { path: 'userId', select: '-password' },
    })
    .populate('vehicleId');

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  res.json({ status: 'success', data: trip });
});

export const getAllTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const trips = await Trip.find(filter)
    .populate('places')
    .populate('touristId', '-password')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ status: 'success', data: trips, count: trips.length });
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const trips = await Trip.find({ touristId: userId })
    .populate('places')
    .populate({
      path: 'guideId',
      populate: { path: 'userId', select: '-password' },
    })
    .populate({
      path: 'driverId',
      populate: { path: 'userId', select: '-password' },
    })
    .populate('vehicleId')
    .sort({ createdAt: -1 });

  res.json({ status: 'success', data: trips, count: trips.length });
});

export const getSharedTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ isShared: true })
    .populate('places')
    .populate('touristId', '-password')
    .sort({ createdAt: -1 });

  res.json({ status: 'success', data: trips, count: trips.length });
});

export const assignGuide = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const { guideId } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  if (guideId) {
    const guide = await Guide.findById(guideId);
    if (!guide) throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  }

  trip.guideId = guideId || null;
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const assignDriver = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const { driverId } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  if (driverId) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  trip.driverId = driverId || null;
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const assignVehicle = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const { vehicleId } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  if (vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }

  trip.vehicleId = vehicleId || null;
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const startTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  trip.status = 'ONGOING';
  trip.startTime = new Date();
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const completeTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  trip.status = 'COMPLETED';
  trip.endTime = new Date();
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();

  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to cancel this trip');
  }

  trip.status = 'CANCELLED';
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const shareTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role?.toUpperCase();
  const { isShared } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  if (role !== 'ADMIN' && trip.touristId.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  trip.isShared = typeof isShared === 'boolean' ? isShared : true;
  await trip.save();

  res.json({ status: 'success', data: trip });
});

export const duplicateTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const trip = await Trip.findById(req.params.id);

  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  const duplicate = await Trip.create({
    touristId: userId,
    places: trip.places,
    startDate: trip.startDate,
    endDate: trip.endDate,
    peopleCount: trip.peopleCount,
    price: trip.price,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    guideId: trip.guideId,
    driverId: trip.driverId,
    vehicleId: trip.vehicleId,
    routeGeoJSON: trip.routeGeoJSON,
    distanceMeters: trip.distanceMeters,
    durationSeconds: trip.durationSeconds,
    fare: trip.fare,
    status: 'DRAFT',
  });

  res.status(201).json({ status: 'success', data: duplicate });
});

export const calculateTripPrice = asyncHandler(async (req, res) => {
  const {
    places,
    startDate,
    endDate,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
    peopleCount,
  } = req.body;

  if (!startDate || !endDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'startDate and endDate are required');
  }

  const result = await calculateRouteAndEstimation({
    places: places || [],
    startDate,
    endDate,
    startLocation,
    endLocation,
    guideId,
    driverId,
    vehicleId,
    peopleCount,
  });

  res.json({ status: 'success', data: result });
});

export const getTripRoute = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');

  res.json({
    status: 'success',
    data: {
      routeGeoJSON: trip.routeGeoJSON,
      distanceMeters: trip.distanceMeters,
      durationSeconds: trip.durationSeconds,
    },
  });
});
