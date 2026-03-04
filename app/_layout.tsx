import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppBackground } from '@/components/app-background';

// Custom theme with transparent background so the texture shows through
const FitFlowTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

export default function RootLayout() {
  // TODO: Replace with real auth state (e.g. from a context/provider)
  const isAuthenticated = false;

  return (
    <ThemeProvider value={FitFlowTheme}>
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
