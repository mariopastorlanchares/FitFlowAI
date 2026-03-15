/**
 * Theme color hook for FitFlow AI.
 * Since FitFlow is a dark-mode-only app, this simply returns
 * the palette color or an override if provided.
 */

import { palette } from '@shared/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof palette
) {
  // Dark-mode-only: always use the dark override or the palette value
  const colorFromProps = props.dark;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return palette[colorName];
  }
}
