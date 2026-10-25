import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppRoutes } from '../App';

describe('App Routing Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login page when navigating to /login', () => {
    const authValue = {
      user: null,
      token: null,
      isLoading: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });

  it('renders register page when navigating to /register', () => {
    const authValue = {
      user: null,
      token: null,
      isLoading: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/register']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated user away from protected root route to /login', () => {
    const authValue = {
      user: null,
      token: null,
      isLoading: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });

  it('redirects non-admin user away from /admin route to /', () => {
    const authValue = {
      user: { _id: 'u1', name: 'Standard User', role: 'user' },
      token: 'valid-token',
      isLoading: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/admin']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Redirected to / which renders the showroom navbar
    expect(screen.getByText(/ApexMotors/i)).toBeInTheDocument();
  });

  it('renders 404 page for unknown routes', () => {
    const authValue = {
      user: null,
      token: null,
      isLoading: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/some-unknown-path-that-does-not-exist']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
