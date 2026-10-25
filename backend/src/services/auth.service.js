import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/token.js';

/**
 * Registers a new standard user account.
 * Note: Role is intentionally forced to 'user' to prevent privilege escalation.
 * @param {Object} userData - Registration parameters
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<{user: Object, token: string}>}
 */
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user', // strictly default to 'user'
  });

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Authenticates user credentials and issues a JWT.
 * Returns generic error message on any failure to prevent enumeration.
 * @param {Object} credentials - Login parameters
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{user: Object, token: string}>}
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Retrieves the current authenticated user's profile.
 * @param {string} userId - Mongo ID of the user
 * @returns {Promise<Object>}
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toJSON();
};
