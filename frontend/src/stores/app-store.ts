import { create } from 'zustand';

interface AppState {
  selectedWarehouseId: string | null;
  sidebarCollapsed: boolean;
  connectionState: 'LIVE' | 'DEGRADED' | 'RECONNECTING' | 'OFFLINE';
  setSelectedWarehouseId: (warehouseId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setConnectionState: (state: AppState['connectionState']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedWarehouseId: 'Warehouse 01',
  sidebarCollapsed: false,
  connectionState: 'LIVE',
  setSelectedWarehouseId: (warehouseId) => set({ selectedWarehouseId: warehouseId }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setConnectionState: (state) => set({ connectionState: state }),
}));
