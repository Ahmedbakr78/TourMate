// In-memory store for driver locations (polling-based, no WebSockets)
// Key: driverId (string), Value: { lat: number, lng: number, tripId: string, timestamp: Date }
class LocationStore {
    private locations: Map<string, { lat: number; lng: number; tripId: string; timestamp: Date }> = new Map();

    setLocation(driverId: string, tripId: string, lat: number, lng: number): void {
        this.locations.set(driverId, { lat, lng, tripId, timestamp: new Date() });
    }

    getLocation(driverId: string): { lat: number; lng: number; tripId: string; timestamp: Date } | undefined {
        return this.locations.get(driverId);
    }

    getTripLocation(tripId: string): { driverId: string; lat: number; lng: number; timestamp: Date } | null {
        for (const [driverId, loc] of this.locations) {
            if (loc.tripId === tripId) return { driverId, ...loc };
        }
        return null;
    }

    removeDriver(driverId: string): void {
        this.locations.delete(driverId);
    }

    getAllLocations(): Map<string, any> {
        return this.locations;
    }
}

export const locationStore = new LocationStore();
