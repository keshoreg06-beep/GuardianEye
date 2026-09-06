import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useSessionStore } from '../stores/session-store';

describe('application shell', () => {
  beforeEach(() => {
    useSessionStore.setState({
      user: {
        id: 'user-1',
        email: 'admin@guardianeye.ai',
        full_name: 'Admin User',
        is_active: true,
        is_superuser: false,
        role: { id: 'role-1', name: 'Admin', description: null, permissions: null, created_at: '2024-01-01T00:00:00Z' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: Date.now() + 3600_000,
      isAuthenticated: true,
      isHydrated: true,
    });
  });

  it('supports toggling the sidebar and opening the command palette with Ctrl+K', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Workspace Content</div>
        </AppLayout>
      </MemoryRouter>,
    );

    expect(screen.getByText('Warehouse')).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /collapse sidebar/i });
    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();
  });

  it('opens the grounded copilot drawer from the app shell', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Workspace Content</div>
        </AppLayout>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /ask copilot/i }));

    expect(screen.getByText(/grounded ai copilot/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument();
  });

  it('exposes the human review workspace entry point', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Workspace Content</div>
        </AppLayout>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /human review/i })).toBeInTheDocument();
  });
});
