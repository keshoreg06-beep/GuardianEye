import { create } from 'zustand';

interface AppState {
  selectedWarehouseId: string | null;
  sidebarCollapsed: boolean;
  setSelectedWarehouseId: (warehouseId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedWarehouseId: null,
  sidebarCollapsed: false,
  setSelectedWarehouseId: (warehouseId) => set({ selectedWarehouseId: warehouseId }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
