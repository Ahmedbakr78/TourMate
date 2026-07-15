import mongoose from "mongoose";
import { IVehicle } from "../../common/index.js";

const vehicleSchema = new mongoose.Schema<IVehicle>(
    {
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        vehicleModel: {
            type: String,
            required: true,
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        plateNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        carImages: [
            {
                secure_url: {
                    type: String,
                    required: true
                },
                public_id: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export const vehicleModel = mongoose.model<IVehicle>("Vehicle", vehicleSchema);