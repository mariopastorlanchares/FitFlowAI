/**
 * FitFlow AI — Design Tokens
 *
 * Single source of truth for all colors and design constants.
 * Used by: tailwind.config.js, React Navigation ThemeProvider,
 * and any inline styles that need brand colors.
 */

export const palette = {
  /** Deep dark gray background */
  background: '#181818',
  /** Card / surface color (lighter gray) */
  surface: '#242424',
  /** Vibrant orange accent */
  primary: '#FF8C00',
  /** Darker orange for button pressed state / glow edges */
  primaryDark: '#E07800',
  /** Lighter orange for highlights */
  primaryLight: '#FFA733',
  /** Primary text */
  textPrimary: '#FFFFFF',
  /** Secondary / muted text */
  textSecondary: '#A0A0A0',
  /** Border / divider */
  border: '#2A2A2A',
  /** Input field background (translucent) */
  inputBackground: 'rgba(255, 255, 255, 0.06)',
  /** Input field border */
  inputBorder: 'rgba(255, 255, 255, 0.15)',
  /** Danger / destructive actions */
  danger: '#FF4444',
  /** Success */
  success: '#22C55E',
  /** Surface Active (Highlight) */
  surfaceActive: '#303030',
  /** Error alias for danger */
  error: '#FF4444',
} as const;

export const fonts = {
  black: 'Inter_900Black',
  extraBold: 'Inter_800ExtraBold',
  bold: 'Inter_700Bold',
  semiBold: 'Inter_600SemiBold',
  regular: 'Inter_400Regular',
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.black,
    fontSize: 28,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  button: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
} as const;
