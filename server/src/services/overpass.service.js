import env from '../config/env.js';
import { cache } from './cache.service.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

export function buildPOIQuery({ lat, lng, radius = 1000, categories = ['tourism', 'amenity'] }) {
  const bbox = [
    (lat - radius / 111320).toFixed(6),
    (lng - radius / (111320 * Math.cos((lat * Math.PI) / 180))).toFixed(6),
    (lat + radius / 111320).toFixed(6),
    (lng + radius / (111320 * Math.cos((lat * Math.PI) / 180))).toFixed(6),
  ].join(',');

  const selectors = categories
    .map((c) => `node["${c}"](${bbox});way["${c}"](${bbox});`)
    .join('');

  return `[out:json][timeout:25];(${selectors});out center 200;`;
}

function mockPOIs({ lat, lng }) {
  return {
    cached: false,
    mock: true,
    elements: [
      { type: 'node', id: 1, lat: lat + 0.001, lon: lng + 0.001, tags: { tourism: 'museum', name: 'Mock Museum' } },
      { type: 'node', id: 2, lat: lat - 0.001, lon: lng - 0.001, tags: { amenity: 'restaurant', name: 'Mock Restaurant' } },
    ],
  };
}

export async function fetchPOIs({ lat, lng, radius, categories }) {
  const query = buildPOIQuery({ lat, lng, radius, categories });
  const cacheKey = `overpass:${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}:${categories.join(',')}`;

  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.overpass.timeoutMs);

  try {
    const res = await fetch(env.overpass.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
      signal: controller.signal,
    });

    if (!res.ok) throw new ApiError(httpStatus.BAD_GATEWAY, 'Overpass API error');

    const data = await res.json();
    const payload = { elements: data.elements || [], mock: false };
    cache.set(cacheKey, payload, env.overpass.cacheTtlMs);
    return { ...payload, cached: false };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[overpass] timeout, returning mock data');
    } else {
      console.warn('[overpass] request failed, returning mock data:', err.message);
    }
    const mock = mockPOIs({ lat, lng });
    return mock;
  } finally {
    clearTimeout(timeout);
  }
}
