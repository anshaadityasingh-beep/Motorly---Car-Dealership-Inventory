import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as authApi from '../../api/auth.api';

// Component helper to inspect and interact with AuthContext
const TestConsumer = () => {
  const { user, token, isAdmin, login, logout, register } = useAuth();

  return (
    <div>
      <div data-testid="user-name">{user ? user.name : 'No user'}</div>
      <div data-testid="user-role">{user ? user.role : 'No role'}</div>
      <div data-testid="is-admin">{isAdmin ? 'true' : 'false'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <button onClick={() => login('test@example.com', 'Password123')}>Login</button>
      <button onClick={() => register('New User', 'new@example.com', 'Password123')}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should initialize with no user when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  it('should store user and token in state and localStorage on successful login', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'test@example.com', role: 'admin' };
    const mockToken = 'mock-jwt-token';
    vi.spyOn(authApi, 'loginApi').mockResolvedValue({ user: mockUser, token: mockToken });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      expect(screen.getByTestId('token')).toHaveTextContent('mock-jwt-token');
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    });
  });

  it('should clear user and token on logout', async () => {
    localStorage.setItem('token', 'existing-token');
    const mockUser = { id: '1', name: 'Jane', role: 'user' };
    vi.spyOn(authApi, 'getMeApi').mockResolvedValue({ user: mockUser });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Jane');
    });

    await userEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should automatically clear session on 401 unauthorized session check', async () => {
    localStorage.setItem('token', 'expired-token');
    const unauthorizedError = { response: { status: 401 } };
    vi.spyOn(authApi, 'getMeApi').mockRejectedValue(unauthorizedError);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
