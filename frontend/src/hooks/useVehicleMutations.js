import { useState } from 'react';
import {
  createVehicleApi,
  updateVehicleApi,
  deleteVehicleApi,
  restockVehicleApi,
} from '../api/vehicles.api';

/**
 * Custom hook managing administrative mutations on vehicles.
 */
export const useVehicleMutations = ({ onSuccess, onError }) => {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  const createVehicle = async (vehicleData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const created = await createVehicleApi(vehicleData);
      if (onSuccess) onSuccess('Vehicle added successfully!', created);
      return created;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add vehicle.';
      setMutationError(msg);
      if (onError) onError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const updated = await updateVehicleApi(id, vehicleData);
      if (onSuccess) onSuccess('Vehicle updated successfully!', updated);
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update vehicle.';
      setMutationError(msg);
      if (onError) onError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteVehicle = async (id) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await deleteVehicleApi(id);
      if (onSuccess) onSuccess('Vehicle deleted successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle.';
      setMutationError(msg);
      if (onError) onError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const restockVehicle = async (id, quantity) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const restocked = await restockVehicleApi(id, quantity);
      if (onSuccess) onSuccess(`Restocked ${quantity} units successfully!`, restocked);
      return restocked;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to restock vehicle.';
      setMutationError(msg);
      if (onError) onError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    createVehicle,
    updateVehicle,
    deleteVehicle,
    restockVehicle,
    isMutating,
    mutationError,
    clearError: () => setMutationError(null),
  };
};
