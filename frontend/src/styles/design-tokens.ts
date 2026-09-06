export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const designTokens = {
  colors: {
    background: '#070B12',
    navigation: '#0B111A',
    panel: '#101923',
    panelElevated: '#151F2B',
    border: '#1D2936',
    text: '#E5EEF9',
    textMuted: '#8EA0B6',
    accent: '#4CC9F0',
    low: '#34D399',
    medium: '#FBBF24',
    high: '#F97316',
    critical: '#EF4444',
    white: '#F8FAFC',
    shadow: 'rgba(2, 6, 23, 0.55)',
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    mono: '"IBM Plex Sans", "SFMono-Regular", monospace',
    heading: {
      xs: '0.7rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.625rem',
      xxl: '2.25rem',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    tracking: {
      tight: '-0.04em',
      normal: '0',
      wide: '0.12em',
    },
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  shadows: {
    sm: '0 8px 18px rgba(2, 6, 23, 0.28)',
    md: '0 14px 30px rgba(2, 6, 23, 0.34)',
    lg: '0 18px 38px rgba(2, 6, 23, 0.42)',
  },
  transitions: {
    fast: '150ms ease',
    medium: '220ms ease',
    slow: '320ms ease',
  },
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 40,
    overlay: 50,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  semantic: {
    low: {
      label: 'LOW',
      color: '#34D399',
      bg: 'rgba(52, 211, 153, 0.12)',
      ring: 'rgba(52, 211, 153, 0.35)',
    },
    medium: {
      label: 'MEDIUM',
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.12)',
      ring: 'rgba(251, 191, 36, 0.35)',
    },
    high: {
      label: 'HIGH',
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      ring: 'rgba(249, 115, 22, 0.35)',
    },
    critical: {
      label: 'CRITICAL',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      ring: 'rgba(239, 68, 68, 0.35)',
    },
  },
} as const;

export const riskOrder: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const riskColorMap: Record<RiskLevel, string> = {
  LOW: designTokens.colors.low,
  MEDIUM: designTokens.colors.medium,
  HIGH: designTokens.colors.high,
  CRITICAL: designTokens.colors.critical,
};
