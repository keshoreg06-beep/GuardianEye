import { IncidentItem } from '../types';
import { apiClient } from './client';

export async function getIncidents(): Promise<IncidentItem[]> {
  const { data } = await apiClient.get<IncidentItem[]>('/incidents');
  return data;
}
