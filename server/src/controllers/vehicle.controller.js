import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../utils/apiError.js';
import { publicUrl, deleteFile } from '../middleware/upload.middleware.js';

export const createVehicle = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.body.driver);
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');

  const vehicle = await Vehicle.create(req.body);
  driver.vehicleIds.push(vehicle._id);
  await driver.save();

  res.status(201).json({ status: 'success', data: vehicle });
});

export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  res.json({ status: 'success', data: vehicle });
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const { type, isActive, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const vehicles = await Vehicle.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ status: 'success', data: vehicles, count: vehicles.length });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  res.json({ status: 'success', data: vehicle });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  await Driver.updateOne({ _id: vehicle.driver }, { $pull: { vehicleIds: vehicle._id } });
  vehicle.images.forEach((img) => deleteFile(img));
  res.json({ status: 'success', message: 'Vehicle deleted' });
});

export const getDriverVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ driver: req.params.driverId });
  res.json({ status: 'success', data: vehicles });
});

export const uploadVehicleImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(httpStatus.UNPROCESSABLE, 'No file uploaded');
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  const url = publicUrl(req, req.file.filename);
  vehicle.images.push(url);
  await vehicle.save();
  res.status(201).json({ status: 'success', data: { url, images: vehicle.images } });
});

export const deleteVehicleImage = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  vehicle.images = vehicle.images.filter((i) => i !== url);
  deleteFile(url);
  await vehicle.save();
  res.json({ status: 'success', data: { images: vehicle.images } });
});
