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
  /** Elevated dark surface for badges and timers */
  surfaceElevated: '#1C1C1E',
  /** Muted dark surface for inputs and secondary controls */
  surfaceMuted: '#1E1E20',
  /** Strong inset surface for nested cards */
  surfaceInset: '#121212',
  /** Vibrant orange accent */
  primary: '#FF8C00',
  /** Darker orange for button pressed state / glow edges */
  primaryDark: '#E07800',
  /** Lighter orange for highlights */
  primaryLight: '#FFA733',
  /** Primary tint backgrounds */
  primaryTint: 'rgba(255, 140, 0, 0.15)',
  /** Soft primary tint for hover and pressed states */
  primaryTintSoft: 'rgba(255, 140, 0, 0.08)',
  /** Faint primary tint for idle states */
  primaryTintFaint: 'rgba(255, 140, 0, 0.04)',
  /** Primary-tinted borders */
  primaryBorder: 'rgba(255, 140, 0, 0.3)',
  /** Primary text */
  textPrimary: '#FFFFFF',
  /** Secondary / muted text */
  textSecondary: '#A0A0A0',
  /** Text shown on top of primary CTAs */
  textOnPrimary: '#3A3A3A',
  /** Border / divider */
  border: '#2A2A2A',
  /** Subtle border for quiet cards */
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  /** Soft border for pills and chips */
  borderSoft: 'rgba(255, 255, 255, 0.1)',
  /** Neutral translucent fill */
  neutralTint: 'rgba(255, 255, 255, 0.08)',
  /** Faint neutral translucent fill */
  neutralTintFaint: 'rgba(255, 255, 255, 0.03)',
  /** Input field background (translucent) */
  inputBackground: 'rgba(255, 255, 255, 0.06)',
  /** Input field border */
  inputBorder: 'rgba(255, 255, 255, 0.15)',
  /** Active input border */
  inputBorderActive: 'rgba(255, 140, 0, 0.52)',
  /** Modal and screen backdrop */
  backdrop: 'rgba(0, 0, 0, 0.6)',
  /** Danger / destructive actions */
  danger: '#FF4444',
  /** Danger tinted background */
  dangerTint: 'rgba(255, 68, 68, 0.1)',
  /** Danger tinted border */
  dangerBorder: 'rgba(255, 68, 68, 0.32)',
  /** Success */
  success: '#22C55E',
  /** Success tinted background */
  successTint: 'rgba(34, 197, 94, 0.12)',
  /** Success tinted border */
  successBorder: 'rgba(34, 197, 94, 0.34)',
  /** Surface Active (Highlight) */
  surfaceActive: '#303030',
  /** Error alias for danger */
  error: '#FF4444',
} as const;

export const gradients = {
  primaryButton: ['#FFB800', '#FF9500', '#EE7700'] as const,
} as const;

export const effects = {
  primaryGlow: '0 4px 28px rgba(255, 140, 0, 0.55), 0 0 12px rgba(255, 180, 0, 0.3)',
  primaryButton: '0 10px 20px rgba(255, 140, 0, 0.18)',
  modal: '0 18px 48px rgba(0, 0, 0, 0.32)',
  card: '0 10px 24px rgba(0, 0, 0, 0.18)',
  authPanel: '0 18px 42px rgba(0, 0, 0, 0.24)',
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
