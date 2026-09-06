export const appConfig = {
  appName: 'GuardianEye',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  defaultWarehouseId: import.meta.env.VITE_DEFAULT_WAREHOUSE_ID ?? 'default',
} as const;
