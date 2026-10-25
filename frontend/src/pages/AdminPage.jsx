import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { VehicleForm } from '../components/admin/VehicleForm';
import { formatCurrencyINR } from '../components/vehicles/VehicleCard';
import { getVehiclesApi } from '../api/vehicles.api';
import { useVehicleMutations } from '../hooks/useVehicleMutations';

export const AdminPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal Dialog States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [restockVehicleTarget, setRestockVehicleTarget] = useState(null);
  const [restockQty, setRestockQty] = useState('5');
  const [restockError, setRestockError] = useState('');

  const [deleteVehicleTarget, setDeleteVehicleTarget] = useState(null);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getVehiclesApi({ page, limit: 10, includeOutOfStock: true });
      setVehicles(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load inventory.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const {
    createVehicle,
    updateVehicle,
    deleteVehicle,
    restockVehicle,
    isMutating,
    mutationError,
    clearError,
  } = useVehicleMutations({
    onSuccess: (msg) => {
      setToast({ type: 'success', message: msg });
      setIsFormModalOpen(false);
      setEditingVehicle(null);
      setRestockVehicleTarget(null);
      setDeleteVehicleTarget(null);
      fetchInventory();
    },
    onError: (err) => {
      setToast({ type: 'error', message: err });
    },
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    clearError();
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    clearError();
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data);
    } else {
      await createVehicle(data);
    }
  };

  const handleOpenRestock = (vehicle) => {
    setRestockVehicleTarget(vehicle);
    setRestockQty('5');
    setRestockError('');
  };

  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    const qty = Number(restockQty);
    if (!Number.isInteger(qty) || qty < 1) {
      setRestockError('Quantity must be an integer of 1 or greater');
      return;
    }
    if (qty > 10000) {
      setRestockError('Quantity cannot exceed 10,000 units');
      return;
    }

    await restockVehicle(restockVehicleTarget.id, qty);
  };

  const handleOpenDelete = (vehicle) => {
    setDeleteVehicleTarget(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (!deleteVehicleTarget) return;
    await deleteVehicle(deleteVehicleTarget.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning" size="sm">
                ADMINISTRATION
              </Badge>
              <span className="text-xs text-slate-500 font-semibold">
                {total} Total Vehicles Tracked
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Vehicle Inventory Control
            </h1>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenAdd} className="shadow-lg">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Vehicle
          </Button>
        </div>

        {/* Inventory Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading inventory records...</div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No vehicles found in database. Click "Add New Vehicle" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=150&q=80'}
                            alt={`${v.make} ${v.model}`}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900 font-display">
                              {v.make} {v.model}
                            </p>
                            <p className="text-xs text-slate-400">Year: {v.year || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="default" size="sm">
                          {v.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 font-display">
                        {formatCurrencyINR(v.price)}
                      </td>
                      <td className="py-4 px-4">
                        {v.quantity <= 0 ? (
                          <Badge variant="danger" size="sm">
                            Sold out (0)
                          </Badge>
                        ) : v.quantity === 1 ? (
                          <Badge variant="warning" size="sm">
                            Only 1 left
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            {v.quantity} units
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(v)}
                            className="text-slate-700 hover:text-brand-600 border border-slate-200 hover:border-slate-300"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRestock(v)}
                            className="text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
                          >
                            Restock
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDelete(v)}
                            className="text-rose-600 hover:text-rose-700 border border-rose-200 hover:bg-rose-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle Details' : 'Add New Showroom Vehicle'}
        maxWidth="max-w-xl"
      >
        <VehicleForm
          initialData={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={isMutating}
          serverError={mutationError}
        />
      </Modal>

      {/* Restock Dialog Modal */}
      <Modal
        isOpen={Boolean(restockVehicleTarget)}
        onClose={() => setRestockVehicleTarget(null)}
        title="Restock Vehicle"
        maxWidth="max-w-md"
      >
        {restockVehicleTarget && (
          <form onSubmit={handleConfirmRestock} className="space-y-4">
            <p className="text-sm text-slate-600">
              Add inventory stock units for{' '}
              <strong className="text-slate-900 font-semibold">
                {restockVehicleTarget.make} {restockVehicleTarget.model}
              </strong>
              .
            </p>

            <div>
              <label htmlFor="restockQty" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity to Add
              </label>
              <input
                id="restockQty"
                type="number"
                min="1"
                max="10000"
                value={restockQty}
                onChange={(e) => {
                  setRestockQty(e.target.value);
                  if (restockError) setRestockError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500"
              />
              {restockError && (
                <p className="text-xs text-rose-600 font-medium mt-1">{restockError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setRestockVehicleTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isMutating}>
                Add Stock
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteVehicleTarget)}
        onClose={() => setDeleteVehicleTarget(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        {deleteVehicleTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 font-bold">
                {deleteVehicleTarget.make} {deleteVehicleTarget.model}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setDeleteVehicleTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                isLoading={isMutating}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
