import { AssistantQueryResponse } from '../types';
import { apiClient } from './client';

export async function queryAssistant(query: string): Promise<AssistantQueryResponse> {
  const { data } = await apiClient.post<AssistantQueryResponse>('/assistant/chat', { query });
  return data;
}
