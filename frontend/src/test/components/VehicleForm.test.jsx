import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleForm } from '../../components/admin/VehicleForm';

describe('VehicleForm Component', () => {
  it('should validate required fields when submitting empty form in create mode', async () => {
    const handleSubmit = vi.fn();
    render(<VehicleForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /save vehicle|create vehicle/i }));

    expect(screen.getByText(/make is required/i)).toBeInTheDocument();
    expect(screen.getByText(/model is required/i)).toBeInTheDocument();
    expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should prefill data in edit mode and submit modified fields', async () => {
    const initialData = {
      id: 'v123',
      make: 'Mercedes-Benz',
      model: 'E-Class',
      category: 'Sedan',
      price: 7500000,
      quantity: 4,
      year: 2023,
      imageUrl: 'https://example.com/car.jpg',
    };

    const handleSubmit = vi.fn();
    render(
      <VehicleForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/make/i)).toHaveValue('Mercedes-Benz');
    expect(screen.getByLabelText(/model/i)).toHaveValue('E-Class');
    expect(screen.getByLabelText(/category/i)).toHaveValue('Sedan');
    expect(screen.getByLabelText(/price/i)).toHaveValue(7500000);

    // Modify price
    const priceInput = screen.getByLabelText(/price/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '7800000');

    await userEvent.click(screen.getByRole('button', { name: /save vehicle|update vehicle/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          make: 'Mercedes-Benz',
          model: 'E-Class',
          category: 'Sedan',
          price: 7800000,
        })
      );
    });
  });
});
