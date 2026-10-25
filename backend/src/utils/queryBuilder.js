import { ApiError } from './ApiError.js';

/**
 * Escapes regex special characters in user input.
 * @param {string} string
 * @returns {string}
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Builds a Mongoose query filter object from search parameters.
 * @param {Object} filters
 * @param {string} [filters.make]
 * @param {string} [filters.model]
 * @param {string} [filters.category]
 * @param {string|number} [filters.minPrice]
 * @param {string|number} [filters.maxPrice]
 * @param {string|boolean} [filters.includeOutOfStock]
 * @returns {Object} Mongoose filter query
 */
export const buildVehicleQuery = (filters = {}) => {
  const query = {};

  // Stock filter: hide out of stock (quantity <= 0) unless explicitly requested
  if (filters.includeOutOfStock !== 'true' && filters.includeOutOfStock !== true) {
    query.quantity = { $gt: 0 };
  }

  // Case-insensitive partial matching for make and model
  if (filters.make && typeof filters.make === 'string' && filters.make.trim()) {
    query.make = new RegExp(escapeRegex(filters.make.trim()), 'i');
  }

  if (filters.model && typeof filters.model === 'string' && filters.model.trim()) {
    query.model = new RegExp(escapeRegex(filters.model.trim()), 'i');
  }

  // Exact category match
  if (filters.category && typeof filters.category === 'string' && filters.category.trim()) {
    query.category = filters.category.trim();
  }

  // Numeric price range
  const hasMin = filters.minPrice !== undefined && filters.minPrice !== '';
  const hasMax = filters.maxPrice !== undefined && filters.maxPrice !== '';

  if (hasMin || hasMax) {
    const min = hasMin ? Number(filters.minPrice) : undefined;
    const max = hasMax ? Number(filters.maxPrice) : undefined;

    if (hasMin && isNaN(min)) {
      throw new ApiError(400, 'minPrice must be a valid number');
    }
    if (hasMax && isNaN(max)) {
      throw new ApiError(400, 'maxPrice must be a valid number');
    }

    if (hasMin && hasMax && min > max) {
      throw new ApiError(400, 'minPrice cannot be greater than maxPrice');
    }

    query.price = {};
    if (hasMin) query.price.$gte = min;
    if (hasMax) query.price.$lte = max;
  }

  return query;
};

/**
 * Builds Mongoose sort specification from sort string.
 * @param {string} [sortOption] - 'price_asc', 'price_desc', or 'newest'
 * @returns {Object} Mongoose sort object
 */
export const buildVehicleSort = (sortOption) => {
  switch (sortOption) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};
