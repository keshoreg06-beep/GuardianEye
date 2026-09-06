import { DigitalTwinTopology } from '../types';
import { apiClient } from './client';

export async function getDigitalTwinTopology(): Promise<DigitalTwinTopology> {
  const { data } = await apiClient.get<DigitalTwinTopology>('/digital-twin/topology');
  return data;
}
