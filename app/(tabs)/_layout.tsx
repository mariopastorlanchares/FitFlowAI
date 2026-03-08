import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';

export default function TabLayout() {
    const { t } = useTranslation();
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Dinámicamente decidir si hay espacio para mostrar la etiqueta de texto (ej. height >= 700px)
    const showLabel = height >= 700;

    return (
        <Tabs
            screenOptions={{
                sceneStyle: { backgroundColor: palette.background },
                headerShown: false,
                tabBarShowLabel: showLabel,
                tabBarStyle: {
                    backgroundColor: palette.background,
                    borderTopColor: palette.border,
                    // Calcular altura realzando el paddingBottom en dispositivos con notch/home bar
                    height: (showLabel ? 60 : 50) + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : (showLabel ? 8 : 0),
                    paddingTop: showLabel ? 8 : 0,
                },
                tabBarActiveTintColor: palette.primary,
                tabBarInactiveTintColor: palette.textSecondary,
                tabBarLabelStyle: {
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 11,
                }
                // The background texture is handled by the root AppBackground, we need transparent to let it shine if we want
                // but typically TabBar is solid. We'll keep it solid very dark.
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('dashboard.tabs.home'),
                    tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: t('dashboard.tabs.workout'),
                    tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: t('dashboard.tabs.stats'),
                    tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('dashboard.tabs.profile'),
                    tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
