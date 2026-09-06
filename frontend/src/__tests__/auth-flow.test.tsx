import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { LoginPage } from '../components/auth/LoginPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useSessionStore } from '../stores/session-store';

const { mockLogin, mockRefresh, mockMe } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockRefresh: vi.fn(),
  mockMe: vi.fn(),
}));

vi.mock('../services/auth', () => ({
  authService: {
    login: mockLogin,
    refresh: mockRefresh,
    getCurrentUser: mockMe,
  },
  getErrorMessage: (error: unknown) => (error instanceof Error ? error.message : 'Authentication failed'),
}));

describe('auth flow', () => {
  beforeEach(() => {
    useSessionStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isHydrated: true,
    });
    vi.clearAllMocks();
  });

  it('logs in and redirects to the protected route after a successful backend login', async () => {
    mockLogin.mockResolvedValue({
      tokens: { access_token: 'access-token', refresh_token: 'refresh-token', token_type: 'bearer', expires_in: 3600 },
      user: {
        id: 'u-1',
        email: 'admin@guardianeye.ai',
        full_name: 'Admin User',
        is_active: true,
        is_superuser: false,
        role: { id: 'r-1', name: 'Admin', description: null, permissions: null, created_at: '2024-01-01T00:00:00Z' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@guardianeye.ai' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@guardianeye.ai', password: 'StrongPass123' });
    });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('blocks unauthenticated users from accessing a protected route', async () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private Area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to unauthorized when a user lacks the required role', () => {
    useSessionStore.setState({
      user: {
        id: 'u-2',
        email: 'operator@guardianeye.ai',
        full_name: 'Operator User',
        is_active: true,
        is_superuser: false,
        role: { id: 'r-2', name: 'Operator', description: null, permissions: null, created_at: '2024-01-01T00:00:00Z' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: Date.now() + 3600_000,
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <MemoryRouter initialEntries={['/admin-panel']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <div>Admin Panel</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });
});
