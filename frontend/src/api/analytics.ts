import { DashboardSummary } from '../types';
import { apiClient } from './client';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/analytics/dashboard');
  return data;
}
