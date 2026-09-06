/**
 * GuardianEye API Client
 *
 * The frontend must use real backend data only. If the backend is unavailable or
 * the contract is not present, the request should fail loudly so the UI can show
 * a proper error state rather than fabricating production data.
 */
import axios from 'axios';
import {
  AlertItem,
  AssistantQueryResponse,
  BehaviourEventResponse,
  DashboardSummary,
  DigitalTwinTopology,
  IncidentItem,
  TrajectorySummaryResponse,
  VideoResponse,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

export const GuardianAPI = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<DashboardSummary>('/analytics/dashboard');
    return res.data;
  },

  async getVideos(): Promise<VideoResponse[]> {
    const res = await apiClient.get<VideoResponse[]>('/videos');
    return res.data;
  },

  async getVideoTracks(videoId: string): Promise<TrajectorySummaryResponse> {
    const res = await apiClient.get<TrajectorySummaryResponse>(`/tracks/${videoId}`);
    return res.data;
  },

  async getBehavioursForVideo(videoId: string): Promise<BehaviourEventResponse[]> {
    const res = await apiClient.get<BehaviourEventResponse[]>(`/behaviours/video/${videoId}`);
    return res.data;
  },

  async getIncidents(): Promise<IncidentItem[]> {
    const res = await apiClient.get<IncidentItem[]>('/incidents');
    return res.data;
  },

  async getAlerts(): Promise<AlertItem[]> {
    const res = await apiClient.get<AlertItem[]>('/alerts');
    return res.data;
  },

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    await apiClient.post('/alerts/acknowledge', { alert_id: alertId });
    return true;
  },

  async getDigitalTwinTopology(): Promise<DigitalTwinTopology> {
    const res = await apiClient.get<DigitalTwinTopology>('/digital-twin/topology');
    return res.data;
  },

  async queryAssistant(query: string): Promise<AssistantQueryResponse> {
    const res = await apiClient.post<AssistantQueryResponse>('/assistant/chat', { query });
    return res.data;
  },
};
