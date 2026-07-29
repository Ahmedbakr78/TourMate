import mongoose from 'mongoose';

const locationStore = new Map();

export function updateDriverLocation(driverId, coordinates, meta = {}) {
  locationStore.set(String(driverId), {
    driverId: String(driverId),
    type: 'Point',
    coordinates,
    heading: meta.heading ?? null,
    speed: meta.speed ?? null,
    tripId: meta.tripId ?? null,
    updatedAt: new Date().toISOString(),
  });
  return locationStore.get(String(driverId));
}

export function getDriverLocation(driverId) {
  return locationStore.get(String(driverId)) || null;
}

export function getLocationsByDrivers(driverIds = []) {
  if (!driverIds.length) {
    return Array.from(locationStore.values());
  }
  return driverIds
    .map((id) => locationStore.get(String(id)))
    .filter(Boolean);
}

export function getActiveTripLocations() {
  return Array.from(locationStore.values()).filter((l) => l.tripId);
}

export function removeDriverLocation(driverId) {
  locationStore.delete(String(driverId));
}

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
