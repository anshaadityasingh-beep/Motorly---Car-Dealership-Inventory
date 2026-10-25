import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import * as AuthContextModule from '../../context/AuthContext';

describe('Auth Pages (Login and Register)', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockLogin.mockReset();
    mockRegister.mockReset();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
    });
  });

  describe('LoginPage', () => {
    it('should display client-side validation errors when submitting empty form', async () => {
      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      await userEvent.click(screen.getByRole('button', { name: /sign in|log in/i }));

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should submit login credentials and redirect on success', async () => {
      mockLogin.mockResolvedValueOnce({ user: { name: 'Test' } });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Dashboard Home</div>} />
          </Routes>
        </MemoryRouter>
      );

      await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'Password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in|log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'Password123');
        expect(screen.getByText('Dashboard Home')).toBeInTheDocument();
      });
    });

    it('should display server error message when login fails', async () => {
      mockLogin.mockRejectedValueOnce({
        response: { data: { message: 'Invalid email or password' } },
      });

      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'WrongPassword');
      await userEvent.click(screen.getByRole('button', { name: /sign in|log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });
  });

  describe('RegisterPage', () => {
    it('should validate password rules (length and numeric requirement)', async () => {
      render(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );

      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'short');
      await userEvent.click(screen.getByRole('button', { name: /create account|register/i }));

      expect(
        screen.getByText(/password must be at least 8 characters and contain a number/i)
      ).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should call register and navigate to dashboard on successful registration', async () => {
      mockRegister.mockResolvedValueOnce({ user: { name: 'John Doe' } });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<div>Dashboard Home</div>} />
          </Routes>
        </MemoryRouter>
      );

      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'Password123');
      await userEvent.click(screen.getByRole('button', { name: /create account|register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('John Doe', 'john@example.com', 'Password123');
        expect(screen.getByText('Dashboard Home')).toBeInTheDocument();
      });
    });
  });
});
