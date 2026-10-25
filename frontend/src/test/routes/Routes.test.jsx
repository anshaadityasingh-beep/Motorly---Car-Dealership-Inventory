import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { AdminRoute } from '../../routes/AdminRoute';
import * as AuthContextModule from '../../context/AuthContext';

describe('Route Guards', () => {
  describe('ProtectedRoute', () => {
    it('should redirect unauthenticated users to /login', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        isLoading: false,
        isAdmin: false,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
    });

    it('should render protected content when user is authenticated', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { name: 'Alice', role: 'user' },
        isLoading: false,
        isAdmin: false,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('should redirect non-admin authenticated users to /', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { name: 'Bob', role: 'user' },
        isLoading: false,
        isAdmin: false,
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home Dashboard</div>} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<div>Admin Panel Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Home Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Admin Panel Content')).not.toBeInTheDocument();
    });

    it('should allow admin user to access /admin', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { name: 'Super Admin', role: 'admin' },
        isLoading: false,
        isAdmin: true,
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home Dashboard</div>} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<div>Admin Panel Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Panel Content')).toBeInTheDocument();
    });
  });
});
