import { axiosClient } from './axiosClient';

/**
 * Register a new user account.
 * @param {Object} data - { name, email, password }
 * @returns {Promise<{user: Object, token: string}>}
 */
export const registerApi = async (data) => {
  const response = await axiosClient.post('/auth/register', data);
  return response.data;
};

/**
 * Log in an existing user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{user: Object, token: string}>}
 */
export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Retrieve current user profile.
 * @returns {Promise<{user: Object}>}
 */
export const getMeApi = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};
