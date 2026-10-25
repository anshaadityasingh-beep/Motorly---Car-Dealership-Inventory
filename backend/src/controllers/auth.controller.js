import { asyncHandler } from '../middleware/asyncHandler.js';
import * as authService from '../services/auth.service.js';

/**
 * Controller: Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  res.status(201).json(result);
});

/**
 * Controller: Log in an existing user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.status(200).json(result);
});

/**
 * Controller: Get currently logged in user
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ user });
});
