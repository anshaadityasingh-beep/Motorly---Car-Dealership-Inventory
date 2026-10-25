import { asyncHandler } from '../middleware/asyncHandler.js';
import * as vehicleService from '../services/vehicle.service.js';

/**
 * Controller: Add a new vehicle (Admin only)
 */
export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(201).json(vehicle);
});

/**
 * Controller: List all vehicles with pagination
 */
export const getVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleService.getVehicles(req.query);
  res.status(200).json(result);
});

/**
 * Controller: Search vehicles with filters and sorting
 */
export const searchVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleService.searchVehicles(req.query);
  res.status(200).json(result);
});

/**
 * Controller: Get single vehicle details
 */
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  res.status(200).json(vehicle);
});

/**
 * Controller: Update vehicle details (Admin only)
 */
export const updateVehicle = asyncHandler(async (req, res) => {
  const updatedVehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  res.status(200).json(updatedVehicle);
});

/**
 * Controller: Delete vehicle (Admin only)
 */
export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id);
  res.status(204).send();
});
