import { placeModel } from "../../db/index.js";

class TripPriceService {

    static async calculateTripPrice(
        places: string[],
        startDate: Date | string,
        endDate: Date | string,
        peopleCount: number,
        guideId?: string,
        driverId?: string,
        vehicleId?: string
    ): Promise<number> {

        const days = Math.max(
            1,
            Math.ceil(
                (
                    new Date(endDate).getTime() -
                    new Date(startDate).getTime()
                ) /
                (1000 * 60 * 60 * 24)
            )
        );

        let price = 0;

        const placesData = await placeModel.find({
            _id: { $in: places }
        });

        for (const place of placesData) {
            price += (place.price ?? 0) * peopleCount;
        }

        if (guideId) price += 100 * days;

        if (driverId) price += 80 * days;

        if (vehicleId) price += 60 * days;

        return Math.round(price);
    }
}

export default TripPriceService;