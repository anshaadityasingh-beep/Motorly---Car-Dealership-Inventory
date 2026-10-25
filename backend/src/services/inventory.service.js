import mongoose from 'mongoose';
import { Vehicle } from '../models/vehicle.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates that an inventory quantity is a positive integer within bounds.
 * @param {*} qty - The input quantity
 * @param {number} [max=10000] - Upper bound
 * @returns {number} The parsed integer quantity
 */
export const validateQuantity = (qty, max = 10000) => {
  const parsed = Number(qty);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ApiError(400, 'Quantity must be a positive integer greater than or equal to 1');
  }
  if (parsed > max) {
    throw new ApiError(400, `Quantity cannot exceed ${max}`);
  }
  return parsed;
};

/**
 * Safely and atomically purchases a vehicle, decrementing stock.
 * Prevents race conditions and overselling using conditional update.
 * @param {string} vehicleId - Mongo ObjectId
 * @param {number} [quantity=1] - Quantity to purchase
 * @returns {Promise<Object>} Updated vehicle
 */
export const purchaseVehicle = async (vehicleId, quantity = 1) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new ApiError(400, 'Invalid vehicle ID format');
  }

  const qty = validateQuantity(quantity);

  // Atomic conditional update: only decrement if quantity >= qty
  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  );

  if (!updatedVehicle) {
    // Check whether vehicle exists to distinguish 404 from 409
    const vehicleExists = await Vehicle.findById(vehicleId);
    if (!vehicleExists) {
      throw new ApiError(404, 'Vehicle not found');
    }
    throw new ApiError(
      409,
      `Insufficient stock: requested ${qty}, but only ${vehicleExists.quantity} available`
    );
  }

  return updatedVehicle.toJSON();
};

/**
 * Atomically restocks a vehicle, incrementing stock.
 * @param {string} vehicleId - Mongo ObjectId
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Updated vehicle
 */
export const restockVehicle = async (vehicleId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new ApiError(400, 'Invalid vehicle ID format');
  }

  const qty = validateQuantity(quantity);

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId },
    { $inc: { quantity: qty } },
    { new: true }
  );

  if (!updatedVehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return updatedVehicle.toJSON();
};
