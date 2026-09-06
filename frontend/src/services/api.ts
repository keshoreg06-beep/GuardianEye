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
  EvidencePackageItem,
  IncidentItem,
  IncidentReplayItem,
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

  async getEvidenceForIncident(incidentId: string): Promise<EvidencePackageItem> {
    const res = await apiClient.get<EvidencePackageItem>(`/evidence/incident/${incidentId}`);
    return res.data;
  },

  async getIncidentReplay(incidentId: string): Promise<IncidentReplayItem> {
    const res = await apiClient.get<IncidentReplayItem>(`/replay/${incidentId}`);
    return res.data;
  },

  async updateIncidentStatus(payload: {
    incident_id: string;
    new_status: string;
    change_reason: string;
    assigned_to?: string;
    resolution_notes?: string;
  }): Promise<IncidentItem> {
    const res = await apiClient.post<IncidentItem>('/incidents/status', payload);
    return res.data;
  },

  async getAlerts(): Promise<AlertItem[]> {
    const res = await apiClient.get<AlertItem[]>('/alerts');
    return res.data;
  },

  async acknowledgeAlert(alertId: string): Promise<AlertItem> {
    const res = await apiClient.post<AlertItem>('/alerts/acknowledge', { alert_id: alertId });
    return res.data;
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
