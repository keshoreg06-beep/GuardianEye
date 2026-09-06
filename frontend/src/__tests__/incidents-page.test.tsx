import { render, screen, waitFor } from '@testing-library/react';
import { IncidentsPage } from '../pages/IncidentsPage';
import { vi } from 'vitest';

const { mockIncidents } = vi.hoisted(() => ({
  mockIncidents: [
    {
      id: 'inc-1',
      incident_code: 'INC-1001',
      behaviour_event_id: 'evt-1',
      warehouse_id: 'wh-1',
      zone_id: 'zone-1',
      camera_id: 'cam-1',
      title: 'Carton drop in loading bay',
      summary: 'Heavy carton dropped from lift.',
      severity: 'CRITICAL',
      status: 'DETECTED',
      assigned_to: null,
      resolved_at: null,
      resolution_notes: null,
      created_at: '2024-01-01T10:15:00Z',
      updated_at: '2024-01-01T10:15:00Z',
    },
  ],
}));

vi.mock('../services/api', () => ({
  GuardianAPI: {
    getIncidents: vi.fn().mockResolvedValue(mockIncidents),
    updateIncidentStatus: vi.fn().mockResolvedValue({
      ...mockIncidents[0],
      status: 'UNDER_REVIEW',
    }),
  },
}));

describe('incidents page', () => {
  it('shows status transitions supported by the backend contract for the selected incident', async () => {
    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Incident Board')).toBeInTheDocument();
    });

    screen.getByRole('button', { name: 'Manage Case' }).click();

    await waitFor(() => {
      expect(screen.getByText('Update incident status')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'ALERTED' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ACKNOWLEDGED' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UNDER_REVIEW' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'REJECTED' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACTION_TAKEN' })).not.toBeInTheDocument();
  });
});
