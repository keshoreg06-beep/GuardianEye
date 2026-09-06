import { AlertItem } from '../types';
import { apiClient } from './client';

export async function getAlerts(): Promise<AlertItem[]> {
  const { data } = await apiClient.get<AlertItem[]>('/alerts');
  return data;
}

export async function acknowledgeAlert(alertId: string): Promise<AlertItem> {
  const { data } = await apiClient.post<AlertItem>('/alerts/acknowledge', { alert_id: alertId });
  return data;
}
