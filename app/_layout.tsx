import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppBackground } from '@/components/app-background';
import { palette } from '@/constants/theme';

// React Navigation theme — transparent so the AppBackground texture shows through.
// This is separate from Tailwind: Tailwind styles components, this theme controls
// the navigation system's own backgrounds (screen bg, header bg, card bg, etc.)
const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.primary,
    background: 'transparent',
    card: 'transparent',
    text: palette.textPrimary,
    border: palette.border,
  },
};

export default function RootLayout() {
  // TODO: Replace with real auth state (e.g. from a context/provider)
  const isAuthenticated = false;

  return (
    <ThemeProvider value={NavigationTheme}>
      <AppBackground>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="(main)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </AppBackground>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
