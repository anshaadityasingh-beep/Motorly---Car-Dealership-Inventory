import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '../../components/vehicles/FilterBar';

describe('FilterBar Component', () => {
  const defaultFilters = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    includeOutOfStock: false,
  };

  it('should render all filter inputs and controls', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} onClearFilters={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search make or model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/include sold out/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('should emit onFilterChange when category or sort selection changes', async () => {
    const handleFilterChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={handleFilterChange} onClearFilters={vi.fn()} />);

    const categorySelect = screen.getByLabelText(/category/i);
    await userEvent.selectOptions(categorySelect, 'SUV');

    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'SUV' })
    );

    const sortSelect = screen.getByLabelText(/sort by/i);
    await userEvent.selectOptions(sortSelect, 'price_asc');

    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'price_asc' })
    );
  });

  it('should call onClearFilters when Clear filters button is clicked', async () => {
    const handleClear = vi.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} onClearFilters={handleClear} />);

    const clearBtn = screen.getByRole('button', { name: /clear filters/i });
    await userEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
