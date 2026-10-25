import { useState, useEffect, useCallback } from 'react';
import { searchVehiclesApi } from '../api/vehicles.api';
import { useDebounce } from './useDebounce';

/**
 * Custom hook to manage vehicle inventory fetching, pagination, and debounced filters.
 * @param {Object} filters
 */
export const useVehicles = (filters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filters.search || '', 300);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 9,
        ...(debouncedSearch ? { make: debouncedSearch } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
        ...(filters.sort ? { sort: filters.sort } : { sort: 'newest' }),
        ...(filters.includeOutOfStock ? { includeOutOfStock: 'true' } : {}),
      };

      const result = await searchVehiclesApi(params);
      setVehicles(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicle inventory.');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.includeOutOfStock,
  ]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Update a vehicle in local state (e.g. after purchase or restock)
  const updateLocalVehicle = useCallback((updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  }, []);

  return {
    vehicles,
    total,
    page,
    totalPages,
    isLoading,
    error,
    setPage,
    refetch: fetchVehicles,
    updateLocalVehicle,
  };
};
