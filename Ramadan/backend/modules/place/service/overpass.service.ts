import { cacheService } from "../../../utils/index.js";

interface OverpassElement {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
}

class OverpassService {
    private cache = cacheService;
    private baseUrl = "https://overpass-api.de/api/interpreter";

    async searchPlaces(query: string, city?: string): Promise<any[]> {
        const cacheKey = `overpass:search:${query}:${city || ""}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const cityFilter = city ? `(area["name"="${city}"]["admin_level"="8"];area["name"="${city}"]["admin_level"="7"];)` : "";
        const ql = `[out:json];${cityFilter}(node["tourism"~"${query}|attraction|museum|gallery", i];node["historic"~"${query}|monument|castle|ruins", i];node["leisure"~"${query}|park|garden", i];node["amenity"~"${query}|fountain|theatre", i];);out center 10;`;

        try {
            const res = await fetch(this.baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `data=${encodeURIComponent(ql)}`
            });
            const data = await res.json() as { elements: OverpassElement[] };
            const places = (data.elements || []).map((el: OverpassElement) => ({
                osmId: `${el.type}/${el.id}`,
                name: el.tags?.name || el.tags?.tourism || el.tags?.historic || "Unknown",
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                type: el.type,
                tags: el.tags
            }));
            this.cache.set(cacheKey, places, 3600);
            return places;
        } catch (err) {
            console.error("Overpass API error:", err);
            return [];
        }
    }

    async getNearbyPlaces(lat: number, lng: number, radius: number = 1000): Promise<any[]> {
        const cacheKey = `overpass:nearby:${lat}:${lng}:${radius}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const ql = `[out:json];(node["tourism"](around:${radius},${lat},${lng});node["historic"](around:${radius},${lat},${lng});node["leisure"](around:${radius},${lat},${lng}););out center 10;`;

        try {
            const res = await fetch(this.baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `data=${encodeURIComponent(ql)}`
            });
            const data = await res.json() as { elements: OverpassElement[] };
            const places = (data.elements || []).map((el: OverpassElement) => ({
                osmId: `${el.type}/${el.id}`,
                name: el.tags?.name || el.tags?.tourism || el.tags?.historic || "Unknown",
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                type: el.type,
                tags: el.tags
            }));
            this.cache.set(cacheKey, places, 3600);
            return places;
        } catch (err) {
            console.error("Overpass API error:", err);
            return [];
        }
    }
}

export default new OverpassService();
