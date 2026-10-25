import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/ui/Button';

describe('Button UI Component', () => {
  it('should render children and handle click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true and not trigger onClick', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should display spinner and disable button when isLoading is true', async () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
