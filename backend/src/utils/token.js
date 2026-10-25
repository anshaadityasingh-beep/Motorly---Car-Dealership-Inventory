import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generates a signed JWT for the provided payload.
 * @param {Object} payload - Data to embed in the token (e.g., id, role)
 * @param {string} [expiresIn] - Expiration string (e.g. '7d', '1h')
 * @returns {string} JWT string
 */
export const generateToken = (payload, expiresIn = config.jwtExpiresIn) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn,
  });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws an error if invalid or expired.
 * @param {string} token - JWT string to verify
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
