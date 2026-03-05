import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AppBackground } from '@/components/app-background';
import { palette } from '@/constants/theme';
import { AuthContext, AuthProvider } from '@/contexts/auth-context';

// React Navigation theme — transparent so the AppBackground texture shows through.
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

function RootNavigator() {
  const { user, isLoading } = React.use(AuthContext);

  // Show a loading spinner while Firebase checks auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {user ? (
        <Stack.Screen name="(main)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={NavigationTheme}>
        <AppBackground>
          <RootNavigator />
        </AppBackground>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
