import { Router } from 'express';
import { body, param } from 'express-validator';
import * as vehicleController from '../controllers/vehicle.controller.js';
import * as inventoryController from '../controllers/inventory.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { VEHICLE_CATEGORIES } from '../constants/vehicleCategories.js';

const router = Router();

const vehicleValidationRules = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Make is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VEHICLE_CATEGORIES)
    .withMessage(`Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid calendar year'),
  body('imageUrl')
    .optional()
    .trim(),
  validate,
];

const vehicleUpdateValidationRules = [
  body('make')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Make cannot be empty'),
  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty'),
  body('category')
    .optional()
    .trim()
    .isIn(VEHICLE_CATEGORIES)
    .withMessage(`Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid calendar year'),
  body('imageUrl')
    .optional()
    .trim(),
  validate,
];

const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vehicle ID format'),
  validate,
];

const purchaseValidationRules = [
  ...idParamValidation,
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than or equal to 1'),
  validate,
];

const restockValidationRules = [
  ...idParamValidation,
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Quantity must be an integer between 1 and 10000'),
  validate,
];

// All vehicle endpoints require authentication
router.use(authenticate);

// Create a vehicle (Admin only)
router.post(
  '/',
  authorizeRoles('admin'),
  vehicleValidationRules,
  vehicleController.createVehicle
);

// List vehicles
router.get('/', vehicleController.getVehicles);

// Search vehicles (MUST be declared before /:id)
router.get('/search', vehicleController.searchVehicles);

// Purchase vehicle (decrement stock)
router.post(
  '/:id/purchase',
  purchaseValidationRules,
  inventoryController.purchaseVehicle
);

// Restock vehicle (increment stock, Admin only)
router.post(
  '/:id/restock',
  authorizeRoles('admin'),
  restockValidationRules,
  inventoryController.restockVehicle
);

// Get single vehicle by ID
router.get('/:id', idParamValidation, vehicleController.getVehicleById);

// Update vehicle (Admin only)
router.put(
  '/:id',
  authorizeRoles('admin'),
  idParamValidation,
  vehicleUpdateValidationRules,
  vehicleController.updateVehicle
);

// Delete vehicle (Admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  idParamValidation,
  vehicleController.deleteVehicle
);

export default router;
