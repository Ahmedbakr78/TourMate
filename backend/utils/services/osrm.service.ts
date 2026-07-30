class OSRMService {
    private baseUrl = "https://router.project-osrm.org";

    async getRoute(coordinates: [number, number][]): Promise<{
        distance: number;
        duration: number;
        geometry: any;
        waypoints: any[];
    }> {
        if (coordinates.length < 2) {
            throw new Error("At least two coordinates are required");
        }

        const coordsStr = coordinates.map(c => `${c[0]},${c[1]}`).join(";");
        const url = `${this.baseUrl}/route/v1/driving/${coordsStr}?geometries=geojson&overview=full`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`OSRM request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.code !== "Ok") {
            throw new Error(`OSRM error: ${data.message || data.code}`);
        }

        const route = data.routes[0];
        return {
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry,
            waypoints: data.waypoints,
        };
    }

    async getRouteWithWaypoints(
        origin: [number, number],
        destination: [number, number],
        waypoints?: [number, number][],
    ): Promise<{
        distance: number;
        duration: number;
        geometry: any;
        waypoints: any[];
    }> {
        const coords = [origin, ...(waypoints || []), destination];
        return this.getRoute(coords);
    }
}

export default new OSRMService();