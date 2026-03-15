import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';

import { AppBackground } from '@shared/components/app-background';
import { palette } from '@shared/constants/theme';
import { AuthContext, AuthProvider } from '@/contexts/auth-context';
import '@shared/lib/i18n';
import { queryClient } from '@shared/lib/query-client';

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync();

// React Navigation theme
const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.surface,
    text: palette.textPrimary,
    border: palette.border,
  },
};

function RootNavigator() {
  const { user, isLoading } = React.use(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // Si el usuario está logueado y trata de acceder o sigue en auth, lo pasamos al dashboard.
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // Si el usuario no está logueado y trata de acceder a main, a login.
      router.replace('/(auth)/login');
    }
  }, [user, isLoading, segments]);

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
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_900Black,
    Inter_800ExtraBold,
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={NavigationTheme}>
          <AppBackground>
            <RootNavigator />
          </AppBackground>
          <StatusBar style="light" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
