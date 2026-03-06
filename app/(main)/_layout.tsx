import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { palette } from '@/constants/theme';

export default function MainTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: palette.primary,
                tabBarInactiveTintColor: palette.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#121212', // Very dark/nearly black matching the mockup
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.05)',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home-variant" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="entrenar"
                options={{
                    title: 'Entrenar',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="dumbbell" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="analitica"
                options={{
                    title: 'Analítica',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="chart-line-variant" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-outline" size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
