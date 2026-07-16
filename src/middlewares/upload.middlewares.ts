import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { allowedFileExtensions } from "../common/index.js";

export const hostUpload = (
    allowedTypes: string[],
    maxSize = 5 * 1024 * 1024
) => {

    const storage = multer.diskStorage({

        destination: "uploads/",

        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }

    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const fileType = file.mimetype.split("/")[0];

        if (!allowedTypes.includes(fileType)) {
            return cb(new Error("This file type is not allowed"));
        }

        const extension = path.extname(file.originalname).replace(".", "").toLowerCase();
        const validExtensions = allowedFileExtensions[fileType as keyof typeof allowedFileExtensions];

        if (!validExtensions.includes(extension)) {
            return cb(new Error("Invalid file extension"));
        }
        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSize }
    });

};