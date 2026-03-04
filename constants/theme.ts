/**
 * FitFlow AI — Design Tokens
 *
 * Single source of truth for all colors and design constants.
 * Used by: tailwind.config.js, React Navigation ThemeProvider,
 * and any inline styles that need brand colors.
 */

export const palette = {
  /** Pure black background */
  background: '#0D0D0D',
  /** Card / surface color */
  surface: '#1A1A1A',
  /** Vibrant orange accent */
  primary: '#FF8C00',
  /** Primary text */
  textPrimary: '#FFFFFF',
  /** Secondary / muted text */
  textSecondary: '#A0A0A0',
  /** Border / divider */
  border: '#2A2A2A',
  /** Danger / destructive actions */
  danger: '#FF4444',
  /** Success */
  success: '#22C55E',
} as const;
