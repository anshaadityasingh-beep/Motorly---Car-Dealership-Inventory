import { asyncHandler } from '../middleware/asyncHandler.js';
import * as inventoryService from '../services/inventory.service.js';

/**
 * Controller: Purchase vehicle (atomically decrements stock)
 */
export const purchaseVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quantity = req.body.quantity !== undefined ? req.body.quantity : 1;
  const updatedVehicle = await inventoryService.purchaseVehicle(id, quantity);
  res.status(200).json(updatedVehicle);
});

/**
 * Controller: Restock vehicle (Admin only, atomically increments stock)
 */
export const restockVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const updatedVehicle = await inventoryService.restockVehicle(id, quantity);
  res.status(200).json(updatedVehicle);
});
