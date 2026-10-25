import mongoose from 'mongoose';
import { Vehicle } from '../models/vehicle.model.js';
import { ApiError } from '../utils/ApiError.js';
import { buildVehicleQuery, buildVehicleSort } from '../utils/queryBuilder.js';

/**
 * Creates a new vehicle record.
 * @param {Object} vehicleData
 * @returns {Promise<Object>}
 */
export const createVehicle = async (vehicleData) => {
  const vehicle = await Vehicle.create(vehicleData);
  return vehicle.toJSON();
};

/**
 * Lists vehicles with pagination and optional out-of-stock inclusion.
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string|boolean} [options.includeOutOfStock=false]
 * @returns {Promise<{data: Array, page: number, limit: number, total: number, totalPages: number}>}
 */
export const getVehicles = async ({ page = 1, limit = 10, includeOutOfStock = false }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (includeOutOfStock !== 'true' && includeOutOfStock !== true) {
    filter.quantity = { $gt: 0 };
  }

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Vehicle.countDocuments(filter),
  ]);

  return {
    data: vehicles.map((v) => v.toJSON()),
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Searches vehicles by make, model, category, price range, and sort option.
 * @param {Object} queryParams
 * @returns {Promise<{data: Array, page: number, limit: number, total: number, totalPages: number}>}
 */
export const searchVehicles = async (queryParams = {}) => {
  const pageNum = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(queryParams.limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = buildVehicleQuery(queryParams);
  const sort = buildVehicleSort(queryParams.sort);

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(skip).limit(limitNum),
    Vehicle.countDocuments(filter),
  ]);

  return {
    data: vehicles.map((v) => v.toJSON()),
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Retrieves a single vehicle by its ID.
 * @param {string} id - Mongo ObjectId
 * @returns {Promise<Object>}
 */
export const getVehicleById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid vehicle ID format');
  }

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return vehicle.toJSON();
};

/**
 * Updates an existing vehicle's attributes.
 * @param {string} id - Mongo ObjectId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export const updateVehicle = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid vehicle ID format');
  }

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  Object.assign(vehicle, updateData);
  await vehicle.save();

  return vehicle.toJSON();
};

/**
 * Deletes a vehicle by its ID.
 * @param {string} id - Mongo ObjectId
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid vehicle ID format');
  }

  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }
};
