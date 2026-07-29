import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ITrip, tripStatusEnum } from "../../common/index.js";

const tripSchema = new mongoose.Schema<ITrip>(
    {
        touristId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        places: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place",
                required: true
            }
        ],

        guideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guide"
        },

        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver"
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        peopleCount: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: tripStatusEnum,
            default: tripStatusEnum.ACTIVE
        },

        routePath: {
            type: [[Number]],
            default: []
        },

        sharedTripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },
        isPaid: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

tripSchema.plugin(mongoosePaginate);

export const tripModel = mongoose.model<ITrip, PaginateModel<ITrip>>("Trip", tripSchema);