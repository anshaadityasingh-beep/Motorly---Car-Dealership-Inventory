import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleCard } from '../../components/vehicles/VehicleCard';

describe('VehicleCard Component', () => {
  const inStockVehicle = {
    id: 'veh-1',
    make: 'BMW',
    model: 'M4 Competition',
    category: 'Coupe',
    price: 15300000,
    quantity: 3,
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
  };

  const soldOutVehicle = {
    ...inStockVehicle,
    id: 'veh-2',
    quantity: 0,
  };

  const singleStockVehicle = {
    ...inStockVehicle,
    id: 'veh-3',
    quantity: 1,
  };

  it('should render vehicle information, category badge, and formatted INR price', () => {
    render(<VehicleCard vehicle={inStockVehicle} onPurchase={vi.fn()} />);

    expect(screen.getByText('BMW M4 Competition')).toBeInTheDocument();
    expect(screen.getByText('Coupe')).toBeInTheDocument();
    expect(screen.getByText(/1,53,00,000/)).toBeInTheDocument(); // INR grouping
    expect(screen.getByText(/in stock: 3/i)).toBeInTheDocument();
  });

  it('should show "Only 1 left" badge when quantity is 1', () => {
    render(<VehicleCard vehicle={singleStockVehicle} onPurchase={vi.fn()} />);

    expect(screen.getByText(/only 1 left/i)).toBeInTheDocument();
  });

  it('should show "Sold out" and disable the Purchase button when quantity is 0', async () => {
    const handlePurchase = vi.fn();
    render(<VehicleCard vehicle={soldOutVehicle} onPurchase={handlePurchase} />);

    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
    const purchaseBtn = screen.getByRole('button', { name: /sold out|purchase/i });
    expect(purchaseBtn).toBeDisabled();

    await userEvent.click(purchaseBtn);
    expect(handlePurchase).not.toHaveBeenCalled();
  });

  it('should enable Purchase button and call onPurchase once on click when in stock', async () => {
    const handlePurchase = vi.fn();
    render(<VehicleCard vehicle={inStockVehicle} onPurchase={handlePurchase} />);

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).toBeEnabled();

    await userEvent.click(purchaseBtn);
    expect(handlePurchase).toHaveBeenCalledTimes(1);
    expect(handlePurchase).toHaveBeenCalledWith(inStockVehicle);
  });
});
