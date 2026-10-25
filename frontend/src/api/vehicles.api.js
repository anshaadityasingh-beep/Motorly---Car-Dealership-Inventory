import { axiosClient } from './axiosClient';

/**
 * Fetch paginated list of vehicles.
 * @param {Object} [params] - { page, limit, includeOutOfStock }
 */
export const getVehiclesApi = async (params = {}) => {
  const response = await axiosClient.get('/vehicles', { params });
  return response.data;
};

/**
 * Search vehicles with filters and sorting.
 * @param {Object} [params] - { make, model, category, minPrice, maxPrice, sort, page, limit, includeOutOfStock }
 */
export const searchVehiclesApi = async (params = {}) => {
  const response = await axiosClient.get('/vehicles/search', { params });
  return response.data;
};

/**
 * Get vehicle by ID.
 * @param {string} id
 */
export const getVehicleByIdApi = async (id) => {
  const response = await axiosClient.get(`/vehicles/${id}`);
  return response.data;
};

/**
 * Create a new vehicle (Admin only).
 * @param {Object} vehicleData
 */
export const createVehicleApi = async (vehicleData) => {
  const response = await axiosClient.post('/vehicles', vehicleData);
  return response.data;
};

/**
 * Update an existing vehicle (Admin only).
 * @param {string} id
 * @param {Object} vehicleData
 */
export const updateVehicleApi = async (id, vehicleData) => {
  const response = await axiosClient.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

/**
 * Delete a vehicle (Admin only).
 * @param {string} id
 */
export const deleteVehicleApi = async (id) => {
  const response = await axiosClient.delete(`/vehicles/${id}`);
  return response.data;
};

/**
 * Purchase a vehicle (decrease stock).
 * @param {string} id
 * @param {number} [quantity=1]
 */
export const purchaseVehicleApi = async (id, quantity = 1) => {
  const response = await axiosClient.post(`/vehicles/${id}/purchase`, { quantity });
  return response.data;
};

/**
 * Restock a vehicle (increase stock, Admin only).
 * @param {string} id
 * @param {number} quantity
 */
export const restockVehicleApi = async (id, quantity) => {
  const response = await axiosClient.post(`/vehicles/${id}/restock`, { quantity });
  return response.data;
};
