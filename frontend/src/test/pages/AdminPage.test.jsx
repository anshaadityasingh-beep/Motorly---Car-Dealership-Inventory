import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminPage } from '../../pages/AdminPage';
import * as vehiclesApi from '../../api/vehicles.api';
import * as AuthContextModule from '../../context/AuthContext';

describe('AdminPage Integration Tests', () => {
  const mockVehicles = [
    {
      id: 'v1',
      make: 'Tesla',
      model: 'Model S Plaid',
      category: 'Electric',
      price: 12500000,
      quantity: 3,
      year: 2024,
    },
    {
      id: 'v2',
      make: 'Range Rover',
      model: 'Autobiography',
      category: 'SUV',
      price: 25000000,
      quantity: 1,
      year: 2023,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'Admin Manager', role: 'admin' },
      isAdmin: true,
      logout: vi.fn(),
    });
  });

  it('should render inventory table with vehicle rows and action buttons', async () => {
    vi.spyOn(vehiclesApi, 'getVehiclesApi').mockResolvedValueOnce({
      data: mockVehicles,
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tesla Model S Plaid')).toBeInTheDocument();
      expect(screen.getByText('Range Rover Autobiography')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /edit/i }).length).toBe(2);
      expect(screen.getAllByRole('button', { name: /restock/i }).length).toBe(2);
      expect(screen.getAllByRole('button', { name: /delete/i }).length).toBe(2);
    });
  });

  it('should open confirm delete dialog and delete vehicle when confirmed', async () => {
    vi.spyOn(vehiclesApi, 'getVehiclesApi').mockResolvedValue({
      data: mockVehicles,
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    });

    const deleteSpy = vi.spyOn(vehiclesApi, 'deleteVehicleApi').mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tesla Model S Plaid')).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteBtns[0]); // Click delete on first vehicle

    // Confirm dialog appears
    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tesla Model S Plaid/i).length).toBe(2);

    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('v1');
    });
  });

  it('should open restock dialog and restock vehicle', async () => {
    vi.spyOn(vehiclesApi, 'getVehiclesApi').mockResolvedValue({
      data: mockVehicles,
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    });

    const restockSpy = vi.spyOn(vehiclesApi, 'restockVehicleApi').mockResolvedValueOnce({
      ...mockVehicles[0],
      quantity: 8,
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tesla Model S Plaid')).toBeInTheDocument();
    });

    const restockBtns = screen.getAllByRole('button', { name: /restock/i });
    await userEvent.click(restockBtns[0]);

    expect(screen.getByText(/restock vehicle/i)).toBeInTheDocument();

    const qtyInput = screen.getByLabelText(/quantity to add/i);
    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '5');

    const submitBtn = screen.getByRole('button', { name: /add stock/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(restockSpy).toHaveBeenCalledWith('v1', 5);
    });
  });
});
