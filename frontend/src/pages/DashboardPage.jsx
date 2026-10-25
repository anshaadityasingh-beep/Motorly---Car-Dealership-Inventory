import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { FilterBar } from '../components/vehicles/FilterBar';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { useVehicles } from '../hooks/useVehicles';
import { purchaseVehicleApi } from '../api/vehicles.api';

export const DashboardPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    includeOutOfStock: false,
  });

  const {
    vehicles,
    total,
    page,
    totalPages,
    isLoading,
    error,
    setPage,
    refetch,
    updateLocalVehicle,
  } = useVehicles(filters);

  const [purchasingId, setPurchasingId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      includeOutOfStock: false,
    });
    setPage(1);
  };

  const handlePurchase = async (vehicle) => {
    if (purchasingId) return; // Prevent double-clicks

    setPurchasingId(vehicle.id);
    try {
      const updated = await purchaseVehicleApi(vehicle.id, 1);
      updateLocalVehicle(updated);
      setToast({
        type: 'success',
        message: `Purchase successful! 1 unit of ${vehicle.make} ${vehicle.model} reserved.`,
      });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to complete purchase. Please try again.';
      setToast({
        type: 'error',
        message,
      });
      refetch(); // Refresh to ensure synchrony
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border border-brand-500/30">
                Live Inventory Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight">
                Curated Luxury & Electric Fleet.
              </h1>
              <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
                Discover exceptional craftsmanship, certified inspection records, and real-time inventory allocation.
              </p>
            </div>

            {/* Quick summary metrics */}
            <div className="flex items-center gap-4 sm:gap-6 bg-slate-800/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-700/80">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-brand-400">
                  {total}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Vehicles
                </p>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">
                  100%
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Verified Stock
                </p>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400">
                  8+
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Search & Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
          onClearFilters={handleClearFilters}
          className="mb-8"
        />

        {/* Loading State: Skeleton Shimmer Grid */}
        {isLoading ? (
          <div
            data-testid="dashboard-skeleton"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm h-96 flex flex-col justify-between p-5 animate-shimmer"
              >
                <div className="w-full h-44 bg-slate-200 rounded-xl mb-4" />
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-7 bg-slate-200 rounded-md w-1/2" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Showroom</h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button variant="primary" size="md" onClick={refetch}>
              Retry Load
            </Button>
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
              No vehicles match your filters
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Try adjusting your price range, clearing filters, or enabling out-of-stock vehicles.
            </p>
            <Button variant="outline" size="md" onClick={handleClearFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : (
          /* Vehicle Cards Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isPurchasing={purchasingId === vehicle.id}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>

                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
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
          </>
        )}
      </main>

      {/* Toast Feedback */}
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
