/**
 * MANDELA OS — CENTRALIZED ARCHITECTURAL BLUEPRINT DESIGN SYSTEM TOKENS
 *
 * Design Constitution:
 * 1. Pure white structural canvas (#ffffff) and solid ink typography (#000000)
 * 2. Crisp 1px geometric borders (#000000 primary frames, rgba(0,0,0,0.18) internal rules)
 * 3. Active & Primary CTA inversion: solid #000000 fill with #ffffff text
 * 4. Restrained semantic indicators strictly for data state (#16a34a active, #d97706 warn, #dc2626 critical)
 * 5. Sharp geometric discipline: rounded-none / rounded-[2px] / rounded-[4px] — zero pill bubbles
 */

export const DS_COLORS = {
  // 1. Foundational Canvas & Infrastructure
  neutral: {
    obsidian: '#000000',
    surface: '#ffffff',
    surfaceRaised: '#f4f4f5',
    border: '#000000',
    borderSubtle: '#d4d4d8',
    textPrimary: '#000000',
    textMuted: '#52525b',
    textSubtle: '#71717a',
    workspaceLight: '#ffffff',
    workspaceCard: '#ffffff',
    workspaceBorder: '#000000',
  },

  // 2. Monochrome Primary & Architectural Accents
  gold: {
    primary: '#000000',
    bright: '#000000',
    muted: '#52525b',
    surface: '#f4f4f5',
    border: '#000000',
    glow: 'rgba(0, 0, 0, 0.08)',
  },

  // 3. Semantic Carrier State (Strictly restrained to telemetry values)
  emerald: {
    primary: '#16a34a',
    bright: '#16a34a',
    deep: '#15803d',
    glow: 'rgba(22, 163, 74, 0.1)',
    surface: '#f0fdf4',
    border: '#16a34a',
  },

  // 4. Backward-compatible palette mapping
  palette: {
    white: '#ffffff',
    black: '#000000',
    surfaceSoft: '#fafafa',
    surfaceCard: '#ffffff',
    surfaceMuted: '#f4f4f5',
    borderLight: 'rgba(0, 0, 0, 0.14)',
    borderMedium: '#000000',
    borderHard: '#000000',
    textPrimary: '#000000',
    textMuted: '#52525b',
    textSubtle: '#71717a',
  },

  status: {
    live: '#16a34a',
    activeGreen: '#16a34a',
    warningAmber: '#d97706',
    criticalRed: '#dc2626',
    satellite: '#000000',
  },
} as const;

// Crisp geometric discipline — zero pill enclosures
export const DS_RADIUS = {
  sharp: 'rounded-none',
  button: 'rounded-[2px]',
  card: 'rounded-[2px]',
  modal: 'rounded-[2px]',
  container: 'rounded-[4px]',
  pill: 'rounded-[2px]',
} as const;

export const DS_BORDERS = {
  thin: 'border border-black/20',
  precision: 'border border-black',
  subtle: 'border border-zinc-300',
  accent: 'border border-black',
  gold: 'border border-black',
  workspace: 'border border-black',
} as const;

export const DS_TRANSITIONS = {
  fast: 'transition-colors duration-100 ease-out',
  standard: 'transition-colors duration-150 ease-out',
  luxury: 'transition-all duration-150 ease-out',
} as const;

export const ATELIER_TYPOGRAPHY = {
  fontStack: "'Plus Jakarta Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  monoStack: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",

  // Headings
  h1: 'font-sans text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-tight',
  h2: 'font-sans text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug',
  h3: 'font-sans text-base sm:text-lg font-bold text-black leading-snug',
  h4: 'font-mono text-xs uppercase tracking-wider font-bold text-black leading-normal',

  // Section Label
  sectionLabel: 'uppercase tracking-wider text-[11px] font-mono font-bold text-zinc-600',

  // Metrics (Tabular numerals strictly enforced)
  metricLarge: 'font-sans text-3xl sm:text-4xl font-extrabold text-black leading-none tracking-tight tabular-nums',
  metricMedium: 'font-sans text-xl sm:text-2xl font-bold text-black leading-none tabular-nums',

  // Body
  body: 'font-sans text-sm text-zinc-900 leading-relaxed',
  bodyMuted: 'font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed',

  // Telemetry Monospace
  telemetryMono: 'font-mono text-xs text-black tracking-tight tabular-nums',
  telemetryGold: 'font-mono text-xs text-black font-semibold tracking-tight tabular-nums',
  telemetryMicro: 'font-mono text-[11px] text-zinc-600 tracking-tight tabular-nums',
} as const;

export const DS_TYPOGRAPHY = {
  fontSans: 'font-sans',
  fontMono: 'font-mono',
  atelier: ATELIER_TYPOGRAPHY,
  headings: {
    h1: ATELIER_TYPOGRAPHY.h1,
    h2: ATELIER_TYPOGRAPHY.h2,
    h3: ATELIER_TYPOGRAPHY.h3,
    h4: ATELIER_TYPOGRAPHY.h4,
  },
  metrics: {
    large: ATELIER_TYPOGRAPHY.metricLarge,
    medium: ATELIER_TYPOGRAPHY.metricMedium,
    label: 'font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600',
    status: 'font-sans text-xs font-medium text-zinc-700',
  },
  body: {
    base: 'font-sans text-sm text-zinc-900 leading-relaxed',
    muted: 'font-sans text-xs sm:text-sm text-zinc-600 leading-normal',
    mono: 'font-mono text-xs text-black tabular-nums',
    caption: 'uppercase tracking-wider text-[11px] font-mono font-bold text-zinc-600',
  },
} as const;

// Disciplined Rectangular Blueprint Badge Variants
export const DS_BADGE_VARIANTS = {
  live: 'border border-black bg-black text-white',
  gold: 'border border-black bg-zinc-100 text-black font-bold',
  warning: 'border border-amber-700 bg-amber-50 text-amber-900',
  critical: 'border border-red-700 bg-red-50 text-red-900',
  satellite: 'border border-black bg-white text-black',
  telco: 'border border-black bg-white text-black',
  startup: 'border border-zinc-400 bg-zinc-50 text-zinc-800',
  enterprise: 'border border-black bg-black text-white font-bold',
  neutral: 'border border-zinc-400 bg-white text-zinc-900',
} as const;

export type BadgeVariant = keyof typeof DS_BADGE_VARIANTS;

export const TELECOM_THRESHOLDS = {
  latencyMs: {
    excellent: 35,
    acceptable: 85,
    satelliteLeo: 45,
    satelliteGeo: 580,
  },
  asrPercent: {
    target: 85.0,
    warning: 72.0,
    critical: 55.0,
  },
  nerPercent: {
    target: 92.0,
    warning: 80.0,
  },
  jitterMs: {
    carrierMax: 8.0,
  },
  packetLossPercent: {
    carrierMax: 0.05,
  },
} as const;
