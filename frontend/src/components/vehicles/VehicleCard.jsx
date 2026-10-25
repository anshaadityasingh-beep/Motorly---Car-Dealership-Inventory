import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Fallback high-res automotive placeholder
const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

/**
 * Formats monetary amounts according to Indian Rupee (INR) conventions.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const VehicleCard = ({
  vehicle,
  onPurchase,
  isPurchasing = false,
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState(vehicle.imageUrl || DEFAULT_CAR_IMAGE);
  const isSoldOut = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity === 1;

  return (
    <Card hoverable className={`overflow-hidden flex flex-col h-full ${className}`}>
      {/* Vehicle Media Image */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-900 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_CAR_IMAGE)}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            isSoldOut ? 'grayscale contrast-75 opacity-70' : ''
          }`}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <Badge variant="dark" size="sm" className="shadow-md backdrop-blur-md bg-slate-950/80">
            {vehicle.category}
          </Badge>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <Badge variant="danger" size="sm" className="shadow-md">
              Sold out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="sm" className="shadow-md animate-pulse">
              Only 1 left!
            </Badge>
          ) : (
            <Badge variant="success" size="sm" className="shadow-md">
              In stock: {vehicle.quantity}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold font-display text-slate-900 tracking-tight line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.year && (
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                {vehicle.year}
              </span>
            )}
          </div>

          <p className="text-2xl font-extrabold font-display text-brand-700 tracking-tight mt-2">
            {formatCurrencyINR(vehicle.price)}
          </p>
        </div>

        {/* Card Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isSoldOut ? (
              <span className="text-rose-600 font-medium">Currently unavailable</span>
            ) : (
              <span>Ready for immediate handover</span>
            )}
          </div>

          <Button
            variant={isSoldOut ? 'outline' : 'primary'}
            size="md"
            disabled={isSoldOut || isPurchasing}
            isLoading={isPurchasing}
            onClick={() => onPurchase(vehicle)}
            aria-disabled={isSoldOut ? 'true' : 'false'}
          >
            {isSoldOut ? 'Sold out' : 'Purchase'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
