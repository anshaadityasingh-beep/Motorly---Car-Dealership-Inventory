import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../../components/ui/Input';

describe('Input UI Component', () => {
  it('should render label and input element', () => {
    render(<Input label="Email Address" id="email" name="email" />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('should display error message and apply error aria attributes when error is provided', () => {
    render(
      <Input
        label="Password"
        id="password"
        name="password"
        error="Password must be at least 8 characters"
      />
    );

    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('should allow user typing and call onChange', async () => {
    const handleChange = vi.fn();
    render(<Input label="Name" id="name" onChange={handleChange} />);

    const input = screen.getByLabelText(/name/i);
    await userEvent.type(input, 'Antigravity');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Antigravity');
  });
});
