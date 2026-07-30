export interface IGeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat] - GeoJSON order, matches backend 2dsphere index
}
