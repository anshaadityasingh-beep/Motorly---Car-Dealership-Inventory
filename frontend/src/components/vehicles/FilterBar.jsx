import React from 'react';
import { Button } from '../ui/Button';

const CATEGORIES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Truck',
  'Van',
  'Electric',
];

export const FilterBar = ({ filters, onFilterChange, onClearFilters, className = '' }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div
      className={`bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-sm transition-all duration-300 ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Search input (make / model) */}
        <div className="lg:col-span-4">
          <label htmlFor="filter-search" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Search Inventory
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="filter-search"
              type="text"
              placeholder="Search make or model (e.g. BMW, Model 3)..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Category selector */}
        <div className="lg:col-span-2">
          <label htmlFor="filter-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range: Min & Max */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="filter-minPrice" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Min Price (₹)
            </label>
            <input
              id="filter-minPrice"
              type="number"
              placeholder="Min price"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="filter-maxPrice" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Max Price (₹)
            </label>
            <input
              id="filter-maxPrice"
              type="number"
              placeholder="Max price"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="lg:col-span-2">
          <label htmlFor="filter-sort" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sort || 'newest'}
            onChange={(e) => handleInputChange('sort', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="lg:col-span-1">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClearFilters}
            className="w-full border border-slate-200 hover:border-slate-300 text-slate-600"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Out-of-stock toggle */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <label htmlFor="filter-outOfStock" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="filter-outOfStock"
            checked={Boolean(filters.includeOutOfStock)}
            onChange={(e) => handleInputChange('includeOutOfStock', e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 transition"
          />
          <span className="font-medium text-slate-700">Include sold out vehicles</span>
        </label>
      </div>
    </div>
  );
};
