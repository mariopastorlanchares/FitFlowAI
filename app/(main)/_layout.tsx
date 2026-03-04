import { Stack } from 'expo-router/stack';

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerStyle: { backgroundColor: 'transparent' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { color: '#FFFFFF', fontWeight: '700' },
                contentStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        </Stack>
    );
}
