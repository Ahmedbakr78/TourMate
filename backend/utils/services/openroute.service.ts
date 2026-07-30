class OpenRouteService {
    private baseUrl = "https://api.openrouteservice.org/v2";

    async getRoute(
        origin: [number, number],
        destination: [number, number],
        profile: string = "driving-car",
    ): Promise<{
        distance: number;
        duration: number;
        geometry: any;
        waypoints: any[];
    }> {
        const url = `${this.baseUrl}/directions/${profile}?start=${origin.join(",")}&end=${destination.join(",")}`;

        const response = await fetch(url);

        if (response.status === 401) {
            return this.fallbackToOSRM(origin, destination);
        }

        if (!response.ok) {
            return this.fallbackToOSRM(origin, destination);
        }

        const data = await response.json();

        const route = data.features?.[0];
        if (!route) {
            return this.fallbackToOSRM(origin, destination);
        }

        const summary = route.properties?.segments?.[0] || {};
        return {
            distance: summary.distance || 0,
            duration: summary.duration || 0,
            geometry: route.geometry,
            waypoints: [
                { location: origin },
                ...(route.properties?.segments?.[0]?.steps?.map((s: any) => ({ location: s.way_points })) || []),
                { location: destination },
            ],
        };
    }

    private async fallbackToOSRM(
        origin: [number, number],
        destination: [number, number],
    ): Promise<{
        distance: number;
        duration: number;
        geometry: any;
        waypoints: any[];
    }> {
        const { default: osrmService } = await import("./osrm.service.js");
        return osrmService.getRoute([origin, destination]);
    }
}

export default new OpenRouteService();