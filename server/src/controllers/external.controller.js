import { fetchPOIs } from '../services/overpass.service.js';
import { getRoute } from '../services/osrm.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';
import { cache } from '../services/cache.service.js';

export const getPOIs = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 1000, categories } = req.query;
  if (!lat || !lng) throw new ApiError(httpStatus.BAD_REQUEST, 'lat and lng are required');

  const cats = categories ? String(categories).split(',') : ['tourism', 'amenity'];
  const result = await fetchPOIs({
    lat: Number(lat),
    lng: Number(lng),
    radius: Number(radius),
    categories: cats,
  });
  res.json({ status: 'success', ...result });
});

export const getRouteHandler = asyncHandler(async (req, res) => {
  const { startLng, startLat, endLng, endLat, profile = 'driving' } = req.query;
  if (!startLng || !startLat || !endLng || !endLat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'start and end coordinates required');
  }
  const route = await getRoute({
    start: [Number(startLng), Number(startLat)],
    end: [Number(endLng), Number(endLat)],
    profile,
  });
  res.json({ status: 'success', data: route });
});

export const getCacheStats = asyncHandler(async (_req, res) => {
  res.json({ status: 'success', data: { size: cache.size } });
});
