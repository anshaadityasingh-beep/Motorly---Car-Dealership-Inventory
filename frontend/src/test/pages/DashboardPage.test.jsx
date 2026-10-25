import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from '../../pages/DashboardPage';
import * as vehiclesApi from '../../api/vehicles.api';
import * as AuthContextModule from '../../context/AuthContext';

describe('DashboardPage Integration', () => {
  const mockVehicles = [
    {
      id: 'v1',
      make: 'Audi',
      model: 'RS6 Avant',
      category: 'Sedan',
      price: 18500000,
      quantity: 2,
      year: 2024,
    },
    {
      id: 'v2',
      make: 'Porsche',
      model: 'Taycan',
      category: 'Electric',
      price: 16500000,
      quantity: 0,
      year: 2023,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'VIP Buyer', role: 'user' },
      isAdmin: false,
      logout: vi.fn(),
    });
  });

  it('should render loading skeleton and then display vehicle cards', async () => {
    vi.spyOn(vehiclesApi, 'searchVehiclesApi').mockResolvedValueOnce({
      data: mockVehicles,
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Skeleton is displayed initially
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();

    // Vehicles loaded
    await waitFor(() => {
      expect(screen.getByText('Audi RS6 Avant')).toBeInTheDocument();
      expect(screen.getByText('Porsche Taycan')).toBeInTheDocument();
    });
  });

  it('should display empty state when no vehicles match query', async () => {
    vi.spyOn(vehiclesApi, 'searchVehiclesApi').mockResolvedValueOnce({
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no vehicles match your filters/i)).toBeInTheDocument();
    });
  });

  it('should handle purchase click, update vehicle stock, and show success toast', async () => {
    vi.spyOn(vehiclesApi, 'searchVehiclesApi').mockResolvedValue({
      data: [mockVehicles[0]],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });

    vi.spyOn(vehiclesApi, 'purchaseVehicleApi').mockResolvedValueOnce({
      ...mockVehicles[0],
      quantity: 1, // Decremented
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Audi RS6 Avant')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    await userEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(vehiclesApi.purchaseVehicleApi).toHaveBeenCalledWith('v1', 1);
      expect(screen.getByText(/purchase successful/i)).toBeInTheDocument();
      expect(screen.getByText(/only 1 left/i)).toBeInTheDocument();
    });
  });
});
