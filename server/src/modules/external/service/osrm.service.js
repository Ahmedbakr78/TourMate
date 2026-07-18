import env from '../../../config/env.js';
import { ApiError, httpStatus } from '../../../utils/apiError.js';

export async function getRoute({ start, end, profile = 'driving' }) {
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;

  if (env.osrm.orsApiKey) {
    try {
      return await routeWithORS(start, end, profile);
    } catch (err) {
      console.warn('[osrm] ORS failed, falling back to mock:', err.message);
    }
  }

  try {
    const url = `${env.osrm.baseUrl}/route/v1/${profile}/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new ApiError(httpStatus.BAD_GATEWAY, 'OSRM route error');
    const data = await res.json();
    const route = data.routes?.[0];
    return {
      distanceMeters: route?.distance ?? 0,
      durationSeconds: route?.duration ?? 0,
      geometry: route?.geometry,
      provider: 'osrm',
    };
  } catch (err) {
    console.warn('[osrm] request failed, returning mock route:', err.message);
    return mockRoute(start, end);
  }
}

async function routeWithORS(start, end, profile) {
  const res = await fetch(`${env.osrm.orsBaseUrl}/v2/directions/${profile}/geojson`, {
    method: 'POST',
    headers: {
      Authorization: env.osrm.orsApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coordinates: [start, end] }),
  });
  if (!res.ok) throw new ApiError(httpStatus.BAD_GATEWAY, 'ORS route error');
  const data = await res.json();
  const route = data.features?.[0];
  return {
    distanceMeters: route?.properties?.summary?.distance ?? 0,
    durationSeconds: route?.properties?.summary?.duration ?? 0,
    geometry: route?.geometry,
    provider: 'openrouteservice',
  };
}

function mockRoute(start, end) {
  const distance = haversine(start, end);
  return {
    distanceMeters: Math.round(distance),
    durationSeconds: Math.round(distance / 11.1),
    geometry: { type: 'LineString', coordinates: [start, end] },
    provider: 'mock',
  };
}

function haversine([lng1, lat1], [lng2, lat2]) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
