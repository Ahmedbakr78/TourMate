import { v2 as cloudinary, UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const uploadFileToCloudinary = async (
    file: string,
    options?: UploadApiOptions
): Promise<UploadApiResponse> => {
    return cloudinary.uploader.upload(file, options);
};

export const deleteFileFromCloudinary = async (
    publicId: string
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return cloudinary.uploader.destroy(publicId);
};

export const uploadMultipleFilesToCloudinary = async (
    files: string[],
    options?: UploadApiOptions
): Promise<UploadApiResponse[]> => {
    return Promise.all(
        files.map(file =>
            cloudinary.uploader.upload(file, options)
        )
    );
};

export const deleteMultipleFilesFromCloudinary = async (
    publicIds: string[]
): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> => {
    return Promise.all(
        publicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId)
        )
    );
};
